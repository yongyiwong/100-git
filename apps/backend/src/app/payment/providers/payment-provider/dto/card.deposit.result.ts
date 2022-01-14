import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResultData,
} from '../payment.provider.deposit.result';

export class CardDepositResultData extends PaymentProviderDepositResultData {}

export class CardChannelDepositResult extends PaymentProviderChannelDepositResult {
  static errorFactory(error, providerName: string) {
    const result = new CardChannelDepositResult();
    result.result = false;
    result.providerName = providerName;

    const { code, message } = error;

    result.errorMessage = message || 'Unknown Error';
    result.errorCode = code || -1;
    result.error = error.error || null;

    return result;
  }

  sanitizePaymentProviderDepositResult(): PaymentProviderChannelDepositResult {
    return this;
  }
}
