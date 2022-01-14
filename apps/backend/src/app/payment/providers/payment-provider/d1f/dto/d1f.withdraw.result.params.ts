import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../../payment.provider.withdraw.result';

export class D1FWithdrawResult extends PaymentProviderWithdrawResult {}

export class D1FChannelWithdrawResult extends PaymentProviderChannelWithdrawResult {
  static responseFactory(
    response,
    providerName: string
  ): D1FChannelWithdrawResult {
    const withdrawResult = new D1FChannelWithdrawResult();
    withdrawResult.result = false;
    withdrawResult.providerName = providerName;

    const { code, message } = response.data || {};

    if (code !== 200) {
      withdrawResult.errorCode = code;
      withdrawResult.errorMessage = message;
      return withdrawResult;
    }

    withdrawResult.result = true;
    return withdrawResult;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): D1FChannelWithdrawResult {
    const result = new D1FChannelWithdrawResult();
    result.result = false;
    result.providerId = null;
    result.providerName = providerName;

    const { message } = error;

    result.errorMessage = message || 'Unknown Error';
    result.errorCode = defaultErrorCode;
    result.error = error;

    return result;
  }

  sanitizePaymentProviderWithdrawResult(): PaymentProviderChannelWithdrawResult {
    delete this.providerId;
    return this;
  }
}
