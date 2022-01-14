import { paymentProviderEnum } from '@workspace/enums';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
  PaymentProviderDepositResultData,
} from '../../payment.provider.deposit.result';

export class XingChenDepositResult extends PaymentProviderDepositResult {}

export class XingChenDepositResultData extends PaymentProviderDepositResultData {
  public pay_link: string;

  public static responseFactory({ pay_link }): XingChenDepositResultData {
    const data = new XingChenDepositResultData();

    data.url = data.pay_link = pay_link;

    return data;
  }
}

export class XingChenChannelDepositResult extends PaymentProviderChannelDepositResult {
  static responseFactory(
    response,
    providerName: string
  ): XingChenChannelDepositResult {
    const { code, msg, pay_link } = response.data || {};

    const result = new XingChenChannelDepositResult();
    result.result = false;
    result.providerOrderId = null;
    result.providerName = providerName;

    if (code !== 0) {
      result.errorCode = code;
      result.errorMessage = msg || 'Unknown Error';
      return result;
    }

    result.data = XingChenDepositResultData.responseFactory({ pay_link });

    result.result = true;
    return result;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): XingChenChannelDepositResult {
    const result = new XingChenChannelDepositResult();
    result.result = false;
    result.providerName = providerName;

    const { status, message } = error;

    result.errorMessage = message || 'Unknown Error';
    result.errorCode = defaultErrorCode;
    //result.errorCode = status;
    result.error = error;

    return result;
  }

  sanitizePaymentProviderDepositResult(): PaymentProviderChannelDepositResult {
    if (this.data !== undefined) {
      const data = <XingChenDepositResultData>this.data;

      if (data && data.pay_link !== undefined) {
        delete data.pay_link;
      }
    }

    if (this.providerOrderId !== undefined) {
      delete this.providerOrderId;
    }

    return this;
  }
}
