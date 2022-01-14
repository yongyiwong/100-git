import { paymentProviderEnum } from '@workspace/enums';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
  PaymentProviderDepositResultData,
} from '../../payment.provider.deposit.result';

export class UzPAYDepositResult extends PaymentProviderDepositResult {}

export class UzPAYDepositResultData extends PaymentProviderDepositResultData {
  public action: string;
  public qrurl: string;
  public oid: string;
  public card: {
    bankflag: string;
    cardnumber: string;
    cardname: string;
    location: string;
    comment: string;
  };

  public static responseFactory(info): UzPAYDepositResultData {
    const data = new UzPAYDepositResultData();

    const { action, qrurl, oid, card } = info || {};

    data.action = action || '';
    data.url = data.qrurl = qrurl || '';
    data.oid = oid || null;
    data.card = card || {};

    return data;
  }
}

// {
//   success: true,
//   info: {
//     action: 'jump',
//     qrurl: 'http://uzpay.0708hx.com:9099/jump/alipay?oid=60010cd27be38=29992&at=',
//     oid: '300100188006',
//     card: {
//       bankflag: '',
//       cardnumber: '',
//       cardname: '',
//       location: '',
//       comment: ''
//     }
//   }
// }

//{ success: false, msg: '签名错误' }
//{ success: false, msg: '提交支付订单失败' }
// errorMessage: '未提供通道，请洽我方业务人员',
//{ success: false, msg: '金額不符合限制,单笔最小限额:300,单笔最大限额:10000' }
//缺少所需数据(from_bankflag)

export class UzPAYChannelDepositResult extends PaymentProviderChannelDepositResult {
  static getErrorCodeByMsg(errorMsg: string): string {
    if (/^签名/.test(errorMsg)) {
      return '101';
    }

    if (/^金額不符/.test(errorMsg)) {
      return '102';
    }

    if (/^10分钟内相同订单内容/.test(errorMsg)) {
      return '103';
    }

    if (/^提交支付订单失败/.test(errorMsg)) {
      return '104';
    }

    if (/^缺少所需数据/.test(errorMsg)) {
      return '105';
    }

    if (/^未提供通道/.test(errorMsg)) {
      return '106';
    }

    return '-1';
  }

  static responseFactory(
    response,
    providerName: string
  ): UzPAYChannelDepositResult {
    const { success, info, msg } = response.data || {};

    console.log(response.data);

    const result = new UzPAYChannelDepositResult();
    result.result = false;
    result.providerOrderId = null;
    result.providerName = providerName;

    if (success !== true) {
      result.errorMessage = msg;
      result.errorCode = UzPAYChannelDepositResult.getErrorCodeByMsg(msg);

      return result;
    }

    result.data = UzPAYDepositResultData.responseFactory(info);

    //const data = <UzPAYDepositResultData>result.data;

    result.result = true;

    return result;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): UzPAYChannelDepositResult {
    const result = new UzPAYChannelDepositResult();
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
      const data = <UzPAYDepositResultData>this.data;

      if (data) {
        delete data.action;
        delete data.card;
        delete data.oid;
        delete data.qrurl;
      }
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
