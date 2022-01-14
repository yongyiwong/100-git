import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as md5 from 'md5';
import * as numeral from 'numeral';
import * as Locale from '../../../../locale';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  DepositChannelEnum,
  OrderStatusEnum,
  PaymentProviderEnum,
  PaymentSystemEnum,
} from '@workspace/enums';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DepositOrderService } from '../../../order/deposit-order/deposit.order.service';
import { DepositPendingOrderService } from '../../../order/deposit-pending-order/deposit.pending.order.service';
import { WithdrawOrderService } from '../../../order/withdraw-order/withdraw.order.service';
import { WithdrawPendingOrderService } from '../../../order/withdraw-pending-order/withdraw.pending.order.service';
import {
  PaymentProviderException,
  NotSupportedBank,
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
import { MSZFDepositRequestParams } from './dto/mszf.deposit.request.params';
import {
  MSZFChannelDepositResult,
  MSZFDepositResult,
  MSZFDepositResultData,
} from './dto/mszf.deposit.result';
import { MSZFDepositStatusResponseDto } from './dto/mszf.deposit.status.response.dto';
import { MSZFWithdrawRequestParams } from './dto/mszf.withdraw.request.params';
import {
  MSZFChannelWithdrawResult,
  MSZFChannelWithdrawResultData,
  MSZFWithdrawResult,
} from './dto/mszf.withdraw.result';
import { MSZFWithdrawStatusResponseDto } from './dto/mszf.withdraw.status.response.dto';
import { ChannelService } from '../../../channel/channel.service';
import { PaymentProviderChannelService } from '../../payment-provider-channel/payment.provider.channel.service';
import { ChannelModel } from '../../../../models/channel.model';
import { DepositPendingOrderModel } from '../../../../models/deposit.pending.order.model';
import { PaymentProviderChannelModel } from '../../../../models/payment.provider.channel.model';
import { WithdrawPendingOrderModel } from '../../../../models/withdraw.pending.order.model';
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

export enum MSZFPaymentStatusEnum {
  PENDING = 'Pending',
  READYTOPAY = 'ReadyToPay',
  SUCCESS = 'Success',
  FAILED = 'Failed',
}

export enum MSZFDepositCallbackResultEnum {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum MSZFWithdrawCallbackResultEnum {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum MSZFChannelEnum {
  WECHAT = 'WECHAT',
  WECHATREWARD = 'WECHATREWARD',
  ALIPAY = 'ALIPAY',
  ALIPAYH5 = 'ALIPAYH5',
  ALIPAYTOBANK = 'ALIPAYTOBANK',
  ALIPAYTOALIPAY = 'ALIPAYTOALIPAY',
  BANKTOBANK = 'BANKTOBANK',
}

@Injectable()
export class MSZFPaymentProviderService extends PaymentProviderService {
  clientIP: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
    return PaymentProviderEnum.MSZF;
  }

  public depositErrorFactory(error): PaymentProviderDepositResult {
    return MSZFDepositResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('mszf.DEFAULT_ERROR_CODE')
    );
  }

  public withdrawErrorFactory(error): PaymentProviderWithdrawResult {
    return MSZFWithdrawResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('mszf.DEFAULT_ERROR_CODE')
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

    let depositResult: MSZFChannelDepositResult;
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

    const paymentSystemId = PaymentSystemEnum[depositRequest.paymentSystem];
    let usdtExchangeRate: number;
    if (paymentSystemId === PaymentSystemEnum.USDT) {
      const optItem = await this.optionsService.findOne({
        where: { optName: 'huobiExchangeData' },
      });
      if (!optItem) {
        return {
          depositResult: { ...channelDepositResultDefault, result: false, code: ErrorCodeEnum.DEPOSIT_PROVIDER_USDT_RATE_NOT_FOUND },
          order
        };
      }

      const huobiExchangeData = <
        { data_time: string; name: string; rate: number; time: string }
        >JSON.parse(optItem.optValue.toString('utf8'));

      usdtExchangeRate = huobiExchangeData.rate;
      order.usdtExchangeRate = usdtExchangeRate;
    }

    const params = new MSZFDepositRequestParams();

    params.amount = numeral(
      paymentSystemId === PaymentSystemEnum.USDT
        ? order.amount / usdtExchangeRate
        : order.amount
    ).format('0.00');
    params.currencyCode =
      paymentSystemId === PaymentSystemEnum.USDT
        ? paymentProviderUsdtProto.providerUsdtProtoCurrency
        : 'CNY';
    params.merchantCode = this.getDepositMerchantCode(channel);
    params.merchantOrderId = order.orderId;
    params.mp = 'mp';
    params.merchantMemberId = order.userId;
    params.merchantMemberIp = depositRequest.ip;
    params.paymentTypeCode = paymentProviderChannel.providerChannelName;
    params.successUrl =
      this.getBaseUrl(depositRequest.headers['host']) +
      this.configService.get<string>('mszf.DEPOSIT_SUCCESS_URL');
    this.logger.debug('MSZF desposit success URL is ' + params.successUrl);
    params.sign = this.getDepositRequestSign(params, channel);

    const mszfHost = this.configService.get<string>('MSZF_HOST');
    const url_deposit = this.configService.get<string>('MSZF_DEPOSIT_URL');

    const response = await this.httpService
      .post(`https://${mszfHost}/${url_deposit}`, params)
      .toPromise();

    depositResult = MSZFChannelDepositResult.responseFactory(
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

    if (depositResult.result) {
      const responseSign: string = this.getDepositResponseSign(
        depositResult,
        channel
      );
      const data: MSZFDepositResultData = <MSZFDepositResultData>(
        depositResult.data
      );
      if (responseSign !== data.sign) {
        depositResult.result = false;

        depositResult.errorCode = this.configService.get<string>(
          'mszf.SIGN_ERROR_CODE'
        );
        depositResult.errorMessage = Locale.MSG_MSZF_RESPONSE_SIGNERROR;
        depositResult.data = null;
      }
    } else {
      depositResult.code = ErrorCodeEnum.DEPOSIT_PROVIDER_FAILED;
    }

    channelDepositResultBundle.depositResult = depositResult;
    channelDepositResultBundle.order = order;

    return channelDepositResultBundle;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// DepositCallback
  ////////////////////////////////////////////////////////////////////////////////
  async depositCallback(
    depositStatusResponse: MSZFDepositStatusResponseDto,
    ip: string
  ): Promise<string> {
    if (!(await this.beforeDepositCallback(depositStatusResponse, ip))) {
      return MSZFDepositCallbackResultEnum.FAILED;
    }

    const order = await this.depositPendingOrderService.findByOrderId(
      depositStatusResponse.merchantOrderId
    );

    if (!order) {
      return MSZFDepositCallbackResultEnum.FAILED;
    }

    const providerChannelName = depositStatusResponse.paymentTypeCode;

    const channelId = await this.paymentProviderChannelService.getChannelIdByProviderChannelName(
      this.getPaymentProviderId(),
      providerChannelName
    );

    if (!channelId) {
      return MSZFDepositCallbackResultEnum.FAILED;
    }

    const channel = await this.channelService.findById(channelId);

    if (!channel) {
      return MSZFDepositCallbackResultEnum.FAILED;
    }

    const paymentStatusSign: string = this.getDepositStatusResponseSign(
      depositStatusResponse,
      channel
    );

    if (
      paymentStatusSign.toUpperCase() !==
      depositStatusResponse.sign.toUpperCase()
    ) {
      console.log(paymentStatusSign);
      return MSZFDepositCallbackResultEnum.FAILED;
    }

    order.status = this.getOrderStatusByDepositStatus(
      depositStatusResponse.status
    );

    if (order.status === OrderStatusEnum.SUCCESS) {
      const bcOrder = await this.depositBCAfterDepositCallback(order);
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.updateOrderAfterDepositCallback(order, transaction);
      });
    } catch (error) {
      console.log(error);
      return MSZFDepositCallbackResultEnum.FAILED;
    }

    return MSZFDepositCallbackResultEnum.SUCCESS;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Implement Withdraw Procedure
  ////////////////////////////////////////////////////////////////////////////////
  public async withdrawByPaymentProviderChannel(
    withdrawRequestDto: PaymentProviderWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelWithdrawResultBundle> {
    const withdrawProcResult = new PaymentProviderChannelWithdrawResultBundle();

    let withdrawResult: MSZFChannelWithdrawResult;

    const channelWithdrawResultDefault = { providerName: this.getPaymentProviderName() };

    const order = await this.createOrderBeforeWithdraw(
      withdrawRequestDto,
      transaction
    );
    if (!order) {
      return {
        withdrawResult: { ...channelWithdrawResultDefault, result: false, code: ErrorCodeEnum.WITHDRAW_PROVIDER_ORDER_NOT_CREATED },
        order: null
      };
    }

    const paymentProviderBank = await this.getPaymentProviderBank(
      withdrawRequestDto.bankCode
    );
    if (!paymentProviderBank) {
      return {
        withdrawResult: { ...channelWithdrawResultDefault, result: false, code: ErrorCodeEnum.DEPOSIT_PROVIDER_ORDER_NOT_CREATED },
        order
      };
    }

    const params = new MSZFWithdrawRequestParams();

    params.amount = numeral(order.amount).format('0.00');
    params.bankAccountName = withdrawRequestDto.bankAccountName;
    params.bankAccountNumber = withdrawRequestDto.bankAccountNumber;
    params.bankCode = paymentProviderBank.paymentProviderBankCode;

    if (!withdrawRequestDto.branch || withdrawRequestDto.branch.trim() === '') {
      params.branch = paymentProviderBank.paymentProviderBankName;
    } else {
      params.branch = withdrawRequestDto.branch;
    }

    params.city = withdrawRequestDto.city;
    params.currencyCode = 'CNY';
    params.merchantCode = this.getWithdrawalMerchantCode();
    params.merchantOrderId = order.orderId;
    params.mp = 'mp';
    params.province = withdrawRequestDto.province;
    params.successUrl =
      this.getBaseUrl(withdrawRequestDto.headers['host']) +
      this.configService.get<string>('mszf.WITHDRAWAL_SUCCESS_URL');

    params.sign = this.getWithdrawRequestSign(params);

    const mszfHost = this.configService.get<string>('MSZF_HOST');
    const url_withdraw = this.configService.get<string>('MSZF_WITHDRAWAL_URL');

    const response = await this.httpService
      .post(`https://${mszfHost}/${url_withdraw}`, params)
      .toPromise();

    withdrawResult = MSZFChannelWithdrawResult.responseFactory(
      response,
      this.getPaymentProviderName()
    );

    withdrawResult.channelRequestTime = moment()
      .utcOffset('+08:00')
      .format('YYYY-MM-DD HH:mm:ss');
    withdrawResult.channelRequestJson = JSON.stringify(params);
    withdrawResult.channelResponseJson = JSON.stringify(response.data);

    if (withdrawResult.result) {
      const responseSign: string = this.getWithdrawResponseSign(withdrawResult);
      const data = <MSZFChannelWithdrawResultData>withdrawResult.data;
      if (responseSign !== data.sign) {
        withdrawResult.result = false;
        withdrawResult.code = ErrorCodeEnum.WITHDRAW_PROVIDER_FAILED;
        withdrawResult.errorCode = this.configService.get<string>(
          'mszf.SIGN_ERROR_CODE'
        );
        withdrawResult.errorMessage = Locale.MSG_MSZF_REQUEST_SIGNERROR;
        withdrawResult.data = null;
      }
    }else{
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
    withdrawStatus: MSZFWithdrawStatusResponseDto,
    ip: string
  ): Promise<string> {
    if (!(await this.beforeWithdrawCallback(withdrawStatus, ip))) {
      return MSZFWithdrawCallbackResultEnum.FAILED;
    }

    const order: WithdrawPendingOrderModel = await this.withdrawPendingOrderService.findByOrderId(
      withdrawStatus.merchantOrderId
    );
    if (!order) {
      return MSZFWithdrawCallbackResultEnum.FAILED;
    }

    const paymentStatusSign: string = this.getWithdrawStatusResponseSign(
      withdrawStatus
    );

    if (paymentStatusSign.toUpperCase() !== withdrawStatus.sign.toUpperCase()) {
      return MSZFWithdrawCallbackResultEnum.FAILED;
    }

    order.status = this.getOrderStatusByWithdrawStatus(withdrawStatus.status);

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
      return MSZFWithdrawCallbackResultEnum.FAILED;
    }

    return MSZFWithdrawCallbackResultEnum.SUCCESS;
  }

  async isAvailable(): Promise<boolean> {
    return true;
    // const host = this.configService.get<string>('MSZF_HOST');
    // const url_available = this.configService.get<string>('MSZF_AVAILABLE_URL');
    // try {
    //   const response = await this.httpService
    //     .post(`https://${host}/${url_available}`, {})
    //     .toPromise();

    //   if (
    //     response.data &&
    //     response.data.result !== undefined &&
    //     response.data.errorMsg !== undefined &&
    //     response.data.errorMsg.code !== undefined
    //   ) {
    //     return true;
    //   }
    //   return false;
    // } catch (error) {
    //   return false;
    // }
  }

  getDepositMerchantCode(channel: ChannelModel): string {
    return channel.fromPaymentSystem.isBank && channel.toPaymentSystem.isBank
      ? this.configService.get<string>('MSZF_MERCHANT_GATEWAY_CODE')
      : this.configService.get<string>('MSZF_MERCHANT_CODE');
    return null;
  }

  getWithdrawalMerchantCode(): string {
    const merchantCode: string = this.configService.get<string>(
      'MSZF_MERCHANT_GATEWAY_CODE'
    );

    return merchantCode;
  }

  getDepositMerchantSecurityCode(channel: ChannelModel): string {
    return channel.fromPaymentSystem.isBank && channel.toPaymentSystem.isBank
      ? this.configService.get<string>('MSZF_MERCHANT_GATEWAY_SECURITY_CODE')
      : this.configService.get<string>('MSZF_MERCHANT_SECURITY_CODE');
  }

  getWithdrawalMerchantSecurityCode(): string {
    const merchantSecurityCode: string = this.configService.get<string>(
      'MSZF_MERCHANT_GATEWAY_SECURITY_CODE'
    );

    return merchantSecurityCode;
  }

  getDepositRequestSign(
    params: MSZFDepositRequestParams,
    channel: ChannelModel
  ): string {
    const amount = params.amount;
    const merchantCode = params.merchantCode;
    const merchantOrderId = params.merchantOrderId;
    const merchantMemberId = params.merchantMemberId;
    const merchantMemberIp = params.merchantMemberIp;
    const paymentTypeCode = params.paymentTypeCode;
    const successUrl = params.successUrl;
    const merchantSecurityCode = this.getDepositMerchantSecurityCode(channel);

    const txtSource = `amount=${amount}|merchantCode=${merchantCode}|merchantMemberId=${merchantMemberId}|merchantMemberIp=${merchantMemberIp}|merchantOrderId=${merchantOrderId}|paymentTypeCode=${paymentTypeCode}|successUrl=${successUrl}${merchantSecurityCode}`;
    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  getDepositResponseSign(
    depositResult: PaymentProviderChannelDepositResult,
    channel: ChannelModel
  ): string {
    const mszfDepositResult: MSZFChannelDepositResult = <
      MSZFChannelDepositResult
      >depositResult;

    const data: MSZFDepositResultData = <MSZFDepositResultData>(
      mszfDepositResult.data
    );

    const gamerOrderId: string = depositResult.providerOrderId;
    const http: string = data.httpUrl;
    const https: string = data.httpsUrl;
    const merchantSecurityCode = this.getDepositMerchantSecurityCode(channel);

    const txtSource = `gamerOrderId=${gamerOrderId}|httpUrl=${http}|httpsUrl=${https}${merchantSecurityCode}`;
    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  getDepositStatusResponseSign(
    depositStatus: MSZFDepositStatusResponseDto,
    channel: ChannelModel
  ): string {
    const amount = depositStatus.amount;
    const currencyCode = depositStatus.currencyCode;
    const gamerOrderId: string = depositStatus.gamerOrderId;
    const merchantOrderId = depositStatus.merchantOrderId;
    const mp = depositStatus.mp;
    const remark = depositStatus.remark;
    const status = depositStatus.status;
    const paymentTypeCode = depositStatus.paymentTypeCode;
    const merchantSecurityCode = this.getDepositMerchantSecurityCode(channel);

    const txtSource = `amount=${amount}|currencyCode=${currencyCode}|gamerOrderId=${gamerOrderId}|merchantOrderId=${merchantOrderId}|mp=${mp}|paymentTypeCode=${paymentTypeCode}|remark=${remark}|status=${status}${merchantSecurityCode}`;
    const txtDecryption = md5(txtSource);
    return txtDecryption;
  }

  getWithdrawRequestSign(params: MSZFWithdrawRequestParams): string {
    const merchantSecurityCode = this.getWithdrawalMerchantSecurityCode();
    const txtSource = `amount=${params.amount}|bankAccountName=${params.bankAccountName}|bankAccountNumber=${params.bankAccountNumber}|bankCode=${params.bankCode}|branch=${params.branch}|city=${params.city}|merchantCode=${params.merchantCode}|merchantOrderId=${params.merchantOrderId}|province=${params.province}|successUrl=${params.successUrl}${merchantSecurityCode}`;
    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  getWithdrawResponseSign(
    withdrawResult: PaymentProviderChannelWithdrawResult
  ): string {
    const mszfWithdrawResult: MSZFChannelWithdrawResult = <
      MSZFChannelWithdrawResult
      >withdrawResult;

    const data: MSZFChannelWithdrawResultData = <MSZFChannelWithdrawResultData>(
      mszfWithdrawResult.data
    );

    const gamerOrderId: string = withdrawResult.providerId;
    const merchantOrderId: string = data.merchantOrderId;
    const merchantSecurityCode = this.getWithdrawalMerchantSecurityCode();

    const txtSource = `gamerOrderId=${gamerOrderId}|merchantOrderId=${merchantOrderId}${merchantSecurityCode}`;
    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  getWithdrawStatusResponseSign(
    withdrawStatus: MSZFWithdrawStatusResponseDto
  ): string {
    const amount = withdrawStatus.amount;
    const currencyCode = withdrawStatus.currencyCode;
    const gamerOrderId: string = withdrawStatus.gamerOrderId;
    const merchantOrderId = withdrawStatus.merchantOrderId;
    const mp = withdrawStatus.mp;
    const remark = withdrawStatus.remark;
    const status = withdrawStatus.status;
    const paymentTypeCode = withdrawStatus.paymentTypeCode;
    const merchantSecurityCode = this.getWithdrawalMerchantSecurityCode();

    const txtSource = `amount=${amount}|currencyCode=${currencyCode}|gamerOrderId=${gamerOrderId}|merchantOrderId=${merchantOrderId}|mp=${mp}|paymentTypeCode=${paymentTypeCode}|remark=${remark}|status=${status}${merchantSecurityCode}`;
    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum {
    return this.getOrderStatusByProviderStatus(<string>argDepositStatus);
  }

  getOrderStatusByWithdrawStatus(argWithdrawStatus: {}): OrderStatusEnum {
    return this.getOrderStatusByProviderStatus(<string>argWithdrawStatus);
  }

  getOrderStatusByProviderStatus(providerStatus: string): OrderStatusEnum {
    let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    switch (providerStatus) {
      case MSZFPaymentStatusEnum.PENDING:
        orderStatus = OrderStatusEnum.PENDING;
        break;
      case MSZFPaymentStatusEnum.FAILED:
        orderStatus = OrderStatusEnum.FAILED;
        break;
      case MSZFPaymentStatusEnum.READYTOPAY:
        orderStatus = OrderStatusEnum.WAITINGPAID;
        break;
      case MSZFPaymentStatusEnum.SUCCESS:
        orderStatus = OrderStatusEnum.SUCCESS;
        break;
      default:
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
      this.configService.get<number[]>('mszf.DEPOSIT_FROZEN_CODE') || [];

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
      this.configService.get<number[]>('mszf.WITHDRAW_FROZEN_CODE') || [];

    return (
      frozenCodes.filter((frozenCode) => frozenCode === errorCode).length > 0
    );
  }
}
