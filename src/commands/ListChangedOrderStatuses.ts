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

export interface ListChangedOrderStatusesInput extends ListChangedOrderStatusesRequest {}
export interface ListChangedOrderStatusesOutput extends MetadataBearer, ListChangedOrderStatusesResult {}

export class ListChangedOrderStatusesCommand extends CommerceCommand<
  ListChangedOrderStatusesInput,
  ListChangedOrderStatusesOutput,
  CommerceClientResolvedConfig
> {
  input: ListChangedOrderStatusesInput;
  serializer: RequestSerializer<ListChangedOrderStatusesInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<ListChangedOrderStatusesOutput, CommerceClientResolvedConfig>;
  constructor(input: ListChangedOrderStatusesInput) {
    super(input);
    const now = new Date();

    const lastChangedFrom = isUtcTimeFormat(input.lastChangedFrom) ? input.lastChangedFrom : null;

    if (!lastChangedFrom) {
      throw new NaverCommerceError({
        code: "GENERAL_ERROR",
        message: "lastChangedFrom must be UTC format (ISO 8601). 2026-01-01T12:34:56.789Z",
        timestamp: now.toISOString(),
      });
    }

    const lastChangedTo = isUtcTimeFormat(input.lastChangedTo) ? input.lastChangedTo : now.toISOString();
    const lastChangedType = isLastChangedType(input.lastChangedType) ? input.lastChangedType : null;

    this.input = {
      lastChangedFrom,
      lastChangedTo,
      ...(lastChangedType && { lastChangedType }),
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

  const date = new Date(input);

  return !isNaN(date.getTime());
};

const isLastChangedType = (input: any): input is LastChangedType => {
  if (!input || typeof input !== "string") return false;

  return LAST_CHANGED_TYPE_SET.has(input);
};
