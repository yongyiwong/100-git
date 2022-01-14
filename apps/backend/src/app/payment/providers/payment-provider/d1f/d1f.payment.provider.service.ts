import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as numeral from 'numeral';
import * as moment from 'moment';
import * as MobileDetect from 'mobile-detect';
import * as md5 from 'md5';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize/';
import { PaymentProviderEnum, OrderStatusEnum } from '@workspace/enums';
import { DepositOrderService } from '../../../order/deposit-order/deposit.order.service';
import { DepositPendingOrderService } from '../../../order/deposit-pending-order/deposit.pending.order.service';
import { WithdrawOrderService } from '../../../order/withdraw-order/withdraw.order.service';
import { WithdrawPendingOrderService } from '../../../order/withdraw-pending-order/withdraw.pending.order.service';
import {
  NoRecordException,
  NotSupportedBank,
  PaymentProviderException,
} from '../../../payment.exception';
import { PaymentProviderBankService } from '../../payment-provider-bank/payment.provider.bank.service';
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
import { D1FDepositRequestParams } from './dto/d1f.deposit.request.params';
import {
  D1FChannelDepositResult,
  D1FDepositResult,
} from './dto/d1f.deposit.result';
import { D1FDepositStatusResponseDto } from './dto/d1f.deposit.status.response.dto';
import { ChannelService } from '../../../channel/channel.service';
import { PaymentProviderChannelService } from '../../payment-provider-channel/payment.provider.channel.service';
import { DepositPendingOrderModel } from '../../../../models/deposit.pending.order.model';
import { PaymentProviderChannelModel } from '../../../../models/payment.provider.channel.model';
import { BetConstructService } from '../../../betContruct/betConstruct.service';
import { BankService } from '../../../bank/bank.service';
import {
  D1FChannelWithdrawResult,
  D1FWithdrawResult,
} from './dto/d1f.withdraw.result.params';
import { PaymentProviderWithdrawRequestDto } from '../payment.provider.withdraw.request.dto';
import { D1FWithdrawRequestParams } from './dto/d1f.withdraw.request.parapms';
import { D1FWithdrawStatusResponseDto } from './dto/d1f.withdraw.status.response';
import { InjectModel } from '@nestjs/sequelize';
import { TestModel } from '../../../../models/test.entity';
import { PaymentProviderCardService } from '../../payment-provider-card/payment.provider.card.service';
import { PaymentProviderEntityService } from '../../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderSharedService } from '../../payment-provider-shared/payment.provider.shared.service';
import { PaymentProviderUsdtProtoService } from '../../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { PaymentProviderUsdtProtocolModel } from '../../../../models/payment.provider.usdt.protocol.model';
import { OptionsService } from '../../../../options/options.service';
import { ErrorCodeEnum } from '../../../../error/enums/errorCodeEnum';

export enum D1FDepositStatusEnum {
  SUCCESS = 'SUCCESS',
}

export enum D1FDepositCallbackResultEnum {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum D1FWithdrawCallbackResultEnum {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Injectable()
export class D1FPaymentProviderService extends PaymentProviderService {
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
    return PaymentProviderEnum.D1F;
  }

  async isAvailable(): Promise<boolean> {
    return true;
    // const host = this.configService.get<string>('D1F_HOST');
    // const url_available = this.configService.get<string>('D1F_AVAILABLE_URL');
    // try {
    //   const response = await this.httpService
    //     .post(`https://${host}/${url_available}`, {})
    //     .toPromise();
    //   return response.status === 200;
    // } catch (error) {
    //   return false;
    // }
  }

  public depositErrorFactory(error): PaymentProviderDepositResult {
    return D1FDepositResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('d1f.DEFAULT_ERROR_CODE')
    );
  }

  public withdrawErrorFactory(error: any): PaymentProviderWithdrawResult {
    return D1FWithdrawResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('d1f.DEFAULT_ERROR_CODE')
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

    let depositResult: D1FChannelDepositResult;
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

    const channel = await this.channelService.findById(
      paymentProviderChannel.channelId
    );
    if (!channel) {
      return {
        depositResult: { ...channelDepositResultDefault, result: false, code: ErrorCodeEnum.DEPOSIT_PROVIDER_CHANNEL_NOT_FOUND },
        order
      };
    }

    const params = new D1FDepositRequestParams();
    params.customerno = this.configService.get<string>('D1F_CUSTOMERNO');
    params.channeltype = paymentProviderChannel.providerChannelName;
    params.customerbillno = order.orderId;
    params.orderamount = numeral(order.amount).format('0.00');
    params.customerbilltime = moment().format('YYYY-MM-DD HH:mm:ss');
    params.notifyurl =
      this.getBaseUrl(depositRequest.headers['host']) +
      this.configService.get<string>('d1f.DEPOSIT_SUCCESS_URL');
    params.returnurl = `https://${this.configService.get<string>(
      'FRONTEND_HOST'
    )}/`;
    params.ip = depositRequest.ip;

    if (channel.fromPaymentSystem.isBank && channel.toPaymentSystem.isBank) {
      const paymentProviderBank = await this.getPaymentProviderBank(
        depositRequest.bankCode
      );
      if (!paymentProviderBank) {
        throw new NotSupportedBank();
      }

      params.bankcode = paymentProviderBank.paymentProviderBankCode;
    }

    const user_agent = depositRequest.headers['user-agent'];
    const md = new MobileDetect(user_agent);
    params.devicetype = md.mobile() ? 'mobile' : 'pc';

    params.customeruser = order.userId;
    params.customerextinfo = '';

    const key = this.configService.get<string>('D1F_KEY');
    params.sign = this.getDepositRequestSign(params, key);

    const host = this.configService.get<string>('D1F_HOST');
    const url = this.configService.get<string>('D1F_DEPOSIT_URL');

    const response = await this.httpService
      .post(`https://${host}/${url}`, params)
      .toPromise();

    depositResult = D1FChannelDepositResult.responseFactory(
      response,
      this.getPaymentProviderName(),
      this.configService.get<number>('d1f.DEFAULT_ERROR_CODE')
    );
    if (!depositResult) {
      return null;
    }

    depositResult.channelRequestTime = moment()
      .utcOffset('+08:00')
      .format('YYYY-MM-DD HH:mm:ss');
    depositResult.channelRequestJson = JSON.stringify(params);
    depositResult.channelResponseJson = JSON.stringify(response.data);

    if( !depositResult.result ){
      depositResult.code = ErrorCodeEnum.DEPOSIT_PROVIDER_FAILED;
    }

    channelDepositResultBundle.depositResult = depositResult;
    channelDepositResultBundle.order = order;

    return channelDepositResultBundle;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit Callback
  ////////////////////////////////////////////////////////////////////////////////
  async depositCallback(
    depositStatusResponse: D1FDepositStatusResponseDto,
    ip: string
  ): Promise<string> {
    if (!(await this.beforeDepositCallback(depositStatusResponse, ip))) {
      return D1FDepositCallbackResultEnum.FAILED;
    }

    const key = this.configService.get<string>('D1F_KEY');
    const sign = this.getPaymentStatusResponseSign(depositStatusResponse, key);

    if (sign !== depositStatusResponse.sign) {
      return D1FDepositCallbackResultEnum.FAILED;
    }

    const order = await this.depositPendingOrderService.findByOrderId(
      depositStatusResponse.customerbillno
    );
    if (!order) {
      return D1FDepositCallbackResultEnum.FAILED;
    }

    if (
      numeral(depositStatusResponse.orderamount).value() !==
      numeral(order.amount).value()
    ) {
      return D1FDepositCallbackResultEnum.FAILED;
    }

    order.status = this.getOrderStatusByDepositStatus(
      depositStatusResponse.paystatus
    );

    order.providerOrderId = depositStatusResponse.orderno;

    if (order.status === OrderStatusEnum.SUCCESS) {
      const bcOrder = await this.depositBCAfterDepositCallback(order);
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.updateOrderAfterDepositCallback(order, transaction);
      });
    } catch (error) {
      return D1FDepositCallbackResultEnum.FAILED;
    }

    return D1FDepositCallbackResultEnum.SUCCESS;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Implement Withdraw Procedure
  ////////////////////////////////////////////////////////////////////////////////
  public async withdrawByPaymentProviderChannel(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelWithdrawResultBundle> {
    const withdrawProcResult = new PaymentProviderChannelWithdrawResultBundle();

    let withdrawResult: D1FChannelWithdrawResult;

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

    const params = new D1FWithdrawRequestParams();

    params.customerNo = this.configService.get<string>('D1F_CUSTOMERNO');
    params.customerBillNo = order.orderId;
    params.orderAmount = withdrawRequest.amount;
    params.bankAccountName = withdrawRequest.bankAccountName;
    params.bankAccountNo = withdrawRequest.bankAccountNumber;
    params.bankBranchName =
      !withdrawRequest.branch || !withdrawRequest.branch.trim()
        ? paymentProviderBank.paymentProviderBankName
        : withdrawRequest.branch;
    params.bankCode = paymentProviderBank.paymentProviderBankCode;
    params.city = withdrawRequest.city;
    params.province = withdrawRequest.province;

    params.sign = this.getWithdrawRequestSign(
      params,
      this.configService.get<string>('D1F_KEY')
    );

    const host = this.configService.get<string>('D1F_HOST');
    const url = this.configService.get<string>('D1F_WITHDRAWAL_URL');

    const response = await this.httpService
      .post(`http://${host}/${url}`, params)
      .toPromise();

    // console.log(response.data);

    withdrawResult = D1FChannelWithdrawResult.responseFactory(
      response,
      this.getPaymentProviderName()
    );

    if( !withdrawResult.result ){
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
    withdrawStatusResponse: D1FWithdrawStatusResponseDto,
    ip: string
  ): Promise<string> {
    await this.testRepository.create({
      a: JSON.stringify(withdrawStatusResponse),
    });

    if (!(await this.beforeWithdrawCallback(withdrawStatusResponse, ip))) {
      return D1FWithdrawCallbackResultEnum.FAILED;
    }

    const key = this.configService.get<string>('D1F_KEY');
    const sign = this.getPaymentStatusResponseSign(withdrawStatusResponse, key);

    if (sign.toUpperCase() !== withdrawStatusResponse.sign.toUpperCase()) {
      return D1FWithdrawCallbackResultEnum.FAILED;
    }

    const order = await this.withdrawPendingOrderService.findByOrderId(
      withdrawStatusResponse.customerbillno
    );
    if (!order) {
      return D1FWithdrawCallbackResultEnum.FAILED;
    }

    if (
      numeral(withdrawStatusResponse.orderamount).value() !==
      numeral(order.amount).value()
    ) {
      return D1FWithdrawCallbackResultEnum.FAILED;
    }

    order.status = this.getOrderStatusByWithdrawStatus(
      withdrawStatusResponse.paystatus
    );

    order.providerOrderId = withdrawStatusResponse.orderno;

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
      return D1FWithdrawCallbackResultEnum.FAILED;
    }

    return D1FWithdrawCallbackResultEnum.SUCCESS;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Request Sign
  ////////////////////////////////////////////////////////////////////////////////
  getDepositRequestSign(params: D1FDepositRequestParams, key: string): string {
    const txtSource =
      `${params.bankcode ? 'bankcode=' + params.bankcode + '&' : ''}` +
      `channeltype=${params.channeltype}` +
      `&customerbillno=${params.customerbillno}` +
      `&customerbilltime=${params.customerbilltime}` +
      `&customerno=${params.customerno}` +
      `&customeruser=${params.customeruser}` +
      `&devicetype=${params.devicetype}` +
      `&ip=${params.ip}` +
      `&notifyurl=${params.notifyurl}` +
      `&orderamount=${params.orderamount}` +
      `&returnurl=${params.returnurl}` +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);
    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Withdraw Request Sign
  ////////////////////////////////////////////////////////////////////////////////
  getWithdrawRequestSign(params: D1FWithdrawRequestParams, key: string) {
    const txtSource =
      `bankAccountName=${params.bankAccountName}` +
      `&bankAccountNo=${params.bankAccountNo}` +
      (params.bankBranchName
        ? `&bankBranchName=${params.bankBranchName}`
        : '') +
      `&bankCode=${params.bankCode}` +
      `&city=${params.city}` +
      `&customerBillNo=${params.customerBillNo}` +
      `&customerNo=${params.customerNo}` +
      `&orderAmount=${params.orderAmount}` +
      `&province=${params.province}` +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Payment Status Sign
  ////////////////////////////////////////////////////////////////////////////////
  getPaymentStatusResponseSign(
    paymentStatus: D1FDepositStatusResponseDto,
    key: string
  ): string {
    const txtSource =
      `customerbillno=${paymentStatus.customerbillno}` +
      `&customerbilltime=${paymentStatus.customerbilltime}` +
      (paymentStatus.customerextinfo.length > 0
        ? `&customerextinfo=${paymentStatus.customerextinfo}`
        : '') +
      `&customerno=${paymentStatus.customerno}` +
      `&orderamount=${paymentStatus.orderamount}` +
      `&orderno=${paymentStatus.orderno}` +
      `&paystatus=${paymentStatus.paystatus}` +
      (paymentStatus.preorderamount.length > 0
        ? `&preorderamount=${paymentStatus.preorderamount}`
        : '') +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);
    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get OrderStatus By DepositStatus
  ////////////////////////////////////////////////////////////////////////////////
  getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum {
    let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    const depositStatus = <D1FDepositStatusEnum>argDepositStatus;

    switch (depositStatus) {
      case D1FDepositStatusEnum.SUCCESS:
        orderStatus = OrderStatusEnum.SUCCESS;
        break;
      default:
        orderStatus = OrderStatusEnum.FAILED;
        break;
    }
    return orderStatus;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get OrderStatus By WithdrawStatus
  ////////////////////////////////////////////////////////////////////////////////
  getOrderStatusByWithdrawStatus(argWithdrawStatus: {}): OrderStatusEnum {
    const orderStatus = OrderStatusEnum.NEW;
    const withdrawStatus = <D1FDepositStatusEnum>argWithdrawStatus;

    switch (withdrawStatus) {
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
      this.configService.get<number[]>('d1f.DEPOSIT_FROZEN_CODE') || [];

    return (
      frozenCodes.filter((frozenCode) => frozenCode === errorCode).length > 0
    );
  }
}
