import { PaymentProviderEnum } from '@workspace/enums';
import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../../payment.provider.withdraw.result';

export class XingChenWithdrawResult extends PaymentProviderWithdrawResult {}

export class XingChenChannelWithdrawResult extends PaymentProviderChannelWithdrawResult {
  static responseFactory(
    response,
    providerName: string
  ): XingChenChannelWithdrawResult {
    const result = new XingChenChannelWithdrawResult();
    result.result = false;
    result.providerName = providerName;

    const { code, msg } = response.data || {};

    if (code !== 0) {
      result.errorCode = code;
      result.errorMessage = msg;
      return result;
    }

    result.result = true;
    return result;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): XingChenChannelWithdrawResult {
    const result = new XingChenChannelWithdrawResult();
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
    delete this.providerId;
    return this;
  }
}
