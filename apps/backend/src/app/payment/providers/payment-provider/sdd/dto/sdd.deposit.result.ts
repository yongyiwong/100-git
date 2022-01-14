import { paymentProviderEnum } from '@workspace/enums';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
  PaymentProviderDepositResultData,
} from '../../payment.provider.deposit.result';

export class SDDDepositResult extends PaymentProviderDepositResult {}

export class SDDDepositResultData extends PaymentProviderDepositResultData {}

export class SDDChannelDepositResult extends PaymentProviderChannelDepositResult {
  static responseFactory(
    response,
    providerName: string
  ): SDDChannelDepositResult {
    const data: {
      code: string;
      success: boolean;
      message: string;
      transaction_no: string;
      trade_no: string;
      trade_amount: string;
      uri: string;
    } = response.data;

    const result = new SDDChannelDepositResult();
    result.result = data.success;
    result.providerName = providerName;

    if (result.result !== true) {
      result.errorMessage = data.message;
      result.errorCode = data.code;

      return result;
    }

    result.providerOrderId = data.transaction_no;

    result.data = new SDDDepositResultData();
    result.data.url = data.uri;

    result.result = true;
    return result;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): SDDChannelDepositResult {
    const result = new SDDChannelDepositResult();
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
      const data = <SDDDepositResultData>this.data;
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
