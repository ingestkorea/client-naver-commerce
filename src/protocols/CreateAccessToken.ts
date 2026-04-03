import { hashSync } from "bcrypt";
import { HttpRequest, buildQueryString } from "@ingestkorea/util-http-handler";
import {
  CommerceClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  CreateAccessTokenResult,
} from "../models/index.js";
import { CreateAccessTokenInput, CreateAccessTokenOutput } from "../commands/CreateAccessToken.js";
import { deserializeMetadata, parseBody, parseErrorBody } from "./constants.js";

export const se_CreateAccessTokenCommand: RequestSerializer<
  CreateAccessTokenInput,
  CommerceClientResolvedConfig
> = async (input, config) => {
  const hostname = "api.commerce.naver.com";
  const path = "/external/v1/oauth2/token";
  const headers = {
    host: hostname,
    accept: "application/json",
    "content-type": "application/x-www-form-urlencoded",
  };

  const timestamp = new Date().getTime().toString();
  const password = `${config.credentials.appId}_${timestamp}`;
  const hashed = hashSync(password, config.credentials.appSecret);
  const signature = Buffer.from(hashed, "utf-8").toString("base64");

  const body = buildQueryString({
    type: "SELF",
    timestamp,
    client_id: config.credentials.appId,
    client_secret_sign: signature,
    grant_type: "client_credentials",
  });

  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname: hostname,
    path: path,
    headers: headers,
    body: body,
  });
};

export const de_CreateAccessTokenCommand: ResponseDeserializer<
  CreateAccessTokenOutput,
  CommerceClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  let data = await parseBody(response);

  let contents: any = {};
  contents = de_CreateAccessTokenResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_CreateAccessTokenResult = (output: any): CreateAccessTokenResult => {
  return {
    access_token: output.access_token ?? "",
    expires_in: Number(output.expires_in) ?? 0,
    token_type: output.token_type ?? "",
  };
};
