import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { CommerceClientResolvedConfig } from "./CommerceClient.js";

export type Middleware = (next: Handler) => Handler;

export type Handler = (
  input: { request: HttpRequest },
  context: CommerceClientResolvedConfig
) => Promise<{ response: HttpResponse }>;
