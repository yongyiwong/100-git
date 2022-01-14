import { Injectable } from '@nestjs/common';
import { ms } from 'tencentcloud-sdk-nodejs';
import { PAYMENT_DEPOSIT_ERROR } from '../locale';
import { PaymentProviderDepositRequestDto } from '../payment/providers/payment-provider/payment.provider.deposit.request.dto';
import { PaymentProviderDepositResult } from '../payment/providers/payment-provider/payment.provider.deposit.result';
import { PaymentProviderWithdrawRequestDto } from '../payment/providers/payment-provider/payment.provider.withdraw.request.dto';
import { PaymentProviderWithdrawResult } from '../payment/providers/payment-provider/payment.provider.withdraw.result';
import { errorCodes } from './errorCode';

export class ErrorMessage {
  zh: string;
  en: string;
}

@Injectable()
export class ErrorService {
  constructor() { }

  getMsgDeposit(
    depositRequest: PaymentProviderDepositRequestDto,
    depositResult: PaymentProviderDepositResult,
    options?: {
      bcFailed: boolean;
    }
  ) {
    if (depositResult && depositResult.result) {
      return null;
    }

    const msg = new ErrorMessage();

    if (options && options.bcFailed) {
      msg.en = PAYMENT_DEPOSIT_ERROR.bcClient.en;
      msg.zh = PAYMENT_DEPOSIT_ERROR.bcClient.zh;
      return msg;
    }

    if (depositResult && depositResult.orderId) {
      msg.en = PAYMENT_DEPOSIT_ERROR.paymentProviderIntegration.en.replace(
        '%{orderId}',
        depositResult.orderId
      );
      msg.zh = PAYMENT_DEPOSIT_ERROR.paymentProviderIntegration.zh.replace(
        '%{orderId}',
        depositResult.orderId
      );
      return msg;
    }

    msg.en = PAYMENT_DEPOSIT_ERROR.noPaymentProvider.en;
    msg.zh = PAYMENT_DEPOSIT_ERROR.noPaymentProvider.zh;

    return msg;
  }

  santitizeDeposit(
    depositRequest: PaymentProviderDepositRequestDto,
    depositResult: PaymentProviderDepositResult
  ) {
    depositResult.msg = depositResult.result ? "Success" : errorCodes[depositResult.code]?.msg;

    if (depositResult.paymentProviderName) delete depositResult.paymentProviderName;
    if (depositResult.errorCode) delete depositResult.errorCode;
    if (depositResult.errorMessage) delete depositResult.errorMessage;

    delete depositResult.errorFront;

    if( depositResult.result ){
      depositResult.code = 0;
    }
  }

  santitizeWithdraw(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    withdrawResult: PaymentProviderWithdrawResult
  ){
    withdrawResult.msg = withdrawResult.result ? "Success": errorCodes[withdrawResult.code]?.msg;
  }
}
