import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { CommerceClientResolvedConfig } from "./CommerceClient.js";

export type Handler<Input extends object, Output extends object> = (
  args: { request: HttpRequest; input: Input },
  context: CommerceClientResolvedConfig
) => Promise<{ response: HttpResponse; output: Output }>;

export type Middleware<Input extends object, Output extends object> = (
  next: Handler<Input, Output>
) => Handler<Input, Output>;
