export interface CreateAccessTokenRequest {}

export interface CreateAccessTokenResult {
  access_token: string;
  expires_in: number;
  token_type: string;
  // accountId: string;
  // accountUid: string;
  // grade: string;
}
