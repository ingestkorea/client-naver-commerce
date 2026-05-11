import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import {
  CommerceClientConfig,
  CommerceClientResolvedConfig,
  CommerceCommand,
  MetadataBearer,
  Middleware,
  Handler,
  NaverCommerceError,
} from "./models/index.js";
import { middlewareAuth, middlewareIngestkoreaMetadata, middlewareRetry } from "./middleware/index.js";

export class NaverCommerceClient {
  config: CommerceClientResolvedConfig;
  private httpHandler = new NodeHttpHandler({
    connectionTimeout: 3000,
    socketTimeout: 3000,
    freeSocketTimeout: 1000,
  });

  constructor(config: CommerceClientConfig) {
    this.config = {
      credentials: resolveCredentials(config),
    };
  }

  async send<T extends object, P extends MetadataBearer>(
    command: CommerceCommand<T, P, CommerceClientResolvedConfig>
  ): Promise<P> {
    const middlewares: Middleware<T, P>[] = [middlewareAuth, middlewareIngestkoreaMetadata, middlewareRetry];
    const finalHandler: Handler<T, P> = async (input, context) => {
      const { response } = await this.httpHandler.handle(input.request);
      const output = await command.deserializer(response, this.config);
      return { response, output };
    };
    const handler = composeMiddleware(middlewares, finalHandler);

    try {
      const request = await command.serializer(command.input, this.config);
      const { output } = await handler({ request, input: command.input }, this.config);
      return output;
    } catch (e) {
      throw e;
    }
  }
}

export const composeMiddleware = <I extends object, O extends object>(
  middlewares: Middleware<I, O>[],
  finalHandler: Handler<I, O>
): Handler<I, O> => {
  const handler = middlewares.reduceRight((next, middleware) => {
    return middleware(next);
  }, finalHandler);
  return handler;
};

const resolveCredentials = (config: CommerceClientConfig): CommerceClientResolvedConfig["credentials"] => {
  const { credentials } = config;

  let error = new NaverCommerceError({
    code: "SDK.AUTH_ERROR",
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
