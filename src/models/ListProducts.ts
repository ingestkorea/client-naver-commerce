export const PRODUCT_STATUS = {
  WAIT: "WAIT",
  SALE: "SALE",
  OUTOFSTOCK: "OUTOFSTOCK",
  UNADMISSION: "UNADMISSION",
  REJECTION: "REJECTION",
  SUSPENSION: "SUSPENSION",
  CLOSE: "CLOSE",
  PROHIBITION: "PROHIBITION",
  DELETE: "DELETE",
} as const;

export interface ListProductsRequest {
  productStatusTypes?: ProductStatusType;
  page?: number;
  size?: number;
}

export interface ListProductsResult {
  contents: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: SortInfo;
  first: boolean;
  last: boolean;
}

export type ProductStatusType = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export type Product = {
  groupProductNo: number;
  originProductNo: number;
  channelProducts: ChannelProduct[];
};

export type ChannelProduct = {
  groupProductNo: number;
  originProductNo: number;
  channelProductNo: number;
  channelServiceType: string;
  categoryId: string;
  name: string;
  sellerManagementCode: string;
  statusType: string;
  channelProductDisplayStatusType: string;
  salePrice: number;
  discountedPrice: number;
  mobileDiscountedPrice: number;
  stockQuantity: number;
  knowledgeShoppingProductRegistration: boolean;
  deliveryFee: number;
  managerPurchasePoint: number;
  textReviewPoint: number;
  photoVideoReviewPoint: number;
  wholeCategoryName: string;
  wholeCategoryId: string;
  representativeImage: {
    url: string;
  };
  modelName: string;
  brandName: string;
  manufacturerName: string;
  sellerTags: SellerTag[];
  regDate: string; // KST => UTC
  modifiedDate: string; // KST => UTC
};

export type SortInfo = {
  sorted: boolean;
  fields: SortField[];
};

export type SortField = {
  name: string;
  direction: string;
};

export type SellerTag = { text: string };
