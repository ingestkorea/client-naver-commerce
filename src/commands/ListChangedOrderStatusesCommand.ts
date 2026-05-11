import {
  CommerceClientResolvedConfig,
  CommerceCommand,
  ListChangedOrderStatusesRequest,
  ListChangedOrderStatusesResult,
  LAST_CHANGED_TYPE,
  LastChangedType,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
  NaverCommerceError,
} from "../models/index.js";
import {
  se_ListChangedOrderStatusesCommand,
  de_ListChangedOrderStatusesCommand,
} from "../protocols/ListChangedOrderStatuses.js";

const LAST_CHANGED_TYPE_SET = new Set<string>(Object.values(LAST_CHANGED_TYPE));
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 300;
const MAX_RANGE_MS = 24 * 3600 * 1000;

export interface ListChangedOrderStatusesCommandInput extends ListChangedOrderStatusesRequest {}
export interface ListChangedOrderStatusesCommandOutput extends MetadataBearer, ListChangedOrderStatusesResult {}

export class ListChangedOrderStatusesCommand extends CommerceCommand<
  ListChangedOrderStatusesCommandInput,
  ListChangedOrderStatusesCommandOutput,
  CommerceClientResolvedConfig
> {
  input: ListChangedOrderStatusesCommandInput;
  serializer: RequestSerializer<ListChangedOrderStatusesCommandInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<ListChangedOrderStatusesCommandOutput, CommerceClientResolvedConfig>;
  constructor(input: ListChangedOrderStatusesCommandInput) {
    super(input);
    const now = new Date();
    const lastChangedFrom = isUtcTimeFormat(input.lastChangedFrom) ? input.lastChangedFrom : null;

    if (!lastChangedFrom) {
      throw new NaverCommerceError({
        code: "SDK.GENERAL_ERROR",
        message: "유효하지 않은 날짜 형식입니다.",
        timestamp: now.toISOString(),
        invalidInputs: [
          {
            name: "lastChangedFrom",
            type: "not-valid.args",
            message: "lastChangedFrom must be UTC format (ISO 8601). 2026-01-01T12:34:56.789Z",
          },
        ],
      });
    }

    const lastChangedFromMs = new Date(lastChangedFrom).getTime();
    const lastChangedToMs = isUtcTimeFormat(input.lastChangedTo)
      ? new Date(input.lastChangedTo).getTime()
      : lastChangedFromMs + MAX_RANGE_MS;

    const lastChangedTo = new Date(lastChangedToMs).toISOString();

    if (lastChangedToMs > now.getTime()) {
      throw new NaverCommerceError({
        code: "SDK.GENERAL_ERROR",
        message: "조회 기간이 현재 시간보다 초과될 수 없습니다.",
        timestamp: now.toISOString(),
        invalidInputs: [
          { name: "lastChangedFrom", type: "not-valid.args", message: lastChangedFrom },
          { name: "lastChangedTo", type: "not-valid.args", message: lastChangedTo },
        ],
      });
    }

    const diffMs = lastChangedToMs - lastChangedFromMs;

    if (diffMs > MAX_RANGE_MS) {
      throw new NaverCommerceError({
        code: "SDK.GENERAL_ERROR",
        message: "조회 기간은 최대 24시간을 초과할 수 없습니다.",
        timestamp: now.toISOString(),
        invalidInputs: [
          { name: "lastChangedFrom", type: "not-valid.args", message: lastChangedFrom },
          { name: "lastChangedTo", type: "not-valid.args", message: lastChangedTo },
        ],
      });
    }

    this.input = {
      lastChangedFrom: convertKst(lastChangedFrom),
      lastChangedTo: convertKst(lastChangedTo),
      ...(isLastChangedType(input.lastChangedType) && { lastChangedType: input.lastChangedType }),
      ...(input.moreSequence && { moreSequence: input.moreSequence }),
      limitCount: Math.min(MAX_LIMIT, Math.max(1, input.limitCount ?? DEFAULT_LIMIT)),
    };

    this.serializer = se_ListChangedOrderStatusesCommand;
    this.deserializer = de_ListChangedOrderStatusesCommand;
  }
}

const isUtcTimeFormat = (input: any): input is string => {
  if (!input || typeof input !== "string") return false;

  const utcZRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

  if (!utcZRegex.test(input)) return false;

  return !isNaN(new Date(input).getTime());
};

const isLastChangedType = (input: any): input is LastChangedType => {
  if (!input || typeof input !== "string") return false;

  return LAST_CHANGED_TYPE_SET.has(input);
};

const convertKst = (input: string): string => {
  const offsetMs = 9 * 3_600_000;
  const inputMs = new Date(input).getTime();
  return new Date(inputMs + offsetMs).toISOString().replace("Z", "+09:00");
};
