import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../../payment.provider.withdraw.result';

export class HengXinWithdrawResult extends PaymentProviderWithdrawResult {}

export class HengXinChannelWithdrawResult extends PaymentProviderChannelWithdrawResult {
  static responseFactory(
    response,
    providerName: string
  ): HengXinChannelWithdrawResult {
    const withdrawResult = new HengXinChannelWithdrawResult();
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
  ): HengXinChannelWithdrawResult {
    const result = new HengXinChannelWithdrawResult();
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
