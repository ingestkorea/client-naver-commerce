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

export interface GetAccountInfoInput extends GetAccountInfoRequest {}
export interface GetAccountInfoOutput extends MetadataBearer, GetAccountInfoResult {}

export class GetAccountInfoCommand extends CommerceCommand<
  GetAccountInfoInput,
  GetAccountInfoOutput,
  CommerceClientResolvedConfig
> {
  input: GetAccountInfoInput;
  serializer: RequestSerializer<GetAccountInfoInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetAccountInfoOutput, CommerceClientResolvedConfig>;
  constructor(input: GetAccountInfoInput) {
    super(input);
    this.input = {};
    this.serializer = se_GetAccountInfoCommand;
    this.deserializer = de_GetAccountInfoCommand;
  }
}
