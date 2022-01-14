import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as MobileDetect from 'mobile-detect';
import * as moment from 'moment';
import * as numeral from 'numeral';
import * as md5 from 'md5';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { PaymentProviderEnum, OrderStatusEnum } from '@workspace/enums';
import { ChannelService } from '../../../channel/channel.service';
import { DepositOrderService } from '../../../order/deposit-order/deposit.order.service';
import { DepositPendingOrderService } from '../../../order/deposit-pending-order/deposit.pending.order.service';
import { WithdrawOrderService } from '../../../order/withdraw-order/withdraw.order.service';
import { WithdrawPendingOrderService } from '../../../order/withdraw-pending-order/withdraw.pending.order.service';
import {
  PaymentProviderException,
  NotSupportedBank,
} from '../../../payment.exception';
import { PaymentProviderBankService } from '../../payment-provider-bank/payment.provider.bank.service';
import { PaymentProviderChannelService } from '../../payment-provider-channel/payment.provider.channel.service';
import { PaymentProviderDepositRequestDto } from '../payment.provider.deposit.request.dto';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
} from '../payment.provider.deposit.result';
import {
  PaymentProviderChannelDepositResultBundle,
  PaymentProviderService,
  PaymentProviderChannelWithdrawResultBundle,
} from '../payment.provider.service';
import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../payment.provider.withdraw.result';
import { XingChenDepositRequestParams } from './dto/xingchen.deposit.request.params';
import {
  XingChenChannelDepositResult,
  XingChenDepositResult,
} from './dto/xingchen.deposit.result';
import {
  XingChenDepositStatusResponseDto,
  XingChenDepositStatusEnum,
} from './dto/xingchen.deposit.status.response.dto';
import { XingChenWithdrawRequestParams } from './dto/xingchen.withdraw.request.params';
import {
  XingChenChannelWithdrawResult,
  XingChenWithdrawResult,
} from './dto/xingchen.withdraw.result';
import {
  XingChenWithdrawStatusResponseDto,
  XingChenWithdrawStatusEnum,
} from './dto/xingchen.withdraw.status.response.dto';
import { DepositPendingOrderModel } from '../../../../models/deposit.pending.order.model';
import { PaymentProviderChannelModel } from '../../../../models/payment.provider.channel.model';
import { BetConstructService } from '../../../betContruct/betConstruct.service';
import { BankService } from '../../../bank/bank.service';
import { PaymentProviderWithdrawRequestDto } from '../payment.provider.withdraw.request.dto';
import { PaymentProviderCardService } from '../../payment-provider-card/payment.provider.card.service';
import { PaymentProviderEntityService } from '../../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderSharedService } from '../../payment-provider-shared/payment.provider.shared.service';
import { PaymentProviderUsdtProtoService } from '../../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { PaymentProviderUsdtProtocolModel } from '../../../../models/payment.provider.usdt.protocol.model';
import { OptionsService } from '../../../../options/options.service';
import { ErrorCodeEnum } from '../../../../error/enums/errorCodeEnum';

export enum XingChenDepositCallbackResultEnum {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum XingChenWithdrawCallbackResultEnum {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Injectable()
export class XingChenPaymentProviderService extends PaymentProviderService {
  constructor(
    protected configService: ConfigService,
    protected channelService: ChannelService,
    protected bankService: BankService,
    protected depositPendingOrderService: DepositPendingOrderService,
    protected depositOrderService: DepositOrderService,
    protected withdrawPendingOrderService: WithdrawPendingOrderService,
    protected withdrawOrderService: WithdrawOrderService,
    protected paymentProviderChannelService: PaymentProviderChannelService,
    protected paymentProviderBankService: PaymentProviderBankService,
    protected paymentProviderUsdtProtoService: PaymentProviderUsdtProtoService,
    protected paymentProviderCardService: PaymentProviderCardService,
    protected payProviderEntityService: PaymentProviderEntityService,
    protected paymentProviderSharedService: PaymentProviderSharedService,
    protected sequelize: Sequelize,
    protected betConstructService: BetConstructService,
    protected optionsService: OptionsService,
    private httpService: HttpService
  ) {
    super(
      configService,
      channelService,
      bankService,
      depositPendingOrderService,
      depositOrderService,
      withdrawPendingOrderService,
      withdrawOrderService,
      paymentProviderChannelService,
      paymentProviderBankService,
      paymentProviderUsdtProtoService,
      paymentProviderCardService,
      payProviderEntityService,
      paymentProviderSharedService,
      sequelize,
      betConstructService,
      optionsService
    );
  }

  getPaymentProviderEnum(): PaymentProviderEnum {
    return PaymentProviderEnum.XINGCHEN;
  }

  async isAvailable(): Promise<boolean> {
    return true;
    // const host = this.configService.get<string>('XINGCHEN_HOST');
    // const url_available = this.configService.get<string>(
    //   'XINGCHEN_DEPOSIT_URL'
    // );
    // try {
    //   const response = await this.httpService
    //     .post(`http://${host}/${url_available}`, {})
    //     .toPromise();
    //   return response.status === 200;
    // } catch (error) {
    //   return false;
    // }
  }

  public depositErrorFactory(error): PaymentProviderDepositResult {
    return XingChenDepositResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('xingchen.DEFAULT_ERROR_CODE')
    );
  }

  public withdrawErrorFactory(error: any): PaymentProviderWithdrawResult {
    return XingChenWithdrawResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('uzpay.DEFAULT_ERROR_CODE')
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Implement Deposit Procedure
  ////////////////////////////////////////////////////////////////////////////////
  public async depositByPaymentProviderChannel(
    depositRequest: PaymentProviderDepositRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    paymentProviderUsdtProto: PaymentProviderUsdtProtocolModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelDepositResultBundle> {
    const channelDepositResultBundle = new PaymentProviderChannelDepositResultBundle();

    let depositResult: XingChenChannelDepositResult;
    let order: DepositPendingOrderModel;

    const channelDepositResultDefault = { providerName: this.getPaymentProviderName() };

    order = await this.createOrderBeforeDeposit(
      depositRequest,
      paymentProviderChannel,
      transaction
    );
    if (!order) {
      return {
        depositResult: { ...channelDepositResultDefault, result: false, code: ErrorCodeEnum.DEPOSIT_PROVIDER_ORDER_NOT_CREATED },
        order: null
      };
    }

    const params = new XingChenDepositRequestParams();

    params.amount = order.amount * 100;
    params.channel_id = paymentProviderChannel.providerChannelName;
    params.client_ip = depositRequest.ip;
    params.mch_id = this.configService.get<string>('XINGCHEN_MCH_ID');

    params.notify_url =
      this.getBaseUrl(depositRequest.headers['host']) +
      this.configService.get<string>('xingchen.DEPOSIT_SUCCESS_URL');

    params.order_id = order.orderId;

    const md = new MobileDetect(depositRequest.headers['user-agent']);
    params.platform = md.mobile() ? 'mobile' : 'pc';

    params.time_stamp = `${moment().unix()}`;
    params.sign = this.getDepositRequestSign(
      params,
      this.configService.get<string>('XINGCHEN_KEY')
    );

    //console.log(params, 'XingChenRequestParams');

    const host = this.configService.get<string>('XINGCHEN_HOST');
    const url = this.configService.get<string>('XINGCHEN_DEPOSIT_URL');
    const response = await this.httpService
      .post(`http://${host}/${url}`, params)
      .toPromise();

    //console.log(response.data, 'XingChenResponse');

    depositResult = XingChenChannelDepositResult.responseFactory(
      response,
      this.getPaymentProviderName()
    );

    if (!depositResult) {
      return null;
    }

    depositResult.channelRequestTime = moment()
      .utcOffset('+08:00')
      .format('YYYY-MM-DD HH:mm:ss');
    depositResult.channelRequestJson = JSON.stringify(params);
    depositResult.channelResponseJson = JSON.stringify(response.data);

    channelDepositResultBundle.depositResult = depositResult;
    channelDepositResultBundle.order = order;

    return channelDepositResultBundle;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit Callback
  ////////////////////////////////////////////////////////////////////////////////
  async depositCallback(
    depositStatusResponse: XingChenDepositStatusResponseDto,
    ip: string
  ): Promise<string> {
    if (!(await this.beforeDepositCallback(depositStatusResponse, ip))) {
      return XingChenDepositCallbackResultEnum.FAILED;
    }

    const mch_id = this.configService.get<string>('XINGCHEN_MCH_ID');
    if (mch_id !== depositStatusResponse.mch_id) {
      return XingChenDepositCallbackResultEnum.FAILED;
    }

    const order = await this.depositPendingOrderService.findByOrderId(
      depositStatusResponse.order_id
    );

    if (!order) {
      return XingChenDepositCallbackResultEnum.FAILED;
    }

    const sign = this.getDepositStatusResponseSign(
      depositStatusResponse,
      this.configService.get<string>('XINGCHEN_KEY')
    );

    if (sign.toUpperCase() !== depositStatusResponse.sign.toUpperCase()) {
      return XingChenDepositCallbackResultEnum.FAILED;
    }

    if (order.amount * 100 !== depositStatusResponse.amount) {
      return XingChenDepositCallbackResultEnum.FAILED;
    }

    order.status = this.getOrderStatusByDepositStatus(
      depositStatusResponse.pay_status
    );

    order.providerOrderId = depositStatusResponse.trade_no;

    if (order.status === OrderStatusEnum.SUCCESS) {
      const bcOrder = await this.depositBCAfterDepositCallback(order);
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.updateOrderAfterDepositCallback(order, transaction);
      });
    } catch (error) {
      return XingChenWithdrawCallbackResultEnum.FAILED;
    }

    return XingChenDepositCallbackResultEnum.SUCCESS;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Implement Withdraw Procedure
  ////////////////////////////////////////////////////////////////////////////////
  async withdrawByPaymentProviderChannel(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelWithdrawResultBundle> {
    const withdrawProcResult = new PaymentProviderChannelWithdrawResultBundle();

    let withdrawResult: XingChenChannelWithdrawResult;

    const channelWithdrawResultDefault = { providerName: this.getPaymentProviderName() };

    const order = await this.createOrderBeforeWithdraw(
      withdrawRequest,
      transaction
    );
    if (!order) {
      return {
        withdrawResult: { ...channelWithdrawResultDefault, result: false, code: ErrorCodeEnum.WITHDRAW_PROVIDER_ORDER_NOT_CREATED },
        order: null
      };
    }

    const paymentProviderBank = await this.getPaymentProviderBank(
      withdrawRequest.bankCode
    );
    if (!paymentProviderBank) {
      throw new NotSupportedBank();
    }

    const params = new XingChenWithdrawRequestParams();

    params.mch_id = this.configService.get<string>('XINGCHEN_MCH_ID');
    params.order_id = order.orderId;
    params.amount = order.amount * 100;
    params.notify_url =
      this.getBaseUrl(withdrawRequest.headers['host']) +
      this.configService.get<string>('xingchen.WITHDRAWAL_SUCCESS_URL');
    params.passwd = md5(
      this.configService.get<string>('XINGCHEN_WITHDRAW_PASSWORD')
    );
    params.bank = paymentProviderBank.paymentProviderBankCode;

    params.bank_site =
      !withdrawRequest.branch || !withdrawRequest.branch.trim()
        ? paymentProviderBank.paymentProviderBankName
        : withdrawRequest.branch;

    params.bank_account = withdrawRequest.bankAccountNumber;
    params.bank_account_name = withdrawRequest.bankAccountName;
    params.time_stamp = `${moment().unix()}`;
    params.sign = this.getWithdrawRequestSign(
      params,
      this.configService.get<string>('XINGCHEN_KEY')
    );

    const host = this.configService.get<string>('XINGCHEN_HOST');
    const url = this.configService.get<string>('XINGCHEN_WITHDRAW_URL');

    const response = await this.httpService
      .post(`http://${host}/${url}`, params)
      .toPromise();

    withdrawResult = XingChenChannelWithdrawResult.responseFactory(
      response,
      this.getPaymentProviderName()
    );

    if (!withdrawResult.result) {
      withdrawResult.code = ErrorCodeEnum.WITHDRAW_PROVIDER_FAILED;
    }

    withdrawProcResult.withdrawResult = withdrawResult;
    withdrawProcResult.order = order;

    return withdrawProcResult;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw Callback
  ////////////////////////////////////////////////////////////////////////////////
  async withdrawCallback(
    withdrawStatusResponse: XingChenWithdrawStatusResponseDto,
    ip: string
  ): Promise<string> {
    if (!(await this.beforeWithdrawCallback(withdrawStatusResponse, ip))) {
      return XingChenWithdrawCallbackResultEnum.FAILED;
    }

    const mch_id = this.configService.get<string>('XINGCHEN_MCH_ID');
    if (mch_id !== withdrawStatusResponse.mch_id) {
      return XingChenWithdrawCallbackResultEnum.FAILED;
    }

    const order = await this.withdrawPendingOrderService.findByOrderId(
      withdrawStatusResponse.order_id
    );

    if (!order) {
      return XingChenWithdrawCallbackResultEnum.FAILED;
    }

    const sign = this.getWithdrawStatusResponseSign(
      withdrawStatusResponse,
      this.configService.get<string>('XINGCHEN_KEY')
    );

    if (sign.toUpperCase() !== withdrawStatusResponse.sign.toUpperCase()) {
      return XingChenWithdrawCallbackResultEnum.FAILED;
    }

    if (order.amount * 100 !== withdrawStatusResponse.amount) {
      return XingChenWithdrawCallbackResultEnum.FAILED;
    }

    order.status = this.getOrderStatusByWithdrawStatus(
      withdrawStatusResponse.pay_status
    );

    if (
      order.status ===
      OrderStatusEnum.SUCCESS /* ||
      order.status === OrderStatusEnum.FAILED */
    ) {
      await this.withdrawBCAfterWithdrawCallback(order);
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.updateOrderAfterWithdrawCallback(order, transaction);
      });
    } catch (error) {
      return XingChenWithdrawCallbackResultEnum.FAILED;
    }

    return XingChenWithdrawCallbackResultEnum.SUCCESS;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Request Sign
  ////////////////////////////////////////////////////////////////////////////////
  getDepositRequestSign(
    params: XingChenDepositRequestParams,
    key: string
  ): string {
    const txtSource =
      `amount=${params.amount}` +
      `&channel_id=${params.channel_id}` +
      `&client_ip=${params.client_ip}` +
      `&mch_id=${params.mch_id}` +
      `&notify_url=${params.notify_url}` +
      `&order_id=${params.order_id}` +
      `&platform=${params.platform}` +
      `&time_stamp=${params.time_stamp}` +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Withdraw Request Sign
  ////////////////////////////////////////////////////////////////////////////////
  getWithdrawRequestSign(params: XingChenWithdrawRequestParams, key: string) {
    const txtSource =
      `amount=${params.amount}` +
      `&bank=${params.bank}` +
      `&bank_account=${params.bank_account}` +
      `&bank_account_name=${params.bank_account_name}` +
      `&bank_site=${params.bank_site}` +
      `&mch_id=${params.mch_id}` +
      `&notify_url=${params.notify_url}` +
      `&order_id=${params.order_id}` +
      `&passwd=${params.passwd}` +
      `&time_stamp=${params.time_stamp}` +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Status Sign
  ////////////////////////////////////////////////////////////////////////////////
  getDepositStatusResponseSign(
    paymentStatus: XingChenDepositStatusResponseDto,
    key: string
  ): string {
    const txtSource =
      `amount=${paymentStatus.amount}` +
      `&bank_mark=${paymentStatus.bank_mark}` +
      `&mch_id=${paymentStatus.mch_id}` +
      `&order_id=${paymentStatus.order_id}` +
      `&pay_status=${paymentStatus.pay_status}` +
      (paymentStatus.pay_time.length > 0
        ? `&pay_time=${paymentStatus.pay_time}`
        : '') +
      `&time_stamp=${paymentStatus.time_stamp}` +
      `&trade_no=${paymentStatus.trade_no}` +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Withdraw Status Sign
  ////////////////////////////////////////////////////////////////////////////////
  getWithdrawStatusResponseSign(
    withdrawStatus: XingChenWithdrawStatusResponseDto,
    key: string
  ): string {
    const txtSource =
      `amount=${withdrawStatus.amount}` +
      `&bank=${withdrawStatus.bank}` +
      `&bank_account=${withdrawStatus.bank_account}` +
      `&bank_account_name=${withdrawStatus.bank_account_name}` +
      `&bank_site=${withdrawStatus.bank_site}` +
      `&mch_id=${withdrawStatus.mch_id}` +
      `&order_id=${withdrawStatus.order_id}` +
      `&pay_status=${withdrawStatus.pay_status}` +
      `&pay_time=${withdrawStatus.pay_time}` +
      `&time_stamp=${withdrawStatus.time_stamp}` +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get OrderStatus By DepositStatus
  ////////////////////////////////////////////////////////////////////////////////
  getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum {
    let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    const depositStatus = <XingChenDepositStatusEnum>argDepositStatus;

    switch (depositStatus) {
      case XingChenDepositStatusEnum.SUCCESS:
        orderStatus = OrderStatusEnum.SUCCESS;
        break;
      case XingChenDepositStatusEnum.PENDING:
        orderStatus = OrderStatusEnum.PENDING;
        break;
      case XingChenDepositStatusEnum.FAILED:
        orderStatus = OrderStatusEnum.FAILED;
        break;
    }
    return orderStatus;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get OrderStatus By WithdrawStatus
  ////////////////////////////////////////////////////////////////////////////////
  getOrderStatusByWithdrawStatus(argWithdrawStatus: {}): OrderStatusEnum {
    let orderStatus = OrderStatusEnum.NEW;
    const withdrawStatus = <XingChenWithdrawStatusEnum>argWithdrawStatus;

    switch (withdrawStatus) {
      case XingChenWithdrawStatusEnum.SUCCESS:
        orderStatus = OrderStatusEnum.SUCCESS;
        break;
      case XingChenWithdrawStatusEnum.PENDING:
        orderStatus = OrderStatusEnum.PENDING;
        break;
      case XingChenWithdrawStatusEnum.FAILED:
        orderStatus = OrderStatusEnum.FAILED;
        break;
    }

    return orderStatus;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Frozen Status By Channel DepositResult
  ////////////////////////////////////////////////////////////////////////////////
  protected getFrozenByChannelDepositResult(
    paymentProviderChannel: PaymentProviderChannelModel,
    depositRequest: PaymentProviderDepositRequestDto,
    depositResult: PaymentProviderChannelDepositResult
  ): boolean {
    const errorCode = depositResult
      ? numeral(depositResult.errorCode).value()
      : null;
    if (errorCode === null) {
      return false;
    }

    const frozenCodes =
      this.configService.get<number[]>('xingchen.DEPOSIT_FROZEN_CODE') || [];

    return (
      frozenCodes.filter((frozenCode) => frozenCode === errorCode).length > 0
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Frozen Status By Channel WithdrawResult
  ////////////////////////////////////////////////////////////////////////////////
  protected getFrozenByChannelWithdrawResult(
    withdrawResult: PaymentProviderChannelWithdrawResult
  ): boolean {
    const errorCode = withdrawResult
      ? numeral(withdrawResult.errorCode).value()
      : null;
    if (errorCode === null) {
      return false;
    }

    const frozenCodes =
      this.configService.get<number[]>('xingchen.WITHDRAW_FROZEN_CODE') || [];

    return (
      frozenCodes.filter((frozenCode) => frozenCode === errorCode).length > 0
    );
  }
}
