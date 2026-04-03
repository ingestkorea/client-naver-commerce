export type AppCredentials = {
  appId: string;
  appSecret: string;
};

export type APICredentials = {
  accessToken: string;
};

export interface CommerceClientConfig {
  credentials?: Partial<AppCredentials> & Partial<APICredentials>;
}

export interface CommerceClientResolvedConfig {
  credentials: AppCredentials & APICredentials;
}
