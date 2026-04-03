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
