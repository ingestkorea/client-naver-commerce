export interface ListBrandsInfoRequest {
  name: string;
}

export interface ListBrandsInfoResult extends Array<BrandInfo> {}

export interface BrandInfo {
  id: number;
  name: string;
}
