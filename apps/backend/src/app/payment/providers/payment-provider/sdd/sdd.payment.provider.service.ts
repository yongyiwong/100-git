import { PaymentProviderEnum, OrderStatusEnum } from '@workspace/enums';
import { PaymentProviderChannelModel } from '../../../../models/payment.provider.channel.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { PaymentProviderDepositRequestDto } from '../payment.provider.deposit.request.dto';
import { PaymentProviderDepositResult } from '../payment.provider.deposit.result';
import {
  PaymentProviderChannelDepositResultBundle,
  PaymentProviderChannelWithdrawResultBundle,
  PaymentProviderService,
} from '../payment.provider.service';
import { PaymentProviderWithdrawResult } from '../payment.provider.withdraw.result';
import {
  SDDDepositStatusEnum,
  SDDDepositStatusResponseDto,
} from './dto/sdd.deposit.status.response.dto';
import {
  SDDWithdrawStatusEnum,
  SDDWithdrawStatusResponseDto,
} from './dto/sdd.withdraw.status.response.dto';
import { SDDChannelDepositResult } from './dto/sdd.deposit.result';
import { DepositPendingOrderModel } from '../../../../models/deposit.pending.order.model';
import { SDDDepositRequestParams } from './dto/sdd.deposit.request.params';
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
import { BankService } from '../../../bank/bank.service';
import { PaymentProviderCardService } from '../../payment-provider-card/payment.provider.card.service';
import { PaymentProviderEntityService } from '../../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderSharedService } from '../../payment-provider-shared/payment.provider.shared.service';
import { PaymentWithdrawRequestDto } from '../../../dto/payment.withdraw.request.dto';
import { PaymentProviderUsdtProtoService } from '../../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { PaymentProviderUsdtProtocolModel } from '../../../../models/payment.provider.usdt.protocol.model';
import { OptionsService } from '../../../../options/options.service';
import { ErrorCodeEnum } from '../../../../error/enums/errorCodeEnum';

@Injectable()
export class SDDPaymentProviderService extends PaymentProviderService {
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
    return PaymentProviderEnum.SDD;
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

    let depositResult: SDDChannelDepositResult;
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

    const params = new SDDDepositRequestParams();

    params.trade_no = order.orderId;
    params.amount = depositRequest.amount;
    params.notify_url =
      this.getBaseUrl(depositRequest.headers['host']) +
      this.configService.get<string>('sdd.DEPOSIT_SUCCESS_URL');
    params.ip = depositRequest.ip;
    params.player_name = depositRequest.userId;

    const host = this.configService.get<string>('SDD_HOST');
    const url = this.configService.get<string>('SDD_DEPOSIT_URL');
    const response = await this.httpService
      .post(`http://${host}/${url}`, qs.stringify(params), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.configService.get<string>(
            'SDD_ACCESS_TOKEN'
          )}`,
        },
      })
      .toPromise();

    depositResult = SDDChannelDepositResult.responseFactory(
      response,
      this.getPaymentProviderName()
    );

    if( !depositResult.result ){
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
  public withdrawByPaymentProviderChannel(
    withdrawRequestDto: PaymentWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelWithdrawResultBundle> {
    throw new Error('Method not implemented.');
  }

  public depositErrorFactory(error: any): PaymentProviderDepositResult {
    throw new Error('Method not implemented.');
  }

  public withdrawErrorFactory(error: any): PaymentProviderWithdrawResult {
    throw new Error('Method not implemented.');
  }

  getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum {
    throw new Error('Method not implemented.');
    // let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    // const depositStatus = <SDDDepositStatusEnum>argDepositStatus;

    // switch (depositStatus) {
    // }

    // return orderStatus;
  }

  getOrderStatusByWithdrawStatus(argWithdrawStatus: {}): OrderStatusEnum {
    throw new Error('Method not implemented.');
    // let orderStatus: OrderStatusEnum = OrderStatusEnum.NEW;
    // const withdrawStatus = <SDDWithdrawStatusEnum>argWithdrawStatus;

    // switch (withdrawStatus) {
    // }

    // return orderStatus;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit Callback
  ////////////////////////////////////////////////////////////////////////////////
  async depositCallback(
    depositStatusResponse: SDDDepositStatusResponseDto,
    ip: string
  ): Promise<string> {
    return null;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw Callback
  ////////////////////////////////////////////////////////////////////////////////
  async withdrawCallback(
    withdrawStatusResponse: SDDWithdrawStatusResponseDto,
    ip: string
  ): Promise<string> {
    return null;
  }
}
