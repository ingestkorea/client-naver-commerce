import { HttpResponse, collectBodyString, destroyStream } from "@ingestkorea/util-http-handler";
import { ResponseMetadata, CommerceErrorInfo, NaverCommerceError } from "../models/index.js";
import {
  INGESTKOREA_RETRY,
  INGESTKOREA_RETRY_DELAY,
  NAVER_COMMERCE_TRACE_ID,
  NAVER_COMMERCE_RATE_LIMIT,
} from "../middleware/constants.js";

export const deserializeMetadata = (response: HttpResponse): ResponseMetadata => {
  const attempts = response.headers[INGESTKOREA_RETRY] || undefined;
  const totalRetryDelay = response.headers[INGESTKOREA_RETRY_DELAY] || undefined;
  const traceId = response.headers[NAVER_COMMERCE_TRACE_ID] || undefined;
  const rateLimit = response.headers[NAVER_COMMERCE_RATE_LIMIT] || undefined;

  return {
    httpStatusCode: response.statusCode,
    ...(attempts && { attempts: Number(attempts) }),
    ...(totalRetryDelay && { totalRetryDelay: Number(totalRetryDelay) }),
    ...(traceId && { traceId }),
    ...(rateLimit && { rateLimit: Number(rateLimit) }),
  };
};

export const parseBody = async (output: HttpResponse): Promise<any> => {
  const { statusCode, headers, body: streamBody } = output;

  if (!isJsonResponse(headers["content-type"])) {
    await destroyStream(streamBody);

    throw new NaverCommerceError({
      code: "SDK.BAD_REQUEST",
      message: "reponse content-type is not application/json",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const data = await collectBodyString(streamBody);
    return data.length ? JSON.parse(data) : {};
  } catch (e) {
    await destroyStream(streamBody);

    throw new NaverCommerceError({
      code: "SDK.BAD_REQUEST",
      message: e instanceof Error ? e.message : "parse response body error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const parseErrorBody = async (output: HttpResponse): Promise<never> => {
  const { statusCode, headers, body: streamBody } = output;

  if (!isJsonResponse(headers["content-type"])) {
    await destroyStream(streamBody);

    throw new NaverCommerceError({
      code: "SDK.REQUEST_ERROR",
      message: "response content-type is not application/json",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const data = await collectBodyString(streamBody);
    const commerceError = isCommerceErrorInfo(data);

    if (commerceError) {
      throw new NaverCommerceError(commerceError);
    }

    throw new NaverCommerceError({
      code: "SDK.UNKNOWN_ERROR",
      message: `${statusCode} - something went wrong`,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    await destroyStream(streamBody);
    throw e;
  }
};

const commerceErrorInfoSpec: [keyof CommerceErrorInfo, string][] = [
  ["code", "string"],
  ["message", "string"],
  ["timestamp", "string"],
];

const isJsonResponse = (contentType?: string): boolean => {
  return contentType?.toLowerCase().includes("application/json") ?? false;
};

const isCommerceErrorInfo = (input: unknown): CommerceErrorInfo | null => {
  if (input === undefined || input === null || typeof input !== "string") return null;

  try {
    const obj = JSON.parse(input) as Record<string, unknown>;
    for (const [key, expectedType] of commerceErrorInfoSpec) {
      if (!(key in obj) || typeof obj[key] !== expectedType) {
        return null;
      }
    }

    const result: CommerceErrorInfo = {
      code: obj.code as string,
      message: obj.message as string,
      timestamp: obj.timestamp as string,
    };

    if (typeof obj.traceId === "string") {
      result.traceId = obj.traceId;
    }

    if (Array.isArray(obj.invalidInputs)) {
      const isValidArray = obj.invalidInputs.every(
        (item: any) =>
          typeof item?.name === "string" && typeof item?.type === "string" && typeof item?.message === "string"
      );

      if (isValidArray) {
        result.invalidInputs = obj.invalidInputs;
      }
    }

    return result;
  } catch {
    return null;
  }
};

export const compact = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => compact(item)) as any;
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined) // undefined 필드 제거
        .map(([key, value]) => [key, compact(value)]) // 내부 값 재귀 처리
    ) as any;
  }

  return obj;
};
