import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  CommerceClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  ListChangedOrderStatusesResult,
  ChangedOrderStatus,
  More,
} from "../models/index.js";
import {
  ListChangedOrderStatusesCommandInput,
  ListChangedOrderStatusesCommandOutput,
} from "../commands/ListChangedOrderStatusesCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody } from "./constants.js";

export const se_ListChangedOrderStatusesCommand: RequestSerializer<
  ListChangedOrderStatusesCommandInput,
  CommerceClientResolvedConfig
> = async (input, config) => {
  const hostname = "api.commerce.naver.com";
  const path = "/external/v1/pay-order/seller/product-orders/last-changed-statuses";
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

export const de_ListChangedOrderStatusesCommand: ResponseDeserializer<
  ListChangedOrderStatusesCommandOutput,
  CommerceClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_ListChangedOrderStatusesResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_ListChangedOrderStatusesResult = (output: any): ListChangedOrderStatusesResult => {
  return {
    timestamp: new Date(output.timestamp ?? new Date().getTime()).toISOString(),
    traceId: output.traceId ?? "",
    data: {
      count: output.data?.count ?? 0,
      lastChangeStatuses: output.data?.lastChangedStatuses
        ? de_ChangedOrderStatusList(output.data.lastChangedStatuses)
        : [],
      ...(output.more && { more: de_More(output.more) }),
    },
  };
};

const de_ChangedOrderStatusList = (output: any[]): ChangedOrderStatus[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_ChangedOrderStatus(entry));
  return result;
};

const de_ChangedOrderStatus = (output: any): ChangedOrderStatus => {
  return {
    orderId: output.orderId ?? "",
    lastChangedDate: output.lastChangedDate ? new Date(output.lastChangedDate).toISOString() : "",
    lastChangedType: output.lastChangedType ?? "",
    productOrderId: output.productOrderId ?? "",
    productOrderStatus: (output.productOrderStatus as ChangedOrderStatus["productOrderStatus"]) ?? "",
    receiverAddressChanged: output.receiverAddressChanged ?? false,

    paymentDate: output.paymentDate ?? "",
    claimType: (output.claimType as ChangedOrderStatus["claimType"]) ?? "",

    claimStatus: output.claimStatus ?? "",
    giftReceivingStatus: output.giftReceivingStatus ?? "",
  };
};

const de_More = (output: any): More => {
  return {
    moreFrom: output.moreFrom ? new Date(output.moreFrom).toISOString() : "",
    moreSequence: output.moreSequence ?? "",
  };
};
