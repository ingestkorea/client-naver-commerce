import {
  CommerceClientResolvedConfig,
  CommerceCommand,
  CreateAccessTokenRequest,
  CreateAccessTokenResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_CreateAccessTokenCommand, de_CreateAccessTokenCommand } from "../protocols/CreateAccessToken.js";

export interface CreateAccessTokenInput extends CreateAccessTokenRequest {}
export interface CreateAccessTokenOutput extends MetadataBearer, CreateAccessTokenResult {}

export class CreateAccessTokenCommand extends CommerceCommand<
  CreateAccessTokenInput,
  CreateAccessTokenOutput,
  CommerceClientResolvedConfig
> {
  input: CreateAccessTokenInput;
  serializer: RequestSerializer<CreateAccessTokenInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<CreateAccessTokenOutput, CommerceClientResolvedConfig>;
  constructor(input: CreateAccessTokenInput) {
    super(input);
    this.input = {};
    this.serializer = se_CreateAccessTokenCommand;
    this.deserializer = de_CreateAccessTokenCommand;
  }
}
