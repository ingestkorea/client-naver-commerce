import { ProductOrderStatusType } from "./ListChangedOrderStatuses.js";

export interface GetProductOrdersRequest {
  productOrderIds: string[];
}

export interface GetProductOrdersResult {
  timestamp: string;
  traceId: string;
  data: ProductOrderInfo[];
}

export type ProductOrderInfo = {
  order: OrderContent;
  productOrder: ProductOrderContent;
  delivery?: DeliveryContent;
};

export type OrderContent = {
  orderId: string;
  orderDate: string;
  ordererId: string;
  ordererNo: string;
  ordererName: string;
  ordererTel: string;
  isDeliveryMemoParticularInput: string;
  paymentDate: string;
  paymentMeans: string;
  payLocationType: string;
  orderDiscountAmount: number;
  generalPaymentAmount: number;
  naverMileagePaymentAmount: number;
  chargeAmountPaymentAmount: number;
  payLaterPaymentAmount: number;
  isMembershipSubscribed: boolean;
};

export type ProductOrderContent = ProductOrderBase & ProductOrderDetail & ProductOrderCommission & ProductOrderDelivery;

export type DeliveryContent = {
  deliveredDate: string;
  deliveryMethod: string;
  deliveryStatus: string;
  sendDate: string;
  isWrongTrackingNumber: boolean;
};

export type ProductOrderBase = {
  productOrderId: string;
  productOrderStatus: ProductOrderStatusType;
  mallId: string;
  sellerProductCode: string;
  groupProductId: number;
  originalProductId: string;
  productId: string; // channelProductId
  productName: string;
  optionCode: string;
  optionPrice: number;
  unitPrice: number;
};

export type ProductOrderDetail = {
  quantity: number;
  totalProductAmount: number;
  totalPaymentAmount: number;
  productDiscountAmount: number;
  sellerBurdenStoreDiscountAmount: number;
  inflowPath: string;
};

export type ProductOrderCommission = {
  commissionRatingType: string;
  commissionPrePayStatus: string;
  expectedSettlementAmount: number;
  paymentCommission: number;
  knowledgeShoppingSellingInterlockCommission: number;
  saleCommission: number;
  channelCommission: number;
};

export type ProductOrderDelivery = {
  expectedDeliveryMethod: string;
  deliveryAttributeType: string;
  placeOrderDate: string; // 발주
  placeOrderStatus: string;
  shippingAddress: { name: string; tel1: string };
};
