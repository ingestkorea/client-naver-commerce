import {
  CommerceClientResolvedConfig,
  CommerceCommand,
  ListBrandsInfoRequest,
  ListBrandsInfoResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_ListBrandsInfoCommand, de_ListBrandsInfoCommand } from "../protocols/ListBrandsInfo.js";

export interface ListBrandsInfoCommandInput extends ListBrandsInfoRequest {}
export interface ListBrandsInfoCommandOutput extends MetadataBearer {
  data: ListBrandsInfoResult;
}

export class ListBrandsInfoCommand extends CommerceCommand<
  ListBrandsInfoCommandInput,
  ListBrandsInfoCommandOutput,
  CommerceClientResolvedConfig
> {
  input: ListBrandsInfoCommandInput;
  serializer: RequestSerializer<ListBrandsInfoCommandInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<ListBrandsInfoCommandOutput, CommerceClientResolvedConfig>;
  constructor(input: ListBrandsInfoCommandInput) {
    super(input);
    this.input = {
      name: input.name,
    };
    this.serializer = se_ListBrandsInfoCommand;
    this.deserializer = de_ListBrandsInfoCommand;
  }
}
