import { PaymentProviderEnum, paymentProviderEnum } from '@workspace/enums';
import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
  PaymentProviderWithdrawResultData,
} from '../../payment.provider.withdraw.result';

export class MSZFWithdrawResult extends PaymentProviderWithdrawResult {}

export class MSZFChannelWithdrawResultData extends PaymentProviderWithdrawResultData {
  merchantOrderId: string;
  sign: string;

  static responseFactory(data) {
    const mszfWithdrawResultData: MSZFChannelWithdrawResultData = new MSZFChannelWithdrawResultData();
    mszfWithdrawResultData.merchantOrderId = data.merchantOrderId;
    mszfWithdrawResultData.sign = data.sign;
    return mszfWithdrawResultData;
  }
}

export class MSZFChannelWithdrawResult extends PaymentProviderChannelWithdrawResult {
  static responseFactory(
    response,
    providerName: string
  ): MSZFChannelWithdrawResult {
    const withdrawResult = new MSZFChannelWithdrawResult();
    withdrawResult.result = false;
    withdrawResult.providerName = providerName;

    const { result, errorMsg, data } = response.data;

    withdrawResult.result = result;
    withdrawResult.providerId = null;
    withdrawResult.providerName = providerName;

    if (errorMsg) {
      withdrawResult.errorMessage = `${errorMsg.errorMsg} ${errorMsg.descript}`;
      withdrawResult.errorCode = errorMsg.code;
      return withdrawResult;
    }

    if (data) {
      withdrawResult.data = MSZFChannelWithdrawResultData.responseFactory(data);
      withdrawResult.providerId = data.gamerOrderId || null;
    }

    withdrawResult.result = true;
    return withdrawResult;
  }

  static errorFactory(error, providerName: string, defaultErrorCode: string) {
    const result = new MSZFChannelWithdrawResult();
    result.result = false;
    result.providerId = null;
    result.providerName = providerName;

    const { status, message } = error;

    result.errorMessage = message || 'Unknown Error';
    result.errorCode = defaultErrorCode;
    result.error = error;

    return result;
  }

  sanitizePaymentProviderWithdrawResult(): PaymentProviderChannelWithdrawResult {
    if (this.result && this.data) {
      const data: MSZFChannelWithdrawResultData = <
        MSZFChannelWithdrawResultData
      >this.data;
      delete data.merchantOrderId;
      delete data.sign;
    }
    delete this.providerId;
    return this;
  }
}
