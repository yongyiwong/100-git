import { ErrorMessage } from '../../../error/error.service';
import { BCCheckClientOut } from '../../betContruct/dto/bc.checkclient.out';

export class PaymentProviderDepositResultData {
  url: string;
}
export abstract class PaymentProviderChannelDepositResult {
  public result: boolean;
  public code: number;

  public providerOrderId?: string;

  public providerName: string;

  public channelName?: string;
  public providerChannelName?: string;

  public channelRequestTime?: string;
  public channelRequestJson?: string;
  public channelResponseJson?: string;

  public errorCode?: string;
  public errorMessage?: string;
  public data?: PaymentProviderDepositResultData;
  public error?: {};

  abstract sanitizePaymentProviderDepositResult?(): PaymentProviderChannelDepositResult;

  constructor() {
    this.result = false;
    this.errorMessage = null;
    this.data = null;
  }
}

export class PaymentProviderDepositResult {

  // external result 
  result: boolean;
  code: number;
  msg: string;
  orderId: string;
  
  // internal result
  paymentProviderName: string;
  errorCode: string;
  errorMessage: string;
  error?: {};
  data: {
    url: string;
  };
  paymentProviderChannelDepositResults: PaymentProviderChannelDepositResult[];
  errorFront: ErrorMessage;

  static errorFactory(
    error,
    providerName: string,
    defaultErrorCode: string
  ): PaymentProviderDepositResult {
    const result = new PaymentProviderDepositResult();
    result.result = false;
    result.paymentProviderName = providerName;

    const { status, message } = error;

    result.errorMessage = message || 'Unknown Error';
    result.errorCode = defaultErrorCode;

    result.error = error;

    return result;
  }

  static bcCheckClientErrorFactory(
    bcCheckClientOut: BCCheckClientOut
  ): PaymentProviderDepositResult {
    const result = new PaymentProviderDepositResult();
    result.result = bcCheckClientOut.result;
    result.errorCode = `${bcCheckClientOut.errorCode}`;
    result.errorMessage = bcCheckClientOut.errorMessage;

    return result;
  }

  santitize(): PaymentProviderDepositResult {
    if (this.paymentProviderChannelDepositResults !== undefined) {
      delete this.paymentProviderChannelDepositResults;
    }

    return this;
  }
}
