import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../payment.provider.withdraw.result';

export class CardWithdrawResult extends PaymentProviderWithdrawResult {}

export class CardChannelWithdrawResult extends PaymentProviderChannelWithdrawResult {
  sanitizePaymentProviderWithdrawResult(): PaymentProviderChannelWithdrawResult {
    delete this.providerId;
    return this;
  }
}
