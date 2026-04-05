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

export interface CreateAccessTokenCommandInput extends CreateAccessTokenRequest {}
export interface CreateAccessTokenCommandOutput extends MetadataBearer, CreateAccessTokenResult {}

export class CreateAccessTokenCommand extends CommerceCommand<
  CreateAccessTokenCommandInput,
  CreateAccessTokenCommandOutput,
  CommerceClientResolvedConfig
> {
  input: CreateAccessTokenCommandInput;
  serializer: RequestSerializer<CreateAccessTokenCommandInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<CreateAccessTokenCommandOutput, CommerceClientResolvedConfig>;
  constructor(input: CreateAccessTokenCommandInput) {
    super(input);
    this.input = {};
    this.serializer = se_CreateAccessTokenCommand;
    this.deserializer = de_CreateAccessTokenCommand;
  }
}
