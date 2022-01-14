import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
  PaymentProviderDepositResultData,
} from '../../payment.provider.deposit.result';
import { paymentProviderEnum } from '@workspace/enums';
export class MSZFErrorMsg {
  code: number;
  errorMsg: string;
  descript: string;
}

export class MSZFDepositResult extends PaymentProviderDepositResult {}

export class MSZFDepositResultData extends PaymentProviderDepositResultData {
  httpUrl: string;
  httpsUrl: string;
  sign: string;

  static responseFactory(data) {
    const depositResultData = new MSZFDepositResultData();
    depositResultData.httpUrl = data.httpUrl;
    depositResultData.url = depositResultData.httpsUrl = data.httpsUrl;
    depositResultData.sign = data.sign;

    return depositResultData;
  }
}

export class MSZFChannelDepositResult extends PaymentProviderChannelDepositResult {
  static responseFactory(
    response,
    providerName: string
  ): MSZFChannelDepositResult {
    const { result, errorMsg, data } = response.data;
    const depositResult = new MSZFChannelDepositResult();

    depositResult.result = result;
    depositResult.providerName = providerName;
    depositResult.errorMessage = null;
    if (errorMsg) {
      depositResult.errorCode = errorMsg.code;
      depositResult.errorMessage = `${errorMsg.errorMsg} ${errorMsg.descript}`;
      // mSZFPaymentProviderDepositResult.errorMessage.code = errorMsg.code;
      // mSZFPaymentProviderDepositResult.errorMessage.descript = errorMsg.descript;
      // mSZFPaymentProviderDepositResult.errorMessage.errorMsg = errorMsg.errorMsg;
    }
    depositResult.data = null;
    if (data) {
      depositResult.data = MSZFDepositResultData.responseFactory(data);
      depositResult.providerOrderId = data.gamerOrderId || null;
    }
    return depositResult;
  }

  static errorFactory(error, providerName: string, defaultErrorCode: string) {
    const result = new MSZFChannelDepositResult();
    result.result = false;
    result.providerOrderId = null;
    result.providerName = providerName;

    const { status, message } = error;

    result.errorMessage = message || 'Unknown Error';
    result.errorCode = defaultErrorCode;
    result.error = error;

    return result;
  }

  sanitizePaymentProviderDepositResult(): MSZFChannelDepositResult {
    if (this.result && this.data) {
      const data: MSZFDepositResultData = <MSZFDepositResultData>this.data;
      delete data.sign;
      delete data.httpUrl;
      delete data.httpsUrl;
    }
    delete this.providerOrderId;
    return this;
  }
}
