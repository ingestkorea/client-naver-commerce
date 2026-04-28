import {
  CommerceClientResolvedConfig,
  CommerceCommand,
  GetProductOrdersRequest,
  GetProductOrdersResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
  NaverCommerceError,
} from "../models/index.js";
import { se_GetProductOrdersCommand, de_GetProductOrdersCommand } from "../protocols/GetProductOrders.js";

export interface GetProductOrdersCommandInput extends GetProductOrdersRequest {}
export interface GetProductOrdersCommandOutput extends MetadataBearer, GetProductOrdersResult {}

export class GetProductOrdersCommand extends CommerceCommand<
  GetProductOrdersCommandInput,
  GetProductOrdersCommandOutput,
  CommerceClientResolvedConfig
> {
  input: GetProductOrdersCommandInput;
  serializer: RequestSerializer<GetProductOrdersCommandInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetProductOrdersCommandOutput, CommerceClientResolvedConfig>;
  constructor(input: GetProductOrdersCommandInput) {
    super(input);

    const productOrderIds = input.productOrderIds.filter((id) => !!id);

    if (!productOrderIds.length) {
      throw new NaverCommerceError({
        code: "SDK.GENERAL_ERROR",
        message: "유효하지 않은 상품 주문 조회 형식입니다.",
        timestamp: new Date().toISOString(),
        invalidInputs: [
          {
            name: "productOrderIds",
            type: "not-valid.args",
            message: "유효한 productOrderId 값들을 입력해주세요.",
          },
        ],
      });
    }
    this.input = {
      productOrderIds,
    };
    this.serializer = se_GetProductOrdersCommand;
    this.deserializer = de_GetProductOrdersCommand;
  }
}
