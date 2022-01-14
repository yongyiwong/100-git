import { ErrorCodeEnum } from '../../../error/enums/errorCodeEnum';
import { BCCheckWithdrawHashOut } from '../../betContruct/dto/bc.check.withdraw.hash.out';
import { BCCheckWithdrawIPWhiteListOut } from '../../betContruct/dto/bc.check.withdraw.ipwhitelist.out';

export class PaymentProviderWithdrawResultData {}
export abstract class PaymentProviderChannelWithdrawResult {
  public result: boolean;
  public code: number;

  public providerId?: string;
  public providerName: string;

  public channelName?: string;
  public providerChannelName?: string;

  public channelRequestTime?: string;
  public channelRequestJson?: string;
  public channelResponseJson?: string;

  public errorCode?: string;
  public errorMessage?: string;
  public data?: PaymentProviderWithdrawResultData;
  public error?: {};
  abstract sanitizePaymentProviderWithdrawResult?(): PaymentProviderChannelWithdrawResult;
}

export class PaymentProviderWithdrawResult {
  // response: {
  //   code: number;
  //   message?: string;
  // };

  // external result 
  result: boolean;
  code: number;
  msg: string;

  // internal result
  paymentProviderName: string;

  // result: boolean;
  // errorCode: string;
  // errorMessage: string;

  error?: {};
  data: {};
  paymentProviderChannelWithdrawResults: PaymentProviderChannelWithdrawResult[];

  // static bcCheckIPWhiteListErrorFactory(
  //   bcCheckWithdrawIPWhiteListOut: BCCheckWithdrawIPWhiteListOut
  // ): PaymentProviderWithdrawResult {
  //   const result = new PaymentProviderWithdrawResult();

  //   // result.result = bcCheckWithdrawIPWhiteListOut.result;
  //   // result.errorCode = `${bcCheckWithdrawIPWhiteListOut.errorCode}`;
  //   // result.errorMessage = bcCheckWithdrawIPWhiteListOut.errorMessage;

  //   // result.response = {
  //   //   code: bcCheckWithdrawIPWhiteListOut.result
  //   //     ? 0
  //   //     : bcCheckWithdrawIPWhiteListOut.errorCode,
  //   // };

  //   // if (result.response.code !== 0) {
  //   //   result.response.message = bcCheckWithdrawIPWhiteListOut.errorMessage;
  //   // }

  //   result.code = ErrorCodeEnum.WITHDRAW_IP_INVALID;
  //   return result;
  // }

  // static bcCheckWithdrawHashErrorFactory(
  //   bcCheckWithdrawHashOut: BCCheckWithdrawHashOut
  // ): PaymentProviderWithdrawResult {
  //   const result = new PaymentProviderWithdrawResult();

  //   // result.result = bcCheckWithdrawHashOut.result;
  //   // result.errorCode = `${bcCheckWithdrawHashOut.errorCode}`;
  //   // result.errorMessage = bcCheckWithdrawHashOut.errorMessage;

  //   result.response = {
  //     code: bcCheckWithdrawHashOut.result
  //       ? 0
  //       : bcCheckWithdrawHashOut.errorCode,
  //   };

  //   if (result.response.code !== 0) {
  //     result.response.message = bcCheckWithdrawHashOut.errorMessage;
  //   }

  //   return result;
  // }

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): PaymentProviderWithdrawResult {
    const result = new PaymentProviderWithdrawResult();
    
    //result.result = false;
    result.paymentProviderName = providerName;

    const { status, message } = error;

    // result.errorMessage = message || 'Unknown Error';
    // result.errorCode = defaultErrorCode;

    result.error = error;

    return result;
  }

  santitize(): PaymentProviderWithdrawResult {
    if (this.paymentProviderChannelWithdrawResults !== undefined) {
      delete this.paymentProviderChannelWithdrawResults;
    }

    return this;
  }
}
