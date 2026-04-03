import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import {
  CommerceClientConfig,
  CommerceClientResolvedConfig,
  CommerceCommand,
  Middleware,
  Handler,
} from "./models/index.js";
import { middlewareAuth, middlewareIngestkoreaMetadata, middlewareRetry } from "./middleware/index.js";
import { NaverCommerceError } from "./protocols/constants.js";

export class NaverCommerceClient {
  config: CommerceClientResolvedConfig;
  private httpHandler = new NodeHttpHandler({ connectionTimeout: 3000, socketTimeout: 3000 });
  private requestHandler: Handler = async (input, context) => this.httpHandler.handle(input.request);

  constructor(config: CommerceClientConfig) {
    this.config = {
      credentials: resolveCredentials(config),
    };
  }

  async send<T, P>(command: CommerceCommand<T, P, CommerceClientResolvedConfig>): Promise<P> {
    const { input, serializer, deserializer } = command;

    const middlewares: Middleware[] = [middlewareAuth, middlewareIngestkoreaMetadata, middlewareRetry];
    const handler = composeMiddleware(middlewares, this.requestHandler);

    try {
      const request = await serializer(input, this.config);
      const { response } = await handler({ request }, this.config);
      const output = await deserializer(response, this.config);
      return output;
    } catch (e) {
      throw e;
    }
  }
}

const composeMiddleware = (middlewares: Middleware[], finalHandler: Handler): Handler => {
  const handler = middlewares.reduceRight((next, middleware) => {
    return middleware(next);
  }, finalHandler);
  return handler;
};

const resolveCredentials = (config: CommerceClientConfig): CommerceClientResolvedConfig["credentials"] => {
  const { credentials } = config;

  let error = new NaverCommerceError({
    code: "GENERAL_ERROR",
    message: "자격 증명이 유효하지 않습니다.",
    timestamp: new Date().toISOString(),
    invalidInputs: [
      {
        name: "credentials",
        type: "not-valid.args",
        message: "NaverCommerceClient 초기화시 인증 정보를 확인해주세요.",
      },
    ],
  });

  if (!credentials) throw error;
  if (!credentials.appId) {
    error.invalidInputs[0].message = "Application ID 정보를 확인해주세요.";
    throw error;
  }
  if (!credentials.appSecret) {
    error.invalidInputs[0].message = "Application Secret 정보를 확인해주세요.";
    throw error;
  }

  return {
    appId: credentials.appId,
    appSecret: credentials.appSecret,
    accessToken: credentials.accessToken || "",
  };
};
