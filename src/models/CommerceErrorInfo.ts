export interface CommerceErrorInfo {
  code: string;
  message: string;
  timestamp: string;
  traceId?: string;
  invalidInputs?: InvalidInputs[];
}

export type InvalidInputs = {
  name: string;
  type: string;
  message: string;
};

export class NaverCommerceError extends Error {
  public readonly code: string;
  public readonly timestamp: string;
  public readonly traceId: string;
  public readonly invalidInputs: InvalidInputs[];
  constructor(info: CommerceErrorInfo) {
    super(info.message);
    this.name = "NaverCommerceError";
    this.code = info.code;
    this.timestamp = new Date(info.timestamp).toISOString();
    this.traceId = info.traceId || "local";
    this.invalidInputs = info.invalidInputs || [];
  }
}
