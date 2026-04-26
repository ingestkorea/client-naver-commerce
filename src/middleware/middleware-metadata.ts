import { Handler } from "../models/index.js";
import { INGESTKOREA_USER_AGENT } from "./constants.js";

export const middlewareIngestkoreaMetadata =
  <I extends object, O extends object>(next: Handler<I, O>): Handler<I, O> =>
  async (input, context) => {
    input.request.headers = {
      ...input.request.headers,
      [INGESTKOREA_USER_AGENT]: "@ingestkorea/client-naver-commerce/0.4.x",
    };

    return next(input, context);
  };
