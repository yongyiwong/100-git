import { PaymentProviderEnum, OrderStatusEnum } from '@workspace/enums';
import { PaymentProviderChannelModel } from '../../../../models/payment.provider.channel.model';
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
  HengXinDepositStatusEnum,
  HengXinDepositStatusResponseDto,
} from './dto/hengxin.deposit.status.response.dto';
import {
  HengXinWithdrawStatusEnum,
  HengXinWithdrawStatusResponseData,
  HengXinWithdrawStatusResponseDto,
} from './dto/hengxin.withdraw.status.response.dto';
import { HengXinChannelDepositResult } from './dto/hengxin.deposit.result';
import { DepositPendingOrderModel } from '../../../../models/deposit.pending.order.model';
import { HengXinDepositRequestParams } from './dto/hengxin.deposit.request.params';
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
import * as moment from 'moment-timezone';
import * as numeral from 'numeral';
import * as md5 from 'md5';
import * as crypto from 'crypto';
import {
  HengXinWithdrawRequestData,
  HengXinWithdrawRequestParams,
} from './dto/hengxin.withdraw.request.params';
import {
  HengXinChannelWithdrawResult,
  HengXinWithdrawResult,
} from './dto/hengxin.withdraw.result';
import {
  NotSupportedBank,
  PaymentProviderException,
} from '../../../payment.exception';
import { RSA_PKCS1_PADDING } from 'constants';
import { InjectModel } from '@nestjs/sequelize';
import { TestModel } from '../../../../models/test.entity';
import { BankService } from '../../../bank/bank.service';
import { PaymentProviderWithdrawRequestDto } from '../payment.provider.withdraw.request.dto';
import { PaymentProviderCardService } from '../../payment-provider-card/payment.provider.card.service';
import { PaymentProviderEntityService } from '../../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderSharedService } from '../../payment-provider-shared/payment.provider.shared.service';
import { PaymentProviderUsdtProtoService } from '../../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { PaymentProviderUsdtProtocolModel } from '../../../../models/payment.provider.usdt.protocol.model';
import { OptionsService } from '../../../../options/options.service';
import { ErrorCodeEnum } from '../../../../error/enums/errorCodeEnum';

export enum HengXinDepositCallbackResultEnum {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum HengXinWithdrawCallbackResultEnum {
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Injectable()
export class HengXinPaymentProviderService extends PaymentProviderService {
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
    return PaymentProviderEnum.HENGXIN;
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
    throw new Error('Method not implemented.');
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

    let withdrawResult: HengXinChannelWithdrawResult;

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

    const params = new HengXinWithdrawRequestParams();

    params.merId = this.configService.get<string>('HENGXIN_MERID');
    params.version = this.configService.get<string>('HENGXIN_VERSION');

    const data = new HengXinWithdrawRequestData();
    data.merOrderNo = order.orderId;
    data.amount = withdrawRequest.amount;
    data.submitTime = moment().format('x');
    data.notifyUrl =
      this.getBaseUrl(withdrawRequest.headers['host']) +
      this.configService.get<string>('hengxin.WITHDRAWAL_SUCCESS_URL');
    data.bankCode = paymentProviderBank.paymentProviderBankCode;
    data.bankAccountNo = withdrawRequest.bankAccountNumber;
    data.bankAccountName = withdrawRequest.bankAccountName;
    data.bankBranchName =
      !withdrawRequest.branch || !withdrawRequest.branch.trim()
        ? paymentProviderBank.paymentProviderBankName
        : withdrawRequest.branch;
    data.remarks = this.configService.get<string>('hengxin.remarks');

    data.sign = this.getWithdrawRequestSign(
      data,
      this.configService.get<string>('HENGXIN_WITHDRAW_MD5_KEY')
    ).toUpperCase();

    const keyPub = this.configService.get<string>(
      'HENGXIN_WITHDRAW_PUBLICK_KEY'
    );

    const bData = Buffer.from(JSON.stringify(data));
    let encData: Buffer = Buffer.from('');

    try {
      for (let i = 0; i < bData.length; i += 117) {
        const encryptedData = crypto.publicEncrypt(
          {
            key:
              '-----BEGIN PUBLIC KEY-----\n' +
              `${keyPub}\n` +
              '-----END PUBLIC KEY-----',
            padding: RSA_PKCS1_PADDING,
          },
          bData.slice(i, i + 117)
        );

        //console.log('++++', encryptedData.toString('base64'));
        encData = Buffer.concat([encData, encryptedData]);
      }
    } catch (error) {
      console.log(error);
      throw new PaymentProviderException();
    }

    params.data = encData.toString('base64');

    //console.log(params);

    const host = this.configService.get<string>('HENGXIN_HOST');
    const url = this.configService.get<string>('HENGXIN_WITHDRAW_URL');

    const response = await this.httpService
      .post(`http://${host}/${url}`, params)
      .toPromise();

    //console.log(response.data);

    withdrawResult = HengXinChannelWithdrawResult.responseFactory(
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
    throw new Error('Method not implemented.');
  }

  public withdrawErrorFactory(error: any): PaymentProviderWithdrawResult {
    return HengXinWithdrawResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('hengxin.DEFAULT_ERROR_CODE')
    );
  }

  getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum {
    throw new Error('Method not implemented.');
    // let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    // const depositStatus = <HengXinDepositStatusEnum>argDepositStatus;

    // switch (depositStatus) {
    // }

    // return orderStatus;
  }

  getOrderStatusByWithdrawStatus(
    withdrawStatus: HengXinWithdrawStatusEnum
  ): OrderStatusEnum {
    const orderStatus = OrderStatusEnum.PENDING;

    switch (withdrawStatus) {
      case HengXinWithdrawStatusEnum.PROCESSING:
        return OrderStatusEnum.PENDING;
      case HengXinWithdrawStatusEnum.SUCCESS:
        return OrderStatusEnum.SUCCESS;
      case HengXinWithdrawStatusEnum.FAILED:
        return OrderStatusEnum.FAILED;
      default:
        break;
    }

    return orderStatus;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit Callback
  ////////////////////////////////////////////////////////////////////////////////
  async depositCallback(
    depositStatusResponse: HengXinDepositStatusResponseDto,
    ip: string
  ): Promise<string> {
    return null;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw Callback
  ////////////////////////////////////////////////////////////////////////////////
  async withdrawCallback(
    withdrawStatusResponse: HengXinWithdrawStatusResponseDto,
    ip: string
  ): Promise<string> {
    /* await this.testRepository.create({
      a: JSON.stringify(withdrawStatusResponse),
    }); */

    if (!(await this.beforeWithdrawCallback(withdrawStatusResponse, ip))) {
      return HengXinWithdrawCallbackResultEnum.FAILED;
    }

    const merId = this.configService.get<string>('HENGXIN_MERID');
    if (`${withdrawStatusResponse.merId}` !== `${merId}`) {
      return HengXinWithdrawCallbackResultEnum.FAILED;
    }

    const order = await this.withdrawPendingOrderService.findByOrderId(
      withdrawStatusResponse.merOrderNo
    );

    if (!order) {
      return HengXinWithdrawCallbackResultEnum.FAILED;
    }

    const keyPriv = this.configService.get<string>(
      'HENGXIN_WITHDRAW_PRIVATE_KEY'
    );

    const bData = Buffer.from(withdrawStatusResponse.data, 'base64');
    let decData: Buffer = Buffer.from('');

    try {
      for (let i = 0; i < bData.length; i += 128) {
        const decryptedData = crypto.privateDecrypt(
          {
            key:
              '-----BEGIN PRIVATE KEY-----\n' +
              `${keyPriv}\n` +
              '-----END PRIVATE KEY-----',
            padding: RSA_PKCS1_PADDING,
          },
          bData.slice(i, i + 128)
        );

        decData = Buffer.concat([decData, decryptedData]);
      }
    } catch (error) {
      return HengXinWithdrawCallbackResultEnum.FAILED;
    }

    const data: HengXinWithdrawStatusResponseData = JSON.parse(
      decData.toString()
    );

    const sign = this.getWithdrawStatusResponseSign(
      data,
      this.configService.get<string>('HENGXIN_WITHDRAW_MD5_KEY')
    );

    if (sign.toUpperCase() !== data.sign.toUpperCase()) {
      return HengXinWithdrawCallbackResultEnum.FAILED;
    }

    order.status = this.getOrderStatusByWithdrawStatus(data.orderState);

    order.providerOrderId = data.orderNo;

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
      return HengXinWithdrawCallbackResultEnum.FAILED;
    }

    return HengXinWithdrawCallbackResultEnum.SUCCESS;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Withdraw Request Sign
  ////////////////////////////////////////////////////////////////////////////////
  getWithdrawRequestSign(params: HengXinWithdrawRequestData, key: string) {
    const txtSource =
      `amount=${params.amount}` +
      `&bankAccountName=${params.bankAccountName}` +
      `&bankAccountNo=${params.bankAccountNo}` +
      //`&bankBranchName=${params.bankBranchName}` +
      `&bankCode=${params.bankCode}` +
      `&merOrderNo=${params.merOrderNo}` +
      `&notifyUrl=${params.notifyUrl}` +
      //`&remarks=${params.remarks}` +
      `&submitTime=${params.submitTime}` +
      `&key=${key}`;

    const txtDecryption = md5(txtSource);

    return txtDecryption;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Deposit Status Sign
  ////////////////////////////////////////////////////////////////////////////////
  getWithdrawStatusResponseSign(
    withdrawStatus: HengXinWithdrawStatusResponseData,
    key: string
  ): string {
    const txtSource =
      `amount=${withdrawStatus.amount}` +
      `&merOrderNo=${withdrawStatus.merOrderNo}` +
      `&orderNo=${withdrawStatus.orderNo}` +
      `&orderState=${withdrawStatus.orderState}` +
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
    const errorCode = depositResult
      ? numeral(depositResult.errorCode).value()
      : null;
    if (errorCode === null) {
      return false;
    }

    const frozenCodes =
      this.configService.get<number[]>('hengxin.DEPOSIT_FROZEN_CODE') || [];

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
      this.configService.get<number[]>('hengxin.WITHDRAW_FROZEN_CODE') || [];

    return (
      frozenCodes.filter((frozenCode) => frozenCode === errorCode).length > 0
    );
  }
}
