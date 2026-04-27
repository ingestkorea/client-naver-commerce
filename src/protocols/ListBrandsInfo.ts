import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  CommerceClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  ListBrandsInfoResult,
  BrandInfo,
} from "../models/index.js";
import { ListBrandsInfoCommandInput, ListBrandsInfoCommandOutput } from "../commands/ListBrandsInfoCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_ListBrandsInfoCommand: RequestSerializer<
  ListBrandsInfoCommandInput,
  CommerceClientResolvedConfig
> = async (input, coifng) => {
  const hostname = "api.commerce.naver.com";
  const path = "/external/v1/product-brands";
  const headers = {
    host: hostname,
    accept: "application/json",
  };
  const query = Object.entries(input).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = String(value); // 숫자(limitCount)나 Enum도 여기서 문자열이 됨
    }
    return acc;
  }, {} as Record<string, string>);

  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname,
    path,
    headers,
    query,
  });
};

export const de_ListBrandsInfoCommand: ResponseDeserializer<
  ListBrandsInfoCommandOutput,
  CommerceClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_ListBrandsInfoResult(data);

  return {
    $metadata: deserializeMetadata(response),
    data: compact(contents),
  };
};

const de_ListBrandsInfoResult = (output: any): ListBrandsInfoResult => {
  return Array.isArray(output) ? output.filter((e) => e != null).map((entry) => de_BrandInfo(entry)) : [];
};

const de_BrandInfo = (output: any): BrandInfo => {
  return {
    name: output.name ?? "",
    id: output.id ?? "",
  };
};
