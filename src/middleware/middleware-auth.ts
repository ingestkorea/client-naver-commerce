import { Middleware } from "../models/index.js";

export const middlewareAuth: Middleware = (next) => async (input, context) => {
  const { credentials } = context;

  input.request.headers = {
    ...input.request.headers,
    ...(credentials.accessToken && { authorization: "Bearer " + credentials.accessToken }),
  };

  return next(input, context);
};
