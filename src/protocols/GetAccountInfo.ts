import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  CommerceClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetAccountInfoResult,
} from "../models/index.js";
import { GetAccountInfoInput, GetAccountInfoOutput } from "../commands/GetAccountInfo.js";
import { deserializeMetadata, parseBody, parseErrorBody } from "./constants.js";

export const se_GetAccountInfoCommand: RequestSerializer<GetAccountInfoInput, CommerceClientResolvedConfig> = async (
  input,
  coifng
) => {
  const hostname = "api.commerce.naver.com";
  const path = "/external/v1/seller/account";
  const headers = {
    host: hostname,
    accept: "application/json",
  };

  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname: hostname,
    path: path,
    headers: headers,
  });
};

export const de_GetAccountInfoCommand: ResponseDeserializer<
  GetAccountInfoOutput,
  CommerceClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  let data = await parseBody(response);

  let contents: any = {};
  contents = de_GetAccountInfoResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_GetAccountInfoResult = (output: any): GetAccountInfoResult => {
  return {
    accountId: output.accountId ?? "",
    accountUid: output.accountUid ?? "",
    grade: output.grade ?? "",
  };
};
