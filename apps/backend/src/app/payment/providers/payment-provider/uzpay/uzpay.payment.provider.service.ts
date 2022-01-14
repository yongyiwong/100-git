import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatusEnum, PaymentProviderEnum } from '@workspace/enums';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { ChannelService } from '../../../channel/channel.service';
import { DepositOrderService } from '../../../order/deposit-order/deposit.order.service';
import { DepositPendingOrderService } from '../../../order/deposit-pending-order/deposit.pending.order.service';
import { WithdrawOrderService } from '../../../order/withdraw-order/withdraw.order.service';
import { WithdrawPendingOrderService } from '../../../order/withdraw-pending-order/withdraw.pending.order.service';
import { PaymentProviderBankService } from '../../payment-provider-bank/payment.provider.bank.service';
import { PaymentProviderChannelService } from '../../payment-provider-channel/payment.provider.channel.service';
import {
  PaymentProviderChannelDepositResultBundle,
  PaymentProviderService,
  PaymentProviderChannelWithdrawResultBundle,
} from '../payment.provider.service';
import { PaymentProviderDepositRequestDto } from '../payment.provider.deposit.request.dto';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
} from '../payment.provider.deposit.result';
import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../payment.provider.withdraw.result';
import {
  UzPAYDepositStatusEnum,
  UzPAYDepositStatusResponseDto,
} from './dto/uzpay.deposit.status.response.dto';
import {
  UzPAYWithdrawStatusEnum,
  UzPAYWithdrawStatusResponseDto,
} from './dto/uzpay.withdraw.status.response.dto';
import {
  UzPAYChannelDepositResult,
  UzPAYDepositResult,
} from './dto/uzpay.deposit.result';
import {
  UzPAYChannelWithdrawResult,
  UzPAYWithdrawResult,
} from './dto/uzpay.withdraw.result';
import { UzPAYDepositRequestParams } from './dto/uzpay.deposit.request.param';
import {
  NotSupportedBank,
  PaymentProviderException,
} from '../../../payment.exception';

import * as numeral from 'numeral';
import * as md5 from 'md5';
import { UzPAYWithdrawRequestParams } from './dto/uzpay.withdraw.request.params';
import { DepositPendingOrderModel } from '../../../../models/deposit.pending.order.model';
import { PaymentProviderChannelModel } from '../../../../models/payment.provider.channel.model';
import { BetConstructService } from '../../../betContruct/betConstruct.service';

import * as moment from 'moment-timezone';
import { BankService } from '../../../bank/bank.service';
import { PaymentProviderWithdrawRequestDto } from '../payment.provider.withdraw.request.dto';
import { PaymentProviderCardService } from '../../payment-provider-card/payment.provider.card.service';
import { PaymentProviderEntityService } from '../../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderSharedService } from '../../payment-provider-shared/payment.provider.shared.service';
import { PaymentProviderUsdtProtoService } from '../../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { PaymentProviderUsdtProtocolModel } from '../../../../models/payment.provider.usdt.protocol.model';
import { OptionsService } from '../../../../options/options.service';
import { ErrorCodeEnum } from '../../../../error/enums/errorCodeEnum';

export enum UzPAYDepositCallbackResultEnum {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum UzPAYWithdrawCallbackResultEnum {
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Injectable()
export class UzPAYPaymentProviderService extends PaymentProviderService {
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
    private httpService: HttpService // @InjectModel(TestModel) // private testRepository: typeof TestModel
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
    return PaymentProviderEnum.UZPAY;
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  public depositErrorFactory(error: any): PaymentProviderDepositResult {
    return UzPAYDepositResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('uzpay.DEFAULT_ERROR_CODE')
    );
  }

  public withdrawErrorFactory(error: any): PaymentProviderWithdrawResult {
    return UzPAYWithdrawResult.errorFactory(
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

    let depositResult: UzPAYChannelDepositResult;
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

    const params = new UzPAYDepositRequestParams();

    params.uid = this.configService.get<string>('UZPAY_UID');
    params.userid = depositRequest.userId;
    params.amount = numeral(depositRequest.amount).format('0.00');
    params.orderid = order.orderId;
    params.cate = paymentProviderChannel.providerChannelName;

    const channel = await this.channelService.findById(
      paymentProviderChannel.channelId
    );
    if (!channel) {
      return {
        depositResult: { ...channelDepositResultDefault, result: false, code: ErrorCodeEnum.DEPOSIT_PROVIDER_CHANNEL_NOT_FOUND },
        order
      };
    }

    if (channel.fromPaymentSystem.isBank) {
      const paymentProviderBank = await this.getPaymentProviderBank(
        depositRequest.bankCode
      );
      if (!paymentProviderBank) {
        throw new NotSupportedBank();
      }
      params.from_bankflag = paymentProviderBank.paymentProviderBankName;
    } else {
      params.from_bankflag = this.configService.get<string>(
        'uzpay.OTHER_BANKFLAG'
      );
    }
    params.userip = depositRequest.ip;
    params.notify =
      this.getBaseUrl(depositRequest.headers['host']) +
      this.configService.get<string>('uzpay.DEPOSIT_SUCCESS_URL');

    params.sign = this.getDepositRequestSign(
      params,
      this.configService.get<string>('UZPAY_KEY')
    );

    const host = this.configService.get<string>('UZPAY_HOST');
    const url = this.configService.get<string>('UZPAY_DEPOSIT_URL');
    const response = await this.httpService
      .post(`https://${host}/${url}`, params)
      .toPromise();

    depositResult = UzPAYChannelDepositResult.responseFactory(
      response,
      this.getPaymentProviderName()
    );

    if (!depositResult.result) {
      depositResult.code = ErrorCodeEnum.DEPOSIT_PROVIDER_FAILED;
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
    depositStatusResponse: UzPAYDepositStatusResponseDto,
    ip: string
  ): Promise<string> {
    if (!(await this.beforeDepositCallback(depositStatusResponse, ip))) {
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    const order = await this.depositPendingOrderService.findByOrderId(
      depositStatusResponse.orderid
    );

    if (!order) {
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    const sign = this.getDepositStatusResponseSign(
      depositStatusResponse,
      this.configService.get<string>('UZPAY_KEY')
    );

    if (sign.toUpperCase() !== depositStatusResponse.sign.toUpperCase()) {
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    if (
      `${order.amount}` !== `${numeral(depositStatusResponse.amount).value()}`
    ) {
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    order.status = this.getOrderStatusByDepositStatus(
      depositStatusResponse.status
    );

    order.providerOrderId = depositStatusResponse.oid;

    if (order.status === OrderStatusEnum.SUCCESS) {
      const bcOrder = await this.depositBCAfterDepositCallback(order);
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.updateOrderAfterDepositCallback(order, transaction);
      });
    } catch (error) {
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    return UzPAYDepositCallbackResultEnum.SUCCESS;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw Procedure
  ////////////////////////////////////////////////////////////////////////////////
  public async withdrawByPaymentProviderChannel(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelWithdrawResultBundle> {
    const withdrawProcResult = new PaymentProviderChannelWithdrawResultBundle();

    let withdrawResult: UzPAYChannelWithdrawResult;

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
      return {
        withdrawResult: { ...channelWithdrawResultDefault, result: false, code: ErrorCodeEnum.DEPOSIT_PROVIDER_ORDER_NOT_CREATED },
        order
      };
    }

    const params = new UzPAYWithdrawRequestParams();

    params.uid = this.configService.get<string>('UZPAY_UID');
    params.userid = withdrawRequest.userId;
    params.amount = numeral(order.amount).format('0.00');
    params.orderid = order.orderId;

    params.to_bankflag = paymentProviderBank.paymentProviderBankName;
    params.to_subbankflag =
      !withdrawRequest.branch || !withdrawRequest.branch.trim()
        ? paymentProviderBank.paymentProviderBankName
        : withdrawRequest.branch;

    params.to_cardnumber = withdrawRequest.bankAccountNumber;
    params.to_cardname = withdrawRequest.bankAccountName;
    params.to_province = withdrawRequest.province;
    params.to_city = withdrawRequest.city;
    params.notify =
      this.getBaseUrl(withdrawRequest.headers['host']) +
      this.configService.get<string>('uzpay.WITHDRAWAL_SUCCESS_URL');
    //params.extend = '';

    params.sign = this.getWithdrawRequestSign(
      params,
      this.configService.get<string>('UZPAY_KEY')
    );

    const host = this.configService.get<string>('UZPAY_HOST');
    const url = this.configService.get<string>('UZPAY_WITHDRAW_URL');

    const response = await this.httpService
      .post(`https://${host}/${url}`, params)
      .toPromise();

    withdrawResult = UzPAYChannelWithdrawResult.responseFactory(
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
    withdrawStatusResponse: UzPAYWithdrawStatusResponseDto,
    ip: string
  ): Promise<string> {
    // await this.testRepository.create({
    //   a: JSON.stringify(withdrawStatusResponse),
    // });

    if (!(await this.beforeWithdrawCallback(withdrawStatusResponse, ip))) {
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    const order = await this.withdrawPendingOrderService.findByOrderId(
      withdrawStatusResponse.orderid
    );

    if (!order) {
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    const sign = this.getWithdrawStatusResponseSign(
      withdrawStatusResponse,
      this.configService.get<string>('UZPAY_KEY')
    );

    if (sign.toUpperCase() !== withdrawStatusResponse.sign.toUpperCase()) {
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    if (
      `${order.amount}` !== `${numeral(withdrawStatusResponse.amount).value()}`
    ) {
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    order.status = this.getOrderStatusByWithdrawStatus(
      withdrawStatusResponse.status
    );

    order.providerOrderId = withdrawStatusResponse.oid;

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
      return UzPAYDepositCallbackResultEnum.FAILED;
    }

    return UzPAYDepositCallbackResultEnum.SUCCESS;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Order Status By Deposit Status
  ////////////////////////////////////////////////////////////////////////////////
  getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum {
    let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    const depositStatus = <UzPAYDepositStatusEnum>argDepositStatus;

    switch (depositStatus) {
      case UzPAYDepositStatusEnum.REVOKED:
      case UzPAYDepositStatusEnum.TIMEOUT:
        orderStatus = OrderStatusEnum.FAILED;
        break;
      case UzPAYDepositStatusEnum.PROCESSING:
        orderStatus = OrderStatusEnum.PENDING;
        break;
      case UzPAYDepositStatusEnum.VERIFIED:
        orderStatus = OrderStatusEnum.SUCCESS;
        break;
    }

    return orderStatus;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Order Status By Withdraw Status
  ////////////////////////////////////////////////////////////////////////////////
  getOrderStatusByWithdrawStatus(argWithdrawStatus: {}): OrderStatusEnum {
    let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    const withdrawStatus = <UzPAYWithdrawStatusEnum>argWithdrawStatus;

    switch (withdrawStatus) {
      case UzPAYWithdrawStatusEnum.REVOKED:
      case UzPAYWithdrawStatusEnum.TIMEOUT:
        orderStatus = OrderStatusEnum.FAILED;
        break;
      case UzPAYWithdrawStatusEnum.PROCESSING:
        orderStatus = OrderStatusEnum.PENDING;
        break;
      case UzPAYWithdrawStatusEnum.VERIFIED:
        orderStatus = OrderStatusEnum.SUCCESS;
        break;
    }

    return orderStatus;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Request Sign
  ////////////////////////////////////////////////////////////////////////////////
  getDepositRequestSign(
    params: UzPAYDepositRequestParams,
    key: string
  ): string {
    const txtSource =
      `amount=${params.amount}` +
      `&cate=${params.cate}` +
      `&from_bankflag=${params.from_bankflag}` +
      `&notify=${params.notify}` +
      `&orderid=${params.orderid}` +
      `&uid=${params.uid}` +
      `&userid=${params.userid}` +
      `&userip=${params.userip}` +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Withdraw Request Sign
  ////////////////////////////////////////////////////////////////////////////////
  getWithdrawRequestSign(params: UzPAYWithdrawRequestParams, key: string) {
    const txtSource =
      `amount=${params.amount}` +
      `&notify=${params.notify}` +
      `&orderid=${params.orderid}` +
      `&to_bankflag=${params.to_bankflag}` +
      `&to_cardname=${params.to_cardname}` +
      `&to_cardnumber=${params.to_cardnumber}` +
      `&to_city=${params.to_city}` +
      `&to_province=${params.to_province}` +
      `&uid=${params.uid}` +
      `&userid=${params.userid}` +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Status Sign
  ////////////////////////////////////////////////////////////////////////////////
  getDepositStatusResponseSign(
    depositStatus: UzPAYDepositStatusResponseDto,
    key: string
  ): string {
    const txtSource =
      `amount=${depositStatus.amount}` +
      `&created_time=${depositStatus.created_time}` +
      // (depositStatus.extend && depositStatus.extend.length > 0
      //   ? `&extended=${depositStatus.extend}`
      //   : '') +
      `&oid=${depositStatus.oid}` +
      `&orderid=${depositStatus.orderid}` +
      `&service=${depositStatus.service}` +
      `&status=${depositStatus.status}` +
      `&userid=${depositStatus.userid}` +
      // (depositStatus.verified_time !== undefined
      //   ? `&verified_time=${depositStatus.verified_time}`
      //   : '') +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Status Sign
  ////////////////////////////////////////////////////////////////////////////////
  getWithdrawStatusResponseSign(
    withdrawStatus: UzPAYWithdrawStatusResponseDto,
    key: string
  ): string {
    const txtSource =
      `amount=${withdrawStatus.amount}` +
      `&created_time=${withdrawStatus.created_time}` +
      // (withdrawStatus.extend && withdrawStatus.extend.length > 0
      //   ? `&extended=${withdrawStatus.extend}`
      //   : '') +
      `&oid=${withdrawStatus.oid}` +
      `&orderid=${withdrawStatus.orderid}` +
      `&service=${withdrawStatus.service}` +
      `&status=${withdrawStatus.status}` +
      `&userid=${withdrawStatus.userid}` +
      // (withdrawStatus.verified_time && withdrawStatus.verified_time.length > 0
      //   ? `&verified_time=${withdrawStatus.verified_time}`
      //   : '') +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Frozen Status By Channel DepositResult
  ////////////////////////////////////////////////////////////////////////////////
  protected getFrozenByChannelDepositResult(
    paymentProviderChannel: PaymentProviderChannelModel,
    depositRequest: PaymentProviderDepositRequestDto,
    depositResult: PaymentProviderChannelDepositResult
  ): boolean {
    const errorCode = numeral(depositResult.errorCode).value();
    if (errorCode === null) {
      return false;
    }

    const frozenCodes =
      this.configService.get<number[]>('uzpay.DEPOSIT_FROZEN_CODE') || [];

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
    const errorCode = numeral(withdrawResult.errorCode).value();
    if (errorCode === null) {
      return false;
    }

    const frozenCodes =
      this.configService.get<number[]>('uzpay.WITHDRAW_FROZEN_CODE') || [];

    return (
      frozenCodes.filter((frozenCode) => frozenCode === errorCode).length > 0
    );
  }
}
