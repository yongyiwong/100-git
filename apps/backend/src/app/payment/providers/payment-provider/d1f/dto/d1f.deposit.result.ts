import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
  PaymentProviderDepositResultData,
} from '../../payment.provider.deposit.result';

export class D1FDepositResult extends PaymentProviderDepositResult {}

export class D1FDepositResultData extends PaymentProviderDepositResultData {
  responseUrl: string;

  static responseFactory(data): D1FDepositResultData {
    const depositResultData: D1FDepositResultData = new D1FDepositResultData();
    depositResultData.url = depositResultData.responseUrl = data.responseUrl;
    return depositResultData;
  }
}

export class D1FChannelDepositResult extends PaymentProviderChannelDepositResult {
  static getErrorCodeByMsg(errorMsg: string): string {
    if (/^无可用支付渠道/.test(errorMsg)) {
      return '101';
    }
    return '-1';
  }

  static responseFactory(
    response,
    providerName: string,
    defaultErrorCode: number
  ): D1FChannelDepositResult {
    const depositResult = new D1FChannelDepositResult();
    depositResult.result = false;

    const { Result, ResultMsg } = response.data || {};
    depositResult.errorCode = `${defaultErrorCode}`;
    depositResult.errorMessage = ResultMsg || 'Unknown';
    depositResult.providerName = providerName;
    if (response.status !== 200) {
      depositResult.errorCode = D1FChannelDepositResult.getErrorCodeByMsg(
        ResultMsg
      );
      return depositResult;
    }

    console.log(response.data);

    const { res, _redirectable } = response.request || {};
    if (!res || !_redirectable) {
      depositResult.errorCode = D1FChannelDepositResult.getErrorCodeByMsg(
        ResultMsg
      );
      return depositResult;
    }

    const { responseUrl } = res;
    if (!responseUrl) {
      depositResult.errorCode = D1FChannelDepositResult.getErrorCodeByMsg(
        ResultMsg
      );
      return depositResult;
    }

    const { _redirectCount } = _redirectable || {};
    if (!_redirectCount || _redirectCount < 1) {
      depositResult.errorCode = D1FChannelDepositResult.getErrorCodeByMsg(
        ResultMsg
      );
      return depositResult;
    }

    depositResult.result = true;
    depositResult.errorCode = '';
    depositResult.errorMessage = null;
    depositResult.data = D1FDepositResultData.responseFactory({
      responseUrl,
    });

    return depositResult;
  }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): D1FChannelDepositResult {
    const result = new D1FChannelDepositResult();
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
    if (!this.result || !this.data) {
      return this;
    }

    const data = <D1FDepositResultData>this.data;

    delete data.responseUrl;

    return this;
  }
}
