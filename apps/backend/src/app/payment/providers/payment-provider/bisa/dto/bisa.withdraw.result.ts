import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../../payment.provider.withdraw.result';

export class BisaWithdrawResult extends PaymentProviderWithdrawResult {}

export class BisaChannelWithdrawResult extends PaymentProviderChannelWithdrawResult {
  static responseFactory(
    response,
    providerName: string
  ): BisaChannelWithdrawResult {
    const withdrawResult = new BisaChannelWithdrawResult();
    withdrawResult.result = true;
    withdrawResult.providerName = providerName;

    const { id } = response.data || {};

    // if (code !== 200 || !data || !success) {
    //   withdrawResult.errorCode = code;
    //   withdrawResult.errorMessage = msg;
    //   return withdrawResult;
    // }

    withdrawResult.providerId = id;
    return withdrawResult;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): BisaChannelWithdrawResult {
    const result = new BisaChannelWithdrawResult();
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
