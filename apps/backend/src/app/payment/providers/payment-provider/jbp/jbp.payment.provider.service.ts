import { PaymentProviderEnum, OrderStatusEnum } from '@workspace/enums';
import { PaymentProviderChannelModel } from '../../../../models/payment.provider.channel.model';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { PaymentProviderDepositRequestDto } from '../payment.provider.deposit.request.dto';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
} from '../payment.provider.deposit.result';
import {
  PaymentProviderChannelDepositResultBundle,
  PaymentProviderChannelWithdrawResultBundle,
  PaymentProviderService,
} from '../payment.provider.service';
import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../payment.provider.withdraw.result';
import {
  JBPDepositStatusEnum,
  JBPDepositStatusResponseDto,
} from './dto/jbp.deposit.status.response.dto';
import {
  JBPWithdrawStatusEnum,
  JBPWithdrawStatusResponseDto,
} from './dto/jbp.withdraw.status.response.dto';
import {
  JBPChannelDepositResult,
  JBPDepositResult,
} from './dto/jbp.deposit.result';
import { DepositPendingOrderModel } from '../../../../models/deposit.pending.order.model';
import { JBPDepositRequestParams } from './dto/jbp.deposit.request.params';
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BetConstructService } from '../../../betContruct/betConstruct.service';
import { ChannelService } from '../../../channel/channel.service';
import { DepositOrderService } from '../../../order/deposit-order/deposit.order.service';
import { DepositPendingOrderService } from '../../../order/deposit-pending-order/deposit.pending.order.service';
import { WithdrawOrderService } from '../../../order/withdraw-order/withdraw.order.service';
import { WithdrawPendingOrderService } from '../../../order/withdraw-pending-order/withdraw.pending.order.service';
import { PaymentProviderBankService } from '../../payment-provider-bank/payment.provider.bank.service';
import { PaymentProviderChannelService } from '../../payment-provider-channel/payment.provider.channel.service';
import * as qs from 'qs';
import * as moment from 'moment';
import * as numeral from 'numeral';
import * as md5 from 'md5';
import {
  JBPChannelWithdrawResult,
  JBPWithdrawResult,
} from './dto/jbp.withdraw.result';
import {
  NotSupportedBank,
  NotSupportedPhoneNumber,
  PaymentProviderException,
} from '../../../payment.exception';
import { JBPWithdrawRequestParams } from './dto/jbp.withdraw.request.params';
import { BankModel } from '../../../../models/bank.entity';
import { JBPGetPriceResult } from './interface/jbp.get.price.result.interface';

import { TestModel } from '../../../../models/test.entity';
import { PaymentProviderWithdrawRequestDto } from '../payment.provider.withdraw.request.dto';
import { BankService } from '../../../bank/bank.service';
import { PaymentProviderCardService } from '../../payment-provider-card/payment.provider.card.service';
import { PaymentProviderEntityService } from '../../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderSharedService } from '../../payment-provider-shared/payment.provider.shared.service';
import { PaymentProviderUsdtProtoService } from '../../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { PaymentProviderUsdtProtocolModel } from '../../../../models/payment.provider.usdt.protocol.model';
import * as fnv1a from '@sindresorhus/fnv1a';
import { OptionsService } from '../../../../options/options.service';
import { ErrorCodeEnum } from '../../../../error/enums/errorCodeEnum';

@Injectable()
export class JBPPaymentProviderService extends PaymentProviderService {
  constructor(
    @InjectModel(BankModel)
    private bankRepository: typeof BankModel,

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
    private httpService: HttpService,

    @InjectModel(TestModel)
    private testRepository: typeof TestModel
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
    return PaymentProviderEnum.JBP;
  }

  async isAvailable(): Promise<boolean> {
    return true;
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

    // if (/* !depositRequest.userName || */ !depositRequest.phoneNumber) {
    //   return null;
    // }
    const channelDepositResultDefault = { providerName: this.getPaymentProviderName() };

    const areaCode = '86';
    const phoneNumber = `${fnv1a(
      depositRequest.userId
    )}${depositRequest.userId.substr(0, 1)}`;

    let depositResult: JBPChannelDepositResult;
    let order: DepositPendingOrderModel;

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

    const params = new JBPDepositRequestParams();

    params.companyId = this.configService.get<string>('JBP_COMPANYID');
    params.kyc = '2';
    //params.username = depositRequest.userName;
    params.areaCode = areaCode; // depositRequest.countryCallingCode;
    params.phone = phoneNumber; // depositRequest.phoneNumber;
    params.orderType = 1;
    params.companyOrderNum = order.orderId;
    params.coinSign = 'USDT';
    params.payCoinSign = 'cny';
    params.orderPayChannel = numeral(
      paymentProviderChannel.providerChannelName
    ).value();
    params.orderTime = moment().format('x');
    params.total = order.amount;
    params.syncUrl = `https://${this.configService.get<string>(
      'FRONTEND_HOST'
    )}/`;
    params.asyncUrl =
      this.getBaseUrl(depositRequest.headers['host']) +
      this.configService.get<string>('jbp.DEPOSIT_SUCCESS_URL');
    params.sign = this.getDepositRequestSign(
      params,
      this.configService.get<string>('JBP_SECRETKEY')
    );

    const host = this.configService.get<string>('JBP_HOST');
    const url = this.configService.get<string>('JBP_DEPOSIT_URL');

    //console.log(params);

    const response = await this.httpService
      .post(`https://${host}/${url}`, params)
      .toPromise();

    //console.log(response.data);

    depositResult = JBPChannelDepositResult.responseFactory(
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
  /// Withdraw Procedure
  ////////////////////////////////////////////////////////////////////////////////
  public async withdrawByPaymentProviderChannel(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelWithdrawResultBundle> {
    const withdrawProcResult = new PaymentProviderChannelWithdrawResultBundle();

    let withdrawResult: JBPChannelWithdrawResult;

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

    const areaCode = '86';
    const phoneNumber = `${fnv1a(
      withdrawRequest.userId
    )}${withdrawRequest.userId.substr(0, 1)}`;

    const params = new JBPWithdrawRequestParams();

    params.companyId = this.configService.get<string>('JBP_COMPANYID');
    params.kyc = '2';
    params.username =
      withdrawRequest.userName || withdrawRequest.bankAccountName;
    params.areaCode = areaCode; // withdrawRequest.countryCallingCode || '86';
    params.phone = phoneNumber; //withdrawRequest.phoneNumber;
    params.orderType = 2;
    params.companyOrderNum = order.orderId;
    params.coinSign = 'USDT';
    params.payCoinSign = 'cny';
    params.orderPayChannel = numeral(
      paymentProviderChannel.providerChannelName
    ).value();
    params.orderTime = moment().format('x');

    const price = await this.getPrice();
    if (!price || !price.success || !price.data || !price.data.sellPrice) {
      throw new PaymentProviderException();
    }
    params.coinAmount = numeral(
      withdrawRequest.amount / price.data.sellPrice
    ).format('0.00');

    params.syncUrl = `https://${this.configService.get<string>(
      'FRONTEND_HOST'
    )}/`;
    params.asyncUrl =
      this.getBaseUrl(withdrawRequest.headers['host']) +
      this.configService.get<string>('jbp.WITHDRAWAL_SUCCESS_URL');
    params.payCardBank = paymentProviderBank.paymentProviderBankName;
    params.payCardNo = withdrawRequest.bankAccountNumber;
    params.sign = this.getWithdrawRequestSign(
      params,
      this.configService.get<string>('JBP_SECRETKEY')
    );

    const host = this.configService.get<string>('JBP_HOST');
    const url = this.configService.get<string>('JBP_WITHDRAW_URL');

    //console.log(params);

    const response = await this.httpService
      .post(`https://${host}/${url}`, params)
      .toPromise();

    //console.log(response.data);

    withdrawResult = JBPChannelWithdrawResult.responseFactory(
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

  public depositErrorFactory(error: any): PaymentProviderDepositResult {
    return JBPDepositResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('jbp.DEFAULT_ERROR_CODE')
    );
  }

  public withdrawErrorFactory(error: any): PaymentProviderWithdrawResult {
    return JBPWithdrawResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('jbp.DEFAULT_ERROR_CODE')
    );
  }

  getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum {
    let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    const depositStatus = <JBPDepositStatusEnum>argDepositStatus;

    switch (depositStatus) {
      case JBPDepositStatusEnum.SUCCESS:
        orderStatus = OrderStatusEnum.SUCCESS;
        break;
      case JBPDepositStatusEnum.FAILED:
        orderStatus = OrderStatusEnum.FAILED;
        break;
    }

    return orderStatus;
  }

  getOrderStatusByWithdrawStatus(argWithdrawStatus: {}): OrderStatusEnum {
    let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    const depositStatus = <JBPWithdrawStatusEnum>argWithdrawStatus;

    switch (depositStatus) {
      case JBPWithdrawStatusEnum.SUCCESS:
        orderStatus = OrderStatusEnum.SUCCESS;
        break;
      case JBPWithdrawStatusEnum.FAILED:
        orderStatus = OrderStatusEnum.FAILED;
        break;
    }

    return orderStatus;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit Callback
  ////////////////////////////////////////////////////////////////////////////////
  async depositCallback(
    depositStatusResponse: JBPDepositStatusResponseDto,
    ip: string
  ) {
    await this.testRepository.create({
      a: JSON.stringify({ ip, res: JSON.stringify(depositStatusResponse) }),
    });

    const response = {
      code: 0,
      msg: '',
      data: {
        otcOrderNum: null,
        companyOrderNum: null,
      },
      success: false,
    };

    if (!(await this.beforeDepositCallback(depositStatusResponse, ip))) {
      response.code = 505;
      response.msg = 'Invalid Request';
      return response;
    }

    const order = await this.depositPendingOrderService.findByOrderId(
      depositStatusResponse.companyOrderNum
    );

    if (!order) {
      const orderAlready = await this.depositOrderService.findByOrderId(
        depositStatusResponse.companyOrderNum
      );

      if (orderAlready) {
        response.data.companyOrderNum = orderAlready.orderId;
        response.data.otcOrderNum = orderAlready.providerOrderId;

        response.code = 200;
        response.msg = 'success';
        response.success = true;
        return response;
      }

      response.code = 501;
      response.msg = 'companyOrderNum is invalid';
      return response;
    }

    response.data.companyOrderNum = depositStatusResponse.companyOrderNum;

    // if (`${order.providerOrderId}` !== `${depositStatusResponse.otcOrderNum}`) {
    //   response.code = 502;
    //   response.msg = 'otcOrderNum is invalid';
    //   return response;
    // }
    response.data.otcOrderNum = depositStatusResponse.otcOrderNum;
    order.amount = numeral(depositStatusResponse.total).value();

    const sign = this.getDepositStatusResponseSign(
      depositStatusResponse,
      this.configService.get<string>('JBP_SECRETKEY')
    );

    if (sign.toUpperCase() !== depositStatusResponse.sign.toUpperCase()) {
      response.code = 503;
      response.msg = 'sign is invalid';
      return response;
    }

    order.status = this.getOrderStatusByDepositStatus(
      depositStatusResponse.tradeStatus
    );
    order.providerOrderId = depositStatusResponse.otcOrderNum;

    if (order.status === OrderStatusEnum.SUCCESS) {
      const bcOrder = await this.depositBCAfterDepositCallback(order);
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.updateOrderAfterDepositCallback(order, transaction);
      });
    } catch (error) {
      response.code = 504;
      response.msg = 'unknown error';
      return response;
    }

    response.code = 200;
    response.msg = 'success';
    response.success = true;
    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw Callback
  ////////////////////////////////////////////////////////////////////////////////
  async withdrawCallback(
    withdrawStatusResponse: JBPWithdrawStatusResponseDto,
    ip: string
  ) {
    await this.testRepository.create({
      a: JSON.stringify({ ip, res: JSON.stringify(withdrawStatusResponse) }),
    });

    const response = {
      code: 0,
      msg: '',
      data: {
        otcOrderNum: null,
        companyOrderNum: null,
      },
      success: false,
    };

    if (!(await this.beforeWithdrawCallback(withdrawStatusResponse, ip))) {
      response.code = 506;
      response.msg = 'Invalid Request';
      return response;
    }

    const order = await this.withdrawPendingOrderService.findByOrderId(
      withdrawStatusResponse.companyOrderNum
    );

    if (!order) {
      const orderAlready = await this.withdrawOrderService.findByOrderId(
        withdrawStatusResponse.companyOrderNum
      );

      if (orderAlready) {
        response.data.companyOrderNum = orderAlready.orderId;
        response.data.otcOrderNum = orderAlready.providerOrderId;

        response.code = 200;
        response.msg = 'success';
        response.success = true;
        return response;
      }

      response.code = 501;
      response.msg = 'companyOrderNum is invalid';
      return response;
    }

    response.data.companyOrderNum = withdrawStatusResponse.companyOrderNum;

    // if (
    //   `${order.providerOrderId}` !== `${withdrawStatusResponse.otcOrderNum}`
    // ) {
    //   response.code = 502;
    //   response.msg = 'otcOrderNum is invalid';
    //   return response;
    // }
    response.data.otcOrderNum = withdrawStatusResponse.otcOrderNum;

    const sign = this.getWithdrawStatusResponseSign(
      withdrawStatusResponse,
      this.configService.get<string>('JBP_SECRETKEY')
    );

    if (sign.toUpperCase() !== withdrawStatusResponse.sign.toUpperCase()) {
      response.code = 503;
      response.msg = 'sign is invalid';
      return response;
    }

    order.status = this.getOrderStatusByDepositStatus(
      withdrawStatusResponse.tradeStatus
    );
    order.providerOrderId = withdrawStatusResponse.otcOrderNum;

    if (order.status === OrderStatusEnum.SUCCESS) {
      await this.withdrawBCAfterWithdrawCallback(order);
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.updateOrderAfterWithdrawCallback(order, transaction);
      });
    } catch (error) {
      response.code = 504;
      response.msg = 'unknown error';
      return response;
    }

    response.code = 200;
    response.msg = 'success';
    response.success = true;
    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Request Sign
  ////////////////////////////////////////////////////////////////////////////////
  getDepositRequestSign(params: JBPDepositRequestParams, key: string): string {
    const txtSource =
      `areaCode=${params.areaCode}` +
      `&asyncUrl=${params.asyncUrl}` +
      `&coinSign=${params.coinSign}` +
      `&companyId=${params.companyId}` +
      `&companyOrderNum=${params.companyOrderNum}` +
      `&kyc=${params.kyc}` +
      `&orderPayChannel=${params.orderPayChannel}` +
      `&orderTime=${params.orderTime}` +
      `&orderType=${params.orderType}` +
      `&payCoinSign=${params.payCoinSign}` +
      `&phone=${params.phone}` +
      `&secretKey=${key}` +
      `&syncUrl=${params.syncUrl}` +
      `&total=${params.total}`; //+
    //`&username=${params.username}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Withdraw Request Sign
  ////////////////////////////////////////////////////////////////////////////////
  getWithdrawRequestSign(
    params: JBPWithdrawRequestParams,
    key: string
  ): string {
    const txtSource =
      `areaCode=${params.areaCode}` +
      `&asyncUrl=${params.asyncUrl}` +
      `&coinAmount=${params.coinAmount}` +
      `&coinSign=${params.coinSign}` +
      `&companyId=${params.companyId}` +
      `&companyOrderNum=${params.companyOrderNum}` +
      `&kyc=${params.kyc}` +
      `&orderPayChannel=${params.orderPayChannel}` +
      `&orderTime=${params.orderTime}` +
      `&orderType=${params.orderType}` +
      `&payCardBank=${params.payCardBank}` +
      `&payCardNo=${params.payCardNo}` +
      `&payCoinSign=${params.payCoinSign}` +
      `&phone=${params.phone}` +
      `&secretKey=${key}` +
      `&syncUrl=${params.syncUrl}` +
      //`&total=${params.total}` +
      `&username=${params.username}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Status Sign
  ////////////////////////////////////////////////////////////////////////////////
  getDepositStatusResponseSign(
    paymentStatus: JBPDepositStatusResponseDto,
    key: string
  ): string {
    const txtSource =
      `coinAmount=${paymentStatus.coinAmount}` +
      `&coinSign=${paymentStatus.coinSign}` +
      `&companyOrderNum=${paymentStatus.companyOrderNum}` +
      `&orderType=${paymentStatus.orderType}` +
      `&otcOrderNum=${paymentStatus.otcOrderNum}` +
      `&secretKey=${key}` +
      `&successAmount=${paymentStatus.successAmount}` +
      `&total=${paymentStatus.total}` +
      `&tradeOrderTime=${paymentStatus.tradeOrderTime}` +
      `&tradeStatus=${paymentStatus.tradeStatus}` +
      `&unitPrice=${paymentStatus.unitPrice}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Status Sign
  ////////////////////////////////////////////////////////////////////////////////
  getWithdrawStatusResponseSign(
    paymentStatus: JBPWithdrawStatusResponseDto,
    key: string
  ): string {
    const txtSource =
      `coinAmount=${paymentStatus.coinAmount}` +
      `&coinSign=${paymentStatus.coinSign}` +
      `&companyOrderNum=${paymentStatus.companyOrderNum}` +
      `&orderType=${paymentStatus.orderType}` +
      `&otcOrderNum=${paymentStatus.otcOrderNum}` +
      `&secretKey=${key}` +
      `&successAmount=${paymentStatus.successAmount}` +
      `&total=${paymentStatus.total}` +
      `&tradeOrderTime=${paymentStatus.tradeOrderTime}` +
      `&tradeStatus=${paymentStatus.tradeStatus}` +
      `&unitPrice=${paymentStatus.unitPrice}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  async getPrice(): Promise<JBPGetPriceResult> {
    const host = this.configService.get<string>('JBP_HOST');
    const url = this.configService.get<string>('JBP_GET_PRICE');

    const response = await this.httpService
      .get(`https://${host}/${url}`, { params: { coinType: 'cnyusdt' } })
      .toPromise();
    return response.data;
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
      this.configService.get<number[]>('jbp.DEPOSIT_FROZEN_CODE') || [];

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
      this.configService.get<number[]>('jbp.WITHDRAW_FROZEN_CODE') || [];

    return (
      frozenCodes.filter((frozenCode) => frozenCode === errorCode).length > 0
    );
  }
}
