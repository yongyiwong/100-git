import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../../payment.provider.withdraw.result';

export class UzPAYWithdrawResult extends PaymentProviderWithdrawResult {}

// { success: false, msg: '您的IP不在服務範圍內(xxx.xxx.xxx.xxx)' }
// { success: false, msg: '帐户余额不足' }
// { success: false, msg: '签名错误' }
// { success: false, msg: '10分钟内相同订单内容' }
// { success: false, msg: '未提供通道，请洽我方业务人员' }
// { "success": false,"msg": "金額不符合限制,单笔最小限额:1000,单笔最大限额:30000"}

export class UzPAYChannelWithdrawResult extends PaymentProviderChannelWithdrawResult {
  static getErrorCodeByMsg(errorMsg: string): string {
    if (/^签名错误/.test(errorMsg)) {
      return '201';
    }

    if (/^您的IP/.test(errorMsg)) {
      return '202';
    }

    if (/^帐户余额不足/.test(errorMsg)) {
      return '203';
    }

    if (/^金額不符/.test(errorMsg)) {
      return '204';
    }

    if (/^未提供通道/.test(errorMsg)) {
      return '205';
    }

    return '-1';
  }

  static responseFactory(
    response,
    providerName: string
  ): UzPAYChannelWithdrawResult {
    const withdrawResult = new UzPAYChannelWithdrawResult();
    withdrawResult.result = false;
    withdrawResult.providerName = providerName;

    const { success, msg } = response.data || {};

    console.log(response.data);

    if (success !== true) {
      withdrawResult.errorCode = UzPAYChannelWithdrawResult.getErrorCodeByMsg(
        msg
      );
      withdrawResult.errorMessage = msg;
      return withdrawResult;
    }

    withdrawResult.result = true;
    return withdrawResult;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): UzPAYChannelWithdrawResult {
    const result = new UzPAYChannelWithdrawResult();
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
