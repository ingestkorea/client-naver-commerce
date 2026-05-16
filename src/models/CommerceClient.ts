export type AppCredentials = {
  appId: string;
  appSecret: string;
};

export type APICredentials = {
  accessToken: string;
};

export type HttpHandlerOptions = {
  connectionTimeout: number;
  socketTimeout: number;
  keepAlive: boolean;
  family: 4;
};

export interface CommerceClientConfig {
  credentials?: Partial<AppCredentials> & Partial<APICredentials>;
  httpHandler?: Partial<HttpHandlerOptions>;
}

export interface CommerceClientResolvedConfig {
  credentials: AppCredentials & APICredentials;
  httpHandler: HttpHandlerOptions;
}
