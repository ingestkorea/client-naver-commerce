export interface ListChangedOrderStatusesRequest {
  lastChangedFrom: string;
  lastChangedTo?: string;
  lastChangedType?: LastChangedType;
  moreSequence?: string;
  limitCount?: number;
}
export interface ListChangedOrderStatusesResult {
  timestamp: string;
  traceId: string;
  data: {
    count: number;
    lastChangeStatuses: ChangedOrderStatus[];
    more?: More;
  };
}

export type ChangedOrderStatus = {
  orderId: string;
  lastChangedDate: string;
  lastChangedType: LastChangedType;
  productOrderId: string;
  productOrderStatus: ProductOrderStatusType;
  receiverAddressChanged: boolean;
  paymentDate: string;
  claimType: ClaimType;
  claimStatus: string;
  giftReceivingStatus: string;
};

export type More = {
  moreFrom: string;
  moreSequence: string;
};

export const LAST_CHANGED_TYPE = {
  PAY_WAITING: "PAY_WAITING",
  PAYED: "PAYED",
  EXCHANGE_OPTION: "EXCHANGE_OPTION",
  DELIVERY_ADDRESS_CHANGED: "DELIVERY_ADDRESS_CHANGED",
  GIFT_RECEIVED: "GIFT_RECEIVED",
  CLAIM_REJECTED: "CLAIM_REJECTED",
  DISPATCHED: "DISPATCHED",
  CLAIM_REQUESTED: "CLAIM_REQUESTED",
  COLLECT_DONE: "COLLECT_DONE",
  CLAIM_COMPLETED: "CLAIM_COMPLETED",
  PURCHASE_DECIDED: "PURCHASE_DECIDED",
  HOPE_DELIVERY_INFO_CHANGED: "HOPE_DELIVERY_INFO_CHANGED",
  CLAIM_REDELIVERING: "CLAIM_REDELIVERING",
} as const;

export const PRODUCT_ORDER_STATUS_TYPE = {
  PAYMENT_WAITING: "PAYMENT_WAITING",
  PAYED: "PAYED",
  DELIVERING: "DELIVERING",
  DELIVERED: "DELIVERED",
  PURCHASE_DECIDED: "PURCHASE_DECIDED",
  EXCHANGED: "EXCHANGED",
  CANCELED: "CANCELED",
  RETURNED: "RETURNED",
  CANCELED_BY_NOPAYMENT: "CANCELED_BY_NOPAYMENT",
} as const;

export const CLAIM_TYPE = {
  CANCEL: "CANCEL",
  RETURN: "RETURN",
  EXCHANGE: "EXCHANGE",
  PURCHASE_DECISION_HOLDBACK: "PURCHASE_DECISION_HOLDBACK",
  ADMIN_CANCEL: "ADMIN_CANCEL",
} as const;

export type LastChangedType = (typeof LAST_CHANGED_TYPE)[keyof typeof LAST_CHANGED_TYPE];
export type ProductOrderStatusType = (typeof PRODUCT_ORDER_STATUS_TYPE)[keyof typeof PRODUCT_ORDER_STATUS_TYPE];
export type ClaimType = (typeof CLAIM_TYPE)[keyof typeof CLAIM_TYPE];
