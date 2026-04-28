import {
  CommerceClientResolvedConfig,
  CommerceCommand,
  ListProductsRequest,
  ListProductsResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_ListProductsCommand, de_ListProductsCommand } from "../protocols/ListProducts.js";

export interface ListProductsCommandInput extends ListProductsRequest {}
export interface ListProductsCommandOutput extends MetadataBearer, ListProductsResult {}

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

export class ListProductsCommand extends CommerceCommand<
  ListProductsCommandInput,
  ListProductsCommandOutput,
  CommerceClientResolvedConfig
> {
  input: ListProductsCommandInput;
  serializer: RequestSerializer<ListProductsCommandInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<ListProductsCommandOutput, CommerceClientResolvedConfig>;
  constructor(input: ListProductsCommandInput) {
    super(input);
    this.input = {
      productStatusTypes: input.productStatusTypes ? input.productStatusTypes : "SALE",
      page: input.page ?? 1,
      size: Math.min(MAX_LIMIT, Math.max(1, input.size ?? DEFAULT_LIMIT)),
    };
    this.serializer = se_ListProductsCommand;
    this.deserializer = de_ListProductsCommand;
  }
}
