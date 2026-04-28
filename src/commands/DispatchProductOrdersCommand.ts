import {
  CommerceClientResolvedConfig,
  CommerceCommand,
  DispatchProductOrdersRequest,
  DispatchProductOrder,
  DispatchProductOrdersResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
  NaverCommerceError,
} from "../models/index.js";
import {
  se_DispatchProductOrdersCommand,
  de_DispatchProductOrdersCommand,
} from "../protocols/DispatchProductOrders.js";

export interface DispatchProductOrdersCommandInput extends DispatchProductOrdersRequest {}
export interface DispatchProductOrdersCommandOutput extends MetadataBearer, DispatchProductOrdersResult {}

export class DispatchProductOrdersCommand extends CommerceCommand<
  DispatchProductOrdersCommandInput,
  DispatchProductOrdersCommandOutput,
  CommerceClientResolvedConfig
> {
  input: DispatchProductOrdersCommandInput;
  serializer: RequestSerializer<DispatchProductOrdersCommandInput, CommerceClientResolvedConfig>;
  deserializer: ResponseDeserializer<DispatchProductOrdersCommandOutput, CommerceClientResolvedConfig>;
  constructor(input: DispatchProductOrdersCommandInput) {
    super(input);

    const dispatchProductOrders = input.dispatchProductOrders.filter((d) => !!d);
    if (!dispatchProductOrders.length) {
      throw new NaverCommerceError({
        code: "SDK.GENERAL_ERROR",
        message: "유효하지 않은 발송 처리 옵션입니다.",
        timestamp: new Date().toISOString(),
        invalidInputs: [
          {
            name: "dispatchProductOrder",
            type: "not-valid.args",
            message: "유효한 발송 처리 옵션 값들을 입력해주세요.",
          },
        ],
      });
    }

    this.input = {
      dispatchProductOrders: input.dispatchProductOrders.map((entry) => resolveDispatchProductOrder(entry)),
    };

    this.serializer = se_DispatchProductOrdersCommand;
    this.deserializer = de_DispatchProductOrdersCommand;
  }
}

const resolveDispatchProductOrder = (input: Partial<DispatchProductOrder>): Required<DispatchProductOrder> => {
  if (!input.productOrderId) {
    throw new NaverCommerceError({
      code: "SDK.GENERAL_ERROR",
      message: "유효하지 않은 발송 처리 옵션입니다.",
      timestamp: new Date().toISOString(),
      invalidInputs: [
        {
          name: "dispatchProductOrder",
          type: "not-valid.args",
          message: "productOrderId 값을 확인해주세요.",
        },
      ],
    });
  }

  const utcZRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

  if (input.dispatchDate && !utcZRegex.test(input.dispatchDate)) {
    throw new NaverCommerceError({
      code: "SDK.GENERAL_ERROR",
      message: "유효하지 않은 날짜 형식입니다.",
      timestamp: new Date().toISOString(),
      invalidInputs: [
        {
          name: "dispatchDate",
          type: "not-valid.args",
          message: "UTC format (ISO 8601)으로 입력해주세요. 2026-01-01T12:34:56.789Z.",
        },
      ],
    });
  }

  const utc = new Date(input.dispatchDate ?? Date.now()).toISOString();
  return {
    productOrderId: input.productOrderId,
    deliveryMethod: input.deliveryMethod || "DELIVERY",
    dispatchDate: convertKst(utc),
  };
};

const convertKst = (input: string): string => {
  const offsetMs = 9 * 3_600_000;
  const inputMs = new Date(input).getTime();
  return new Date(inputMs + offsetMs).toISOString().replace("Z", "+09:00");
};
