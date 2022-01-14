import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../../payment.provider.withdraw.result';

export class JBPWithdrawResult extends PaymentProviderWithdrawResult {}

export class JBPChannelWithdrawResult extends PaymentProviderChannelWithdrawResult {
  static responseFactory(
    response,
    providerName: string
  ): JBPChannelWithdrawResult {
    const withdrawResult = new JBPChannelWithdrawResult();
    withdrawResult.result = false;
    withdrawResult.providerName = providerName;

    const { code, msg, data, success } = response.data || {};

    if (code !== 200 || !data || !success) {
      withdrawResult.errorCode = code;
      withdrawResult.errorMessage = msg;
      return withdrawResult;
    }

    withdrawResult.result = true;
    return withdrawResult;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): JBPChannelWithdrawResult {
    const result = new JBPChannelWithdrawResult();
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
