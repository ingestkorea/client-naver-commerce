import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  CommerceClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  ListProductsResult,
  Product,
  ChannelProduct,
  SortInfo,
  SortField,
  SellerTag,
} from "../models/index.js";
import { ListProductsCommandInput, ListProductsCommandOutput } from "../commands/ListProductsCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_ListProductsCommand: RequestSerializer<ListProductsCommandInput, CommerceClientResolvedConfig> = async (
  input,
  config
) => {
  const hostname = "api.commerce.naver.com";
  const path = "/external/v1/products/search";
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

export const de_ListProductsCommand: ResponseDeserializer<
  ListProductsCommandOutput,
  CommerceClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_ListProductsResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_ListProductsResult = (output: any): ListProductsResult => {
  return {
    contents: output.contents ? de_ProductList(output.contents) : [],
    page: output.page ?? 1,
    size: output.size ?? 1,
    totalElements: output.totalElements ?? 0,
    totalPages: output.totalPages ?? 1,
    sort: output.sort ? de_SortInfo(output.sort) : { sorted: false, fields: [] },
    first: output.first ?? true,
    last: output.last ?? true,
  };
};

const de_ProductList = (output: any[]): Product[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_Product(entry));
  return result;
};

const de_Product = (output: any): Product => {
  return {
    groupProductNo: output.groupProductNo ?? 0,
    originProductNo: output.originProductNo ?? 0,
    channelProducts: output.channelProducts ? de_ChannelProductList(output.channelProducts) : [],
  };
};

const de_ChannelProductList = (output: any[]): ChannelProduct[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_ChannelProduct(entry));
  return result;
};

const de_ChannelProduct = (output: any): ChannelProduct => {
  return {
    groupProductNo: output.groupProductNo ?? 0,
    originProductNo: output.originProductNo ?? 0,
    channelProductNo: output.channelProductNo ?? 0,
    channelServiceType: output.channelServiceType ?? "",
    categoryId: output.categoryId ?? "",
    name: output.name ?? "",
    sellerManagementCode: output.sellerManagementCode ?? "",
    statusType: output.statusType ?? "",
    channelProductDisplayStatusType: output.channelProductDisplayStatusType ?? "",
    salePrice: output.salePrice ?? 0,
    discountedPrice: output.discountedPrice ?? 0,
    mobileDiscountedPrice: output.mobileDiscountedPrice ?? 0,
    stockQuantity: output.stockQuantity ?? 0,
    knowledgeShoppingProductRegistration: output.knowledgeShoppingProductRegistration ?? false,
    deliveryFee: output.deliveryFee ?? 0,
    managerPurchasePoint: output.managerPurchasePoint ?? 0,
    textReviewPoint: output.textReviewPoint ?? 0,
    photoVideoReviewPoint: output.photoVideoReviewPoint ?? 0,
    wholeCategoryName: output.wholeCategoryName ?? "",
    wholeCategoryId: output.wholeCategoryId ?? "",
    representativeImage: output.representativeImage ?? { url: "" },
    modelName: output.modelName ?? "",
    brandName: output.brandName ?? "",
    manufacturerName: output.manufacturerName ?? "",
    sellerTags: output.sellerTags ? de_SellerTagList(output.sellerTags) : [],
    regDate: output.regDate ? new Date(output.regDate).toISOString() : "",
    modifiedDate: output.modifiedDate ? new Date(output.modifiedDate).toISOString() : "",
  };
};

const de_SortInfo = (output: any): SortInfo => {
  return {
    sorted: output.sorted ?? true,
    fields: output.fields ? de_SortFieldList(output.fields) : [],
  };
};

const de_SortFieldList = (output: any[]): SortField[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_SortField(entry));
  return result;
};

const de_SortField = (output: any): SortField => {
  return {
    name: output.name ?? "",
    direction: output.direction ?? "",
  };
};

const de_SellerTagList = (output: any[]): SellerTag[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_SellerTag(entry));
  return result;
};

const de_SellerTag = (output: any): SellerTag => {
  return {
    text: output.text ?? "",
  };
};
