import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  CommerceClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetProductOrdersResult,
  ProductOrderInfo,
  OrderContent,
  ProductOrderContent,
  DeliveryContent,
  ProductOrderBase,
  ProductOrderDetail,
  ProductOrderCommission,
  ProductOrderDelivery,
} from "../models/index.js";
import { GetProductOrdersCommandInput, GetProductOrdersCommandOutput } from "../commands/GetProductOrdersCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_GetProductOrdersCommand: RequestSerializer<
  GetProductOrdersCommandInput,
  CommerceClientResolvedConfig
> = async (input, coifng) => {
  const hostname = "api.commerce.naver.com";
  const path = "/external/v1/pay-order/seller/product-orders/query";
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

export const de_GetProductOrdersCommand: ResponseDeserializer<
  GetProductOrdersCommandOutput,
  CommerceClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_GetProductOrdersResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_GetProductOrdersResult = (output: any): GetProductOrdersResult => {
  return {
    timestamp: new Date(output.timestamp ?? new Date().getTime()).toISOString(),
    traceId: output.traceId ?? "",
    data: output.data ? de_ProductOrderInfoList(output.data) : [],
  };
};

const de_ProductOrderInfoList = (output: any[]): ProductOrderInfo[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_ProductOrderInfo(entry));
  return result;
};

const de_ProductOrderInfo = (output: any): ProductOrderInfo => {
  return {
    order: output.order ? de_OrderContent(output.order) : ({} as OrderContent),
    productOrder: output.productOrder ? de_ProductOrderContent(output.productOrder) : ({} as ProductOrderContent),
    delivery: output.delivery ? de_DeliveryContent(output.delivery) : ({} as DeliveryContent),
  };
};

const de_OrderContent = (output: any): OrderContent => {
  return {
    orderId: output.orderId ?? "",
    orderDate: new Date(output.orderDate).toISOString() ?? "",
    ordererId: output.ordererId ?? "",
    ordererNo: output.ordererNo ?? "",
    ordererName: output.ordererName ?? "",
    ordererTel: output.ordererTel ?? "",
    isDeliveryMemoParticularInput: output.isDeliveryMemoParticularInput ?? "",
    paymentDate: new Date(output.paymentDate).toISOString() ?? "",
    paymentMeans: output.paymentMeans ?? "",
    payLocationType: output.payLocationType ?? "",
    orderDiscountAmount: output.orderDiscountAmount ?? 0,
    generalPaymentAmount: output.generalPaymentAmount ?? 0,
    naverMileagePaymentAmount: output.naverMileagePaymentAmount ?? 0,
    chargeAmountPaymentAmount: output.chargeAmountPaymentAmount ?? 0,
    payLaterPaymentAmount: output.payLaterPaymentAmount ?? 0,
    isMembershipSubscribed: output.isMembershipSubscribed ?? false,
  };
};

const de_ProductOrderContent = (output: any): ProductOrderContent => {
  return {
    ...de_ProductOrderBase(output),
    ...de_ProductOrderDetail(output),
    ...de_ProductOrderCommission(output),
    ...de_ProductOrderDelivery(output),
  };
};

const de_DeliveryContent = (output: any): DeliveryContent => {
  return {
    deliveredDate: new Date(output.deliveredDate).toISOString() ?? "",
    deliveryMethod: output.deliveryMethod ?? "",
    deliveryStatus: output.deliveryStatus ?? "",
    sendDate: new Date(output.sendDate).toISOString() ?? "",
    isWrongTrackingNumber: output.payLocationType ?? false,
  };
};

const de_ProductOrderBase = (output: any): ProductOrderBase => {
  return {
    productOrderId: output.productOrderId ?? "",
    productOrderStatus: output.productOrderStatus ?? "",
    mallId: output.mallId ?? "",
    sellerProductCode: output.sellerProductCode ?? "",
    groupProductId: output.groupProductId ?? 0,
    originalProductId: output.originalProductId ?? "",
    productId: output.productId ?? "",
    productName: output.productName ?? "",
    optionCode: output.optionCode ?? "",
    optionPrice: output.optionPrice ?? 0,
    unitPrice: output.unitPrice ?? 0,
  };
};

const de_ProductOrderDetail = (output: any): ProductOrderDetail => {
  return {
    quantity: output.quantity ?? 0,
    totalProductAmount: output.totalProductAmount ?? 0,
    totalPaymentAmount: output.totalPaymentAmount ?? 0,
    productDiscountAmount: output.productDiscountAmount ?? 0,
    sellerBurdenStoreDiscountAmount: output.sellerBurdenStoreDiscountAmount ?? 0,
    inflowPath: output.inflowPath ?? "",
  };
};

const de_ProductOrderCommission = (output: any): ProductOrderCommission => {
  return {
    commissionRatingType: output.commissionRatingType ?? "",
    commissionPrePayStatus: output.commissionPrePayStatus ?? "",
    expectedSettlementAmount: output.expectedSettlementAmount ?? 0,
    paymentCommission: output.paymentCommission ?? 0,
    knowledgeShoppingSellingInterlockCommission: output.knowledgeShoppingSellingInterlockCommission ?? 0,
    saleCommission: output.saleCommission ?? 0,
    channelCommission: output.channelCommission ?? 0,
  };
};

const de_ProductOrderDelivery = (output: any): ProductOrderDelivery => {
  return {
    expectedDeliveryMethod: output.expectedDeliveryMethod ?? "",
    deliveryAttributeType: output.deliveryAttributeType ?? "",
    placeOrderDate: new Date(output.placeOrderDate).toISOString() ?? "",
    placeOrderStatus: output.placeOrderStatus ?? "",
    shippingAddress: output.shippingAddress ? de_shippingAddress(output.shippingAddress) : { name: "", tel1: "" },
  };
};

const de_shippingAddress = (output: any): ProductOrderDelivery["shippingAddress"] => {
  return {
    name: output.name ?? "",
    tel1: output.tel1 ?? "",
  };
};
