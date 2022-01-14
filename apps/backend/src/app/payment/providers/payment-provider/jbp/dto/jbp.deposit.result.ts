import { paymentProviderEnum } from '@workspace/enums';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
  PaymentProviderDepositResultData,
} from '../../payment.provider.deposit.result';

export class JBPDepositResult extends PaymentProviderDepositResult {}

export class JBPDepositResultData extends PaymentProviderDepositResultData {}

export class JBPChannelDepositResult extends PaymentProviderChannelDepositResult {
  static responseFactory(
    response,
    providerName: string
  ): JBPChannelDepositResult {
    const data: {
      code: number;
      success: boolean;
      msg: string;
      data: {
        link: string;
        orderNo: string;
      };
    } = response.data;

    const result = new JBPChannelDepositResult();
    result.result = data.success;
    result.providerName = providerName;

    if (result.result !== true || !data.data) {
      result.errorMessage = data.msg || '';
      result.errorCode = `${data.code}` || '';

      return result;
    }

    result.providerOrderId = data.data.orderNo;

    result.data = new JBPDepositResultData();
    result.data.url = data.data.link;

    result.result = true;
    return result;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): JBPChannelDepositResult {
    const result = new JBPChannelDepositResult();
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
      const data = <JBPDepositResultData>this.data;
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
