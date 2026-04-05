import {
  CommerceClientResolvedConfig,
  CommerceCommand,
  GetAccountInfoRequest,
  GetAccountInfoResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_GetAccountInfoCommand, de_GetAccountInfoCommand } from "../protocols/GetAccountInfo.js";

export interface GetAccountInfoCommandInput extends GetAccountInfoRequest {}
export interface GetAccountInfoCommandOutput extends MetadataBearer, GetAccountInfoResult {}

export class GetAccountInfoCommand extends CommerceCommand<
  GetAccountInfoCommandInput,
  GetAccountInfoCommandOutput,
  CommerceClientResolvedConfig
> {
  input: GetAccountInfoCommandInput;
  serializer: RequestSerializer<GetAccountInfoCommandInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetAccountInfoCommandOutput, CommerceClientResolvedConfig>;
  constructor(input: GetAccountInfoCommandInput) {
    super(input);
    this.input = {};
    this.serializer = se_GetAccountInfoCommand;
    this.deserializer = de_GetAccountInfoCommand;
  }
}
