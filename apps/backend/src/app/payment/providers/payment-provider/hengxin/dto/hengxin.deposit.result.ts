import { paymentProviderEnum } from '@workspace/enums';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
  PaymentProviderDepositResultData,
} from '../../payment.provider.deposit.result';

export class HengXinDepositResult extends PaymentProviderDepositResult {}

export class HengXinDepositResultData extends PaymentProviderDepositResultData {}

export class HengXinChannelDepositResult extends PaymentProviderChannelDepositResult {
  static responseFactory(
    response,
    providerName: string
  ): HengXinChannelDepositResult {
    const data: {
      code: string;
      success: boolean;
      message: string;
      transaction_no: string;
      trade_no: string;
      trade_amount: string;
      uri: string;
    } = response.data;

    const result = new HengXinChannelDepositResult();
    result.result = data.success;
    result.providerName = providerName;

    if (result.result !== true) {
      result.errorMessage = data.message;
      result.errorCode = data.code;

      return result;
    }

    result.providerOrderId = data.transaction_no;

    result.data = new HengXinDepositResultData();
    result.data.url = data.uri;

    result.result = true;
    return result;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): HengXinChannelDepositResult {
    const result = new HengXinChannelDepositResult();
    result.result = false;
    result.providerName = providerName;

    const { status, message } = error;

    result.errorMessage = message || 'Unknown Error';
    result.errorCode = defaultErrorCode;
    result.error = error;

    return result;
  }

  sanitizePaymentProviderDepositResult(): PaymentProviderChannelDepositResult {
    if (this.data !== undefined) {
      const data = <HengXinDepositResultData>this.data;
    }

    if (this.providerOrderId !== undefined) {
      delete this.providerOrderId;
    }

    if (this.result && this.errorMessage !== undefined) {
      delete this.errorMessage;
    }

    return this;
  }
}
