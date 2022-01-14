import { paymentProviderEnum } from '@workspace/enums';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
  PaymentProviderDepositResultData,
} from '../../payment.provider.deposit.result';

export class BisaDepositResult extends PaymentProviderDepositResult {}

export class BisaDepositResultData extends PaymentProviderDepositResultData {}

// {
//   "id": "cc66a05f-29e0-4356-98de-1dfdea385c14",
//   "coin": "usdt@trc20",
//   "amount": "19.64",
//   "scaled_amount": "19640000",
//   "cumulative_amount": "0",
//   "scaled_cumulative_amount": "0",
//   "created_at": 1622710723902,
//   "expired_at": 1622714323581,
//   "payment_link": "https://www.bisacrypto.com/payment/orders/cc66a05f-29e0-4356-98de-1dfdea385c14",
//   "order_key": "70831922",
//   "address": "TYqg2YUY8Zn37ExNFRJpSURkhJTabtPhdt",
//   "tag": null,
//   "notification_link": "https://localhost/api/payment/bisacallback/deposit"
// }

export class BisaChannelDepositResult extends PaymentProviderChannelDepositResult {
  static responseFactory(
    response,
    providerName: string
  ): BisaChannelDepositResult {
    const data: {
      id: string;
      coin: string;
      amount: string;
      scaled_amount: string;
      payment_link: string;
      address: string;
      notification_link: string;
    } = response.data;

    const result = new BisaChannelDepositResult();
    result.result = true;
    result.providerName = providerName;

    // if (result.result !== true) {
    //   result.errorMessage = '';
    //   result.errorCode = '';

    //   return result;
    // }

    result.providerOrderId = data.id;

    result.data = new BisaDepositResultData();
    result.data.url = data.payment_link;

    result.result = true;
    return result;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): BisaChannelDepositResult {
    const result = new BisaChannelDepositResult();
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
      const data = <BisaDepositResultData>this.data;
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
