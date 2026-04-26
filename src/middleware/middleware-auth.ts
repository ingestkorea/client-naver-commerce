import { Handler } from "../models/index.js";

export const middlewareAuth =
  <I extends object, O extends object>(next: Handler<I, O>): Handler<I, O> =>
  async (input, context) => {
    const { credentials } = context;

    input.request.headers = {
      ...input.request.headers,
      ...(credentials.accessToken && { authorization: "Bearer " + credentials.accessToken }),
    };

    return next(input, context);
  };
