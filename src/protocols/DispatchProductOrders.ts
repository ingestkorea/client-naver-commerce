import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  CommerceClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  DispatchProductOrdersResult,
  DispatchProductOrderSuccessList,
  DispatchProductOrderFail,
} from "../models/index.js";
import {
  DispatchProductOrdersCommandInput,
  DispatchProductOrdersCommandOutput,
} from "../commands/DispatchProductOrdersCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_DispatchProductOrdersCommand: RequestSerializer<
  DispatchProductOrdersCommandInput,
  CommerceClientResolvedConfig
> = async (input, coifng) => {
  const hostname = "api.commerce.naver.com";
  const path = "/external/v1/pay-order/seller/product-orders/dispatch";
  const headers = {
    host: hostname,
    accept: "application/json",
    "content-type": "application/json",
  };
  const body = JSON.stringify(input);

  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname,
    path,
    headers,
    body,
  });
};

export const de_DispatchProductOrdersCommand: ResponseDeserializer<
  DispatchProductOrdersCommandOutput,
  CommerceClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_DispatchProductOrdersResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_DispatchProductOrdersResult = (output: any): DispatchProductOrdersResult => {
  return {
    timestamp: new Date(output.timestamp ?? new Date().getTime()).toISOString(),
    traceId: output.traceId ?? "",
    data: {
      successProductOrderIds: output.data?.successProductOrderIds
        ? de_DispatchProductOrderSuccessList(output.data?.successProductOrderIds)
        : [],
      failProductOrderInfos: output.data?.failProductOrderInfos
        ? de_DispatchProductOrderFailList(output.data.failProductOrderInfos)
        : [],
    },
  };
};

const de_DispatchProductOrderSuccessList = (output: any[]): DispatchProductOrderSuccessList => {
  return (output || []).filter((e) => !!e);
};

const de_DispatchProductOrderFailList = (output: any[]): DispatchProductOrderFail[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_DispatchProductOrderFail(entry));
  return result;
};

const de_DispatchProductOrderFail = (output: any): DispatchProductOrderFail => {
  return {
    productOrderId: output.productOrderId ?? "",
    code: output.code ?? "",
    message: output.message ?? "",
  };
};
