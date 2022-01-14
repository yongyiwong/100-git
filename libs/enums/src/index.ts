import { ApiEndpointDescriptionEnum } from './lib/api-endpoint-description.enum';
import { ApiParamsEnum } from './lib/api-params.enum';
import { ApiPathsEnum } from './lib/api-paths.enum';
import { ApiTagsEnum } from './lib/api-tags.enum';
import {
    OrderStatusEnum,
    DepositChannelEnum,
    PaymentProviderEnum,
    BankCodeEnum,
} from './lib/payment.enum';
import { SportsEnum } from './lib/stream.enum';

export * from './lib/payment.enum';
export * from './lib/stream.enum';

export const apiPathsEnum = ApiPathsEnum;
export const apiTagsEnum = ApiTagsEnum;
export const apiEndpointDecriptionEnum = ApiEndpointDescriptionEnum;
export const apiParamsEnum = ApiParamsEnum;
export const orderStatusEnum = OrderStatusEnum;
export const channelEnum = DepositChannelEnum;
export const paymentProviderEnum = PaymentProviderEnum;
export const bankCodeEnum = BankCodeEnum;
export const sportsEnum = SportsEnum;
