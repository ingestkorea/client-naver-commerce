import { MetadataBearer, Handler, NaverCommerceError } from "../models/index.js";
import { INGESTKOREA_REQUEST_LOG, INGESTKOREA_RETRY, INGESTKOREA_RETRY_DELAY } from "./constants.js";

export const middlewareRetry =
  <I extends object, O extends MetadataBearer>(next: Handler<I, O>): Handler<I, O> =>
  async (input, context) => {
    const MAX_RETRIES = 3;
    const MIN_DELAY_MS = 300;
    const BASE_DELAY_MS = 500;
    const MAX_DELAY_MS = 5_000;

    let attempts = 0;
    let totalRetryDelay = 0;

    input.request.headers = input.request.headers ?? {};

    while (attempts < MAX_RETRIES) {
      attempts++;

      const requestLog = `attempt=${attempts}; max=${MAX_RETRIES}; totalRetryDelay=${totalRetryDelay}`;
      input.request.headers[INGESTKOREA_REQUEST_LOG] = requestLog;

      try {
        const { response, output } = await next(input, context);

        response.headers[INGESTKOREA_RETRY] = attempts.toString();
        response.headers[INGESTKOREA_RETRY_DELAY] = totalRetryDelay.toString();

        output.$metadata = {
          ...output.$metadata,
          attempts: attempts,
          totalRetryDelay: totalRetryDelay,
        };

        return { response, output };
      } catch (error) {
        // 표준화
        let currentError: NaverCommerceError;
        if (error instanceof NaverCommerceError) {
          currentError = error;
        } else {
          currentError = new NaverCommerceError({
            code: "SDK.UNKNOWN_ERROR",
            message: String((error as any)?.message ?? error),
            timestamp: new Date().toISOString(),
            invalidInputs: [],
          });
        }

        const isRetryable = isRetryablePrefix.some((prefix) => currentError.code.startsWith(prefix));
        if (!isRetryable) {
          throw currentError;
        }

        if (attempts >= MAX_RETRIES) {
          currentError.invalidInputs.push({
            name: "retryContext",
            type: "final_attempt",
            message: requestLog,
          });
          throw currentError;
        }

        const exp = BASE_DELAY_MS * 2 ** (attempts - 1);
        const capped = Math.min(MAX_DELAY_MS, exp);
        const baseWait = Math.max(MIN_DELAY_MS, Math.floor(capped / 2));
        const jitter = Math.floor(Math.random() * (capped - baseWait));
        const delay = baseWait + jitter;

        totalRetryDelay += delay;

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new NaverCommerceError({
      code: "SDK.UNKNOWN_ERROR",
      message: "Unexpected retry loop termination",
      timestamp: new Date().toISOString(),
      invalidInputs: [],
    });
  };

const isRetryablePrefix = [
  "GW.RATE_LIMIT",
  "GW.QUOTA_LIMIT",
  "GW.PROXY",
  "GW.INTERNAL_SERVER_ERROR",
  "GW.BLOCK",
  "GW.TIMEOUT",
];
