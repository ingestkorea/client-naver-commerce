export const DELIVERY_METHOD = {
  DELIVERY: "DELIVERY",
  VISIT_RECEIPT: "VISIT_RECEIPT",
  DIRECT_DELIVERY: "DIRECT_DELIVERY",
  QUICK_SVC: "QUICK_SVC",
  NOTHING: "NOTHING",
} as const;

export interface DispatchProductOrdersRequest {
  dispatchProductOrders: DispatchProductOrder[];
}

export interface DispatchProductOrdersResult {
  timestamp: string;
  traceId: string;
  data: {
    successProductOrderIds: DispatchProductOrderSuccessList;
    failProductOrderInfos: DispatchProductOrderFail[];
  };
}

export type DispatchProductOrder = {
  productOrderId: string;
  deliveryMethod?: DeliveryMethodType;
  dispatchDate?: string;
};

export type DeliveryMethodType = (typeof DELIVERY_METHOD)[keyof typeof DELIVERY_METHOD];

export type DispatchProductOrderSuccessList = string[];

export type DispatchProductOrderFail = {
  productOrderId: string;
  code: string;
  message: string;
};
