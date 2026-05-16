export const INGESTKOREA_USER_AGENT = "x-ingestkorea-user-agent";
export const INGESTKOREA_REQUEST_LOG = "x-ingestkorea-request";
export const INGESTKOREA_RETRY = "x-ingestkorea-attempts";
export const INGESTKOREA_RETRY_DELAY = "x-ingestkorea-total-retry-delay";

export const NAVER_COMMERCE_TRACE_ID = "gncp-gw-trace-id";
export const NAVER_COMMERCE_RATE_LIMIT = "gncp-gw-ratelimit-remaining";

export const PREFIX_NAVER_RETRYABLE_CODE = [
  "GW.RATE_LIMIT",
  "GW.QUOTA_LIMIT",
  "GW.PROXY",
  "GW.INTERNAL_SERVER_ERROR",
  "GW.BLOCK",
  "GW.TIMEOUT",
];

export const PREFIX_SDK_RETRYABLE_CODE = ["SDK.TIMEOUT", "SDK.NETWORK_ERROR"];
