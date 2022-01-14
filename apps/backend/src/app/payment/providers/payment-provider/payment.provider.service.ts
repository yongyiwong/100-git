import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import * as numeral from 'numeral';

import {
  OrderStatusEnum,
  BankCodeEnum,
  PaymentProviderEnum,
  PaymentSystemEnum,
  CurrencyEnum,
  UsdtProtocolEnum,
} from '@workspace/enums';
import { DepositOrderCreateDto } from '../../order/deposit-order/deposit.order.dto';
import { DepositOrderService } from '../../order/deposit-order/deposit.order.service';
import { DepositPendingOrderCreateDto } from '../../order/deposit-pending-order/deposit.pending.order.dto';
import { DepositPendingOrderService } from '../../order/deposit-pending-order/deposit.pending.order.service';
import { WithdrawOrderCreateDto } from '../../order/withdraw-order/withdraw.order.dto';
import { WithdrawOrderService } from '../../order/withdraw-order/withdraw.order.service';
import { WithdrawPendingOrderCreateDto } from '../../order/withdraw-pending-order/withdraw.pending.order.dto';
import { WithdrawPendingOrderService } from '../../order/withdraw-pending-order/withdraw.pending.order.service';
import { PaymentProviderBankService } from '../payment-provider-bank/payment.provider.bank.service';
import { PaymentProviderDepositRequestDto } from './payment.provider.deposit.request.dto';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
} from './payment.provider.deposit.result';
import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from './payment.provider.withdraw.result';
import { ChannelService } from '../../channel/channel.service';
import { PaymentProviderChannelService } from '../payment-provider-channel/payment.provider.channel.service';
import { PaymentProviderException } from '../../payment.exception';
import * as moment from 'moment-timezone';
import { DepositPendingOrderModel } from '../../../models/deposit.pending.order.model';
import { PaymentProviderBankModel } from '../../../models/payment.provider.bank.entity';
import { PaymentProviderChannelModel } from '../../../models/payment.provider.channel.model';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { WithdrawPendingOrderModel } from '../../../models/withdraw.pending.order.model';
import { BCDepositInParams } from '../../betContruct/dto/bc.deposit.in.params';
import { BetConstructService } from '../../betContruct/betConstruct.service';
import { BCDepositOut } from '../../betContruct/dto/bc.deposit.out';
import { PaymentProviderWithdrawRequestDto } from './payment.provider.withdraw.request.dto';
import { BCWithdrawInParams } from '../../betContruct/dto/bc.withdraw.in.params';
import { BCWithdrawOut } from '../../betContruct/dto/bc.withdraw.out';
import { BcOrdersModel } from '../../../models/bcOrders';
import { PaymentStatusResponseDto } from './payment.status.response.dto';
import { BankService } from '../../bank/bank.service';
import { PaymentProviderCardService } from '../payment-provider-card/payment.provider.card.service';
import { PaymentProviderEntityService } from '../payment-provider-entity/Payment.provider.entity.service';
import { ChannelModel } from '../../../models/channel.model';
import { PaymentSystemModel } from '../../../models/payment.system.model';
import { PaymentProviderSharedService } from '../payment-provider-shared/payment.provider.shared.service';
import { PaymentDepositByCardRequest } from '../../interface/payment.deposit.bycard.request';
import { PaymentProviderCardModel } from '../../../models/payment.provider.card.model';
import { PaymentWithdrawRequestDto } from '../../dto/payment.withdraw.request.dto';
import { PaymentProviderUsdtProtoService } from '../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { PaymentProviderUsdtProtocolModel } from '../../../models/payment.provider.usdt.protocol.model';
import { OptionsService } from '../../../options/options.service';
import { ErrorCodeEnum } from '../../../error/enums/errorCodeEnum';

export class PaymentProviderChannelDepositResultBundle {
  depositResult: PaymentProviderChannelDepositResult;
  order: DepositPendingOrderModel;
}

export class PaymentProviderChannelWithdrawResultBundle {
  withdrawResult: PaymentProviderChannelWithdrawResult;
  order: WithdrawPendingOrderModel;
}

export abstract class PaymentProviderService {
  //protected baseURL = '';
  private paymentProviderEntity: PaymentProviderEntityModel = null;

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
    protected paymentProviderEntityService: PaymentProviderEntityService,
    protected paymentProviderSahredService: PaymentProviderSharedService,
    protected sequelize: Sequelize,
    protected betConstructService: BetConstructService,
    protected optionsService: OptionsService
  ) {
    // const host = this.configService.get('BACKEND_HOST');
    // const globalPrefix = this.configService.get('BACKEND_PREFIX');
    // this.baseURL = 'https://' + host + '/' + globalPrefix;

    this.paymentProviderEntityService
      .findById(this.getPaymentProviderEnum())
      .then(async (paymentProvider) => {
        if (!paymentProvider) {
          return;
        }

        if (paymentProvider.isOnlyCardSupport) {
          await this.paymentProviderSahredService.uptodateChannelMinMaxAmountForCardProvider(
            paymentProvider.id
          );
          return;
        }

        const usdtDepositChannel = await this.paymentProviderChannelService.findOneDepositUsdtToUsdt(
          paymentProvider.id
        );

        if (usdtDepositChannel) {
          const minMaxAmount = await this.paymentProviderUsdtProtoService.getDepositMinMaxAmount(
            paymentProvider.id
          );

          if (minMaxAmount) {
            if (minMaxAmount.providerMinAmount) {
              usdtDepositChannel.providerMinAmount =
                minMaxAmount.providerMinAmount;
            }

            if (minMaxAmount.providerMaxAmount) {
              usdtDepositChannel.providerMaxAmount =
                minMaxAmount.providerMaxAmount;
            }

            await usdtDepositChannel.save();
          }
        }

        const usdtWithdrawChannel = await this.paymentProviderChannelService.findOneWithdrawUsdtToUsdt(
          paymentProvider.id
        );

        if (usdtWithdrawChannel) {
          const minMaxAmount = await this.paymentProviderUsdtProtoService.getWithdrawMinMaxAmount(
            paymentProvider.id
          );

          if (minMaxAmount) {
            if (minMaxAmount.providerMinAmount) {
              usdtWithdrawChannel.providerMinAmount =
                minMaxAmount.providerMinAmount;
            }

            if (minMaxAmount.providerMaxAmount) {
              usdtWithdrawChannel.providerMaxAmount =
                minMaxAmount.providerMaxAmount;
            }

            await usdtWithdrawChannel.save();
          }
        }
      });
  }

  protected getBaseUrl(host: string) {
    const globalPrefix = this.configService.get('BACKEND_PREFIX');
    return 'https://' + host + '/' + globalPrefix;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// ABSTRACT MEMBERS
  ////////////////////////////////////////////////////////////////////////////////

  abstract getPaymentProviderEnum(): PaymentProviderEnum;

  abstract isAvailable(): Promise<boolean>;

  public abstract depositByPaymentProviderChannel(
    depositRequest: PaymentProviderDepositRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    paymentProviderUsdtProto: PaymentProviderUsdtProtocolModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelDepositResultBundle>;

  public abstract withdrawByPaymentProviderChannel(
    withdrawRequestDto: PaymentWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelWithdrawResultBundle>;

  public abstract depositErrorFactory(error): PaymentProviderDepositResult;
  public abstract withdrawErrorFactory(error): PaymentProviderWithdrawResult;

  abstract getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum;
  abstract getOrderStatusByWithdrawStatus(argWithdrawStatus: {}): OrderStatusEnum;

  depositByCard(request: PaymentDepositByCardRequest) { }

  ////////////////////////////////////////////////////////////////////////////////
  /// PyamnetProviderEntity
  ////////////////////////////////////////////////////////////////////////////////
  getPaymnetProviderEntity(): PaymentProviderEntityModel {
    return this.paymentProviderEntity;
  }
  setPaymentProviderEntity(paymentProviderEntity: PaymentProviderEntityModel) {
    this.paymentProviderEntity = paymentProviderEntity;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// PaymentProviderName
  ////////////////////////////////////////////////////////////////////////////////
  getPaymentProviderName(): string {
    return this.paymentProviderEntity
      ? this.paymentProviderEntity.providerName
      : null;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// PaymentProviderId
  ////////////////////////////////////////////////////////////////////////////////
  getPaymentProviderId(): number {
    return this.paymentProviderEntity ? this.paymentProviderEntity.id : null;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get PaymentProvider Channel
  ////////////////////////////////////////////////////////////////////////////////
  async getPaymentProviderChannel(
    channelId: number
  ): Promise<PaymentProviderChannelModel> {
    const paymentProviderId = this.paymentProviderEntity.id;

    if (!this.paymentProviderEntity) {
      return null;
    }

    const paymentProviderChannels = await this.paymentProviderChannelService.getDeposits(
      channelId,
      paymentProviderId
    );

    if (!paymentProviderChannels || paymentProviderChannels.length < 1) {
      return null;
    }

    return paymentProviderChannels[0];
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get PaymentProvider Bank
  ////////////////////////////////////////////////////////////////////////////////
  async getPaymentProviderBank(
    bankCode: string
  ): Promise<PaymentProviderBankModel> {
    const paymentProviderId = this.getPaymentProviderId();
    if (!paymentProviderId) {
      return null;
    }

    const paymentProviderBank = await this.paymentProviderBankService.get(
      paymentProviderId,
      BankCodeEnum[bankCode]
    );

    if (!paymentProviderBank) {
      return null;
    }

    return paymentProviderBank;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit Procedure
  ////////////////////////////////////////////////////////////////////////////////
  private async deposit(
    depositRequest: PaymentProviderDepositRequestDto,
    frozenCheck: boolean,
    transaction: Transaction
  ): Promise<PaymentProviderDepositResult> {
    const depositResult = new PaymentProviderDepositResult();
    depositResult.result = false;
    depositResult.paymentProviderChannelDepositResults = [];

    const paymentSystemId = PaymentSystemEnum[depositRequest.paymentSystem];

    let paymentProviderChannels: PaymentProviderChannelModel[];

    paymentProviderChannels = await this.paymentProviderChannelService.getDepositablesByPaymentSystem(
      paymentSystemId,
      this.getPaymentProviderId(),
      depositRequest.amount
    );

    if (!paymentProviderChannels || paymentProviderChannels.length < 1) {
      depositResult.code = ErrorCodeEnum.DEPOSIT_PROVIDER_CHANNEL_NOT_FOUND;
      return depositResult;
    }

    let paymentProviderUsdtProto: PaymentProviderUsdtProtocolModel;
    if (paymentSystemId === PaymentSystemEnum.USDT) {
      const usdtProtoId = UsdtProtocolEnum[depositRequest.usdtProto];
      if (!usdtProtoId) {
        depositResult.code = ErrorCodeEnum.DEPOSIT_PROVIDER_USDT_PROTO_NOT_FOUND;
        return depositResult;
      }

      const paymentProviderUsdtProtos = await this.paymentProviderUsdtProtoService.findAll(
        {
          where: {
            paymentProviderId: this.getPaymentProviderId(),
            usdtProtoId,
          },
        }
      );

      if (!paymentProviderUsdtProtos || paymentProviderUsdtProtos.length < 1) {
        depositResult.code = ErrorCodeEnum.DEPOSIT_PROVIDER_USDT_PROTO_NOT_FOUND;
        return depositResult;
      }

      paymentProviderUsdtProto = paymentProviderUsdtProtos[0];
    }

    let ppcDepositResult: PaymentProviderChannelDepositResult = null;

    for (let i = 0; i < paymentProviderChannels.length; i++) {
      const paymentProviderChannel = paymentProviderChannels[i];

      const ppcDepositResultBundle = await this.depositByPaymentProviderChannel(
        depositRequest,
        paymentProviderChannel,
        paymentProviderUsdtProto,
        transaction
      );

      if (frozenCheck) {
        await this.updateFrozenStatusByChannelDepositResult(
          paymentProviderChannel,
          depositRequest,
          ppcDepositResultBundle ? ppcDepositResultBundle.depositResult : null
        );
      }

      if (!ppcDepositResultBundle) {
        ppcDepositResult = {
          result: false,
          code: ErrorCodeEnum.DEPOSIT_PROVIDER_FAILED_INTERNAL,
          providerName: this.getPaymentProviderName(),
          channelName: paymentProviderChannel.channel.channelName,
          providerChannelName: paymentProviderChannel.providerChannelName,
        };
      } else {
        ppcDepositResult = ppcDepositResultBundle.depositResult;

        if (ppcDepositResultBundle.order) {
          this.updateOrderAfterDeposit(
            ppcDepositResultBundle.order,
            ppcDepositResultBundle.depositResult,
            transaction
          );
          depositResult.orderId = ppcDepositResultBundle.order.orderId;
        }
      }

      depositResult.paymentProviderChannelDepositResults.push(ppcDepositResult);

      if (!ppcDepositResult.result) {
        continue;
      }

      break;
    }

    depositResult.paymentProviderName = this.getPaymentProviderName();
    depositResult.result = ppcDepositResult.result;
    if (!ppcDepositResult.result) {
      depositResult.code = ppcDepositResult.code;
      depositResult.errorCode = ppcDepositResult.errorCode;
      depositResult.errorMessage = ppcDepositResult.errorMessage;
    } else {
      depositResult.data = {
        url: ppcDepositResult.data ? ppcDepositResult.data.url : null,
      };
    }

    return depositResult;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw Procedure
  ////////////////////////////////////////////////////////////////////////////////
  private async withdraw(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    frozenCheck: boolean,
    transaction: Transaction
  ): Promise<PaymentProviderWithdrawResult> {
    const withdrawResult = new PaymentProviderWithdrawResult();
    //withdrawResult.result = false;
    withdrawResult.paymentProviderChannelWithdrawResults = [];

    const paymentProviderChannels = await this.paymentProviderChannelService.getWithdrawablesByPaymentProvider(
      this.getPaymentProviderId(),
      withdrawRequest.amount
    );

    if (!paymentProviderChannels || paymentProviderChannels.length < 1) {
      withdrawResult.code = ErrorCodeEnum.WITHDRAW_PROVIDER_CHANNEL_NOT_FOUND;
      withdrawResult.result = false;
      return withdrawResult;
    }

    let ppcWithdrawResult: PaymentProviderChannelWithdrawResult = null;

    for (let i = 0; i < paymentProviderChannels.length; i++) {
      const paymentProviderChannel = paymentProviderChannels[i];

      const ppcWithdrawResultBundle = await this.withdrawByPaymentProviderChannel(
        withdrawRequest,
        paymentProviderChannel,
        transaction
      );

      if (frozenCheck) {
        await this.updateFrozenStatusByChannelWithdrawResult(
          paymentProviderChannel,
          withdrawRequest,
          ppcWithdrawResultBundle
            ? ppcWithdrawResultBundle.withdrawResult
            : null
        );
      }

      if (!ppcWithdrawResultBundle) {
        ppcWithdrawResult = {
          result: false,
          code: ErrorCodeEnum.WITHDRAW_PROVIDER_FAILED_INTERNAL,
          providerName: this.getPaymentProviderName(),
          channelName: paymentProviderChannel.channel.channelName,
          providerChannelName: paymentProviderChannel.providerChannelName,
        };

        withdrawResult.paymentProviderChannelWithdrawResults.push(
          ppcWithdrawResult
        );
        continue;
      }

      ppcWithdrawResult = ppcWithdrawResultBundle.withdrawResult;

      if (ppcWithdrawResultBundle.order) {
        this.updateOrderAfterWithdraw(
          ppcWithdrawResultBundle.order,
          ppcWithdrawResultBundle.withdrawResult,
          transaction
        );
      }

      withdrawResult.paymentProviderChannelWithdrawResults.push(
        ppcWithdrawResult
      );
      if (!ppcWithdrawResult.result) {
        continue;
      }

      break;
    }

    withdrawResult.paymentProviderName = this.getPaymentProviderName();
    withdrawResult.code = ppcWithdrawResult.result ? 0 : ppcWithdrawResult.code;
    // withdrawResult.response = {
    //   code: ppcWithdrawResult.result
    //     ? 0
    //     : numeral(ppcWithdrawResult.errorCode).value(),
    // };

    // if (!ppcWithdrawResult.result) {
    //   withdrawResult.response.message = ppcWithdrawResult.errorMessage;
    // }

    return withdrawResult;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit Procedure General Wrapper
  ////////////////////////////////////////////////////////////////////////////////
  public async depositGeneralWrapper(
    depositRequest: PaymentProviderDepositRequestDto
  ): Promise<PaymentProviderDepositResult> {
    let depositResult: PaymentProviderDepositResult;

    try {
      depositResult = await this.deposit(depositRequest, true, null);

      if (!depositResult) {
        throw new PaymentProviderException();
      }
    } catch (error) {
      console.log(error);
      depositResult = this.depositErrorFactory(error);
      depositResult.code = ErrorCodeEnum.DEPOSIT_PROVIDER_ERROR_UNKNOWN;
    }

    let paymentProviderDebug = this.configService.get<string>('PAYMENTPROVIDER_DEBUG');
    paymentProviderDebug = paymentProviderDebug ? JSON.parse(paymentProviderDebug) : true;

    if (!paymentProviderDebug) {
      depositResult.santitize();
    }

    return depositResult;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit Procedure PreTry Wrapper
  ////////////////////////////////////////////////////////////////////////////////
  public async depositPreTryWrapper(
    depositRequest: PaymentProviderDepositRequestDto
  ): Promise<PaymentProviderDepositResult> {
    let depositResult: PaymentProviderDepositResult;

    try {
      await this.sequelize.transaction(async (transaction) => {
        depositResult = await this.deposit(depositRequest, false, transaction);

        if (!depositResult) {
          throw new PaymentProviderException();
        }

        throw new PaymentProviderException();
      });
    } catch (error) { }

    return depositResult;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Channel Deposit Procedure PreTry Wrapper
  ////////////////////////////////////////////////////////////////////////////////
  public async channelDepositPreTryWrapper(
    depositRequest: PaymentProviderDepositRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel
  ) {
    let channelDepositResult: PaymentProviderChannelDepositResult = null;

    try {
      await this.sequelize.transaction(async (transaction) => {
        const channelDepositResultBundle = await this.depositByPaymentProviderChannel(
          depositRequest,
          paymentProviderChannel,
          null,
          transaction
        );
        if (!channelDepositResultBundle) {
          throw new PaymentProviderException();
        }
        channelDepositResult = channelDepositResultBundle.depositResult;
        throw new PaymentProviderException();
      });
    } catch (error) { }

    return channelDepositResult;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw Procedure General Wrapper
  ////////////////////////////////////////////////////////////////////////////////
  public async withdrawGeneralWrapper(
    withdrawRequest: PaymentProviderWithdrawRequestDto
  ): Promise<PaymentProviderWithdrawResult> {
    let withdrawResult: PaymentProviderWithdrawResult = null;

    try {
      withdrawResult = await this.withdraw(withdrawRequest, true, null);

      if (!withdrawResult) {
        throw new PaymentProviderException();
      }
    } catch (error) {
      console.log(error);
      withdrawResult = this.withdrawErrorFactory(error);
      withdrawResult.code = ErrorCodeEnum.WITHDRAW_PROVIDER_ERROR_UNKNOWN;
    }

    let paymentProviderDebug = this.configService.get<string>('PAYMENTPROVIDER_DEBUG');
    paymentProviderDebug = paymentProviderDebug ? JSON.parse(paymentProviderDebug) : true;

    if (!paymentProviderDebug) {
      withdrawResult.santitize();
    }

    return withdrawResult;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw Procedure PreTry Wrapper
  ////////////////////////////////////////////////////////////////////////////////
  public async withdrawPreTryWrapper(
    withdrawRequest: PaymentProviderWithdrawRequestDto
  ): Promise<PaymentProviderWithdrawResult> {
    let withdrawResult: PaymentProviderWithdrawResult = null;

    try {
      await this.sequelize.transaction(async (transaction) => {
        withdrawResult = await this.withdraw(
          withdrawRequest,
          false,
          transaction
        );

        if (!withdrawResult) {
          throw new PaymentProviderException();
        }

        throw new PaymentProviderException();
      });
    } catch (error) { }

    return withdrawResult;
  }

  public async channelWithdrawPreTryWrapper(
    withdrawRequest: PaymentWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel
  ) {
    let withdrawResult: PaymentProviderChannelWithdrawResult = null;

    try {
      await this.sequelize.transaction(async (transaction) => {
        const channelWithdrawResultBundle = await this.withdrawByPaymentProviderChannel(
          withdrawRequest,
          paymentProviderChannel,
          transaction
        );

        if (!channelWithdrawResultBundle) {
          throw new PaymentProviderException();
        }

        withdrawResult = channelWithdrawResultBundle.withdrawResult;

        throw new PaymentProviderException();
      });
    } catch (error) { }

    return withdrawResult;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Update PaymentProvider Channel Frozen Status By Deposit Result
  ////////////////////////////////////////////////////////////////////////////////
  protected async updateFrozenStatusByChannelDepositResult(
    paymentProviderChannel: PaymentProviderChannelModel,
    depositRequest: PaymentProviderDepositRequestDto,
    depositResult: PaymentProviderChannelDepositResult
  ) {
    paymentProviderChannel.isFrozen = this.getFrozenByChannelDepositResult(
      paymentProviderChannel,
      depositRequest,
      depositResult
    );
    paymentProviderChannel.frozenCheckedDate = moment().toDate();

    await this.paymentProviderChannelService.update(
      paymentProviderChannel,
      null
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Frozen Status By Channel DepositResult
  ////////////////////////////////////////////////////////////////////////////////
  protected getFrozenByChannelDepositResult(
    paymentProviderChannel: PaymentProviderChannelModel,
    depositRequest: PaymentProviderDepositRequestDto,
    depositResult: PaymentProviderChannelDepositResult
  ): boolean {
    return depositResult ? !depositResult.result : true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Update PaymentProvider Channel Frozen Status By Withdraw Result
  ////////////////////////////////////////////////////////////////////////////////
  protected async updateFrozenStatusByChannelWithdrawResult(
    paymentProviderChannel: PaymentProviderChannelModel,
    withdrawRequest: PaymentWithdrawRequestDto,
    withdrawResult: PaymentProviderChannelWithdrawResult
  ) {
    paymentProviderChannel.isFrozen = this.getFrozenByChannelWithdrawResult(
      withdrawResult
    );

    paymentProviderChannel.frozenCheckedDate = moment().toDate();

    await this.paymentProviderChannelService.update(
      paymentProviderChannel,
      null
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Frozen Status By Channel WithdrawResult
  ////////////////////////////////////////////////////////////////////////////////
  protected getFrozenByChannelWithdrawResult(
    withdrawResult: PaymentProviderChannelWithdrawResult
  ): boolean {
    return withdrawResult ? !withdrawResult.result : true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Create Deposit Pending Order By DepositRequest
  ////////////////////////////////////////////////////////////////////////////////
  protected async createOrderBeforeDeposit(
    depositRequest: PaymentProviderDepositRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<DepositPendingOrderModel> {
    const orderCreate = new DepositPendingOrderCreateDto();

    orderCreate.orderId =
      `${(numeral(Math.random().toString(10).substr(2, 1)).value() % 9) + 1}` +
      `${Math.random().toString(10).substr(2, 7)}`;

    orderCreate.amount = depositRequest.amount;
    orderCreate.channelId = paymentProviderChannel.channelId;
    orderCreate.userId = depositRequest.userId;

    orderCreate.paymentProviderId = this.getPaymentProviderId();
    orderCreate.paymentProviderChannelId = paymentProviderChannel.id;

    orderCreate.status = OrderStatusEnum.NEW;

    const order = await this.depositPendingOrderService.create(
      orderCreate,
      transaction ? { transaction } : null
    );

    return order;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Create Deposit Pending Order By DepositRequest
  ////////////////////////////////////////////////////////////////////////////////
  protected async createOrderBeforeDepositByCard(
    request: PaymentDepositByCardRequest,
    paymentProviderChannel: PaymentProviderChannelModel,
    paymentProviderCard: PaymentProviderCardModel,
    transaction: Transaction
  ): Promise<DepositPendingOrderModel> {
    // const orderAlready = await this.depositOrderService.findByHash(
    //   request.hash
    // );

    // const pendingOrderAlready = await this.depositPendingOrderService.findByHash(
    //   request.hash
    // );

    const orderCreate = new DepositPendingOrderCreateDto();

    orderCreate.orderId =
      `${(numeral(Math.random().toString(10).substr(2, 1)).value() % 9) + 1}` +
      `${Math.random().toString(10).substr(2, 7)}`;

    orderCreate.amount = request.amount;
    orderCreate.channelId = paymentProviderChannel.channelId;
    orderCreate.userId = `${request.userId}`;

    orderCreate.paymentProviderId = this.getPaymentProviderId();
    orderCreate.paymentProviderChannelId = paymentProviderChannel.id;

    orderCreate.status = OrderStatusEnum.WAITINGPAID;

    orderCreate.userName = request.userName;
    orderCreate.last4Digit = request.last4Digit;
    orderCreate.paymentProviderCardId = paymentProviderCard.id;
    //orderCreate.hash = request.hash;

    const order = await this.depositPendingOrderService.create(
      orderCreate,
      transaction ? { transaction } : null
    );

    return order;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Update Deposit Order After Deposit
  ////////////////////////////////////////////////////////////////////////////////
  async updateOrderAfterDeposit(
    order: DepositPendingOrderModel,
    depositResult: PaymentProviderChannelDepositResult,
    transaction: Transaction
  ) {
    if (!depositResult.result) {
      order.status = OrderStatusEnum.FAILED;
      order.errorCode = depositResult.errorCode;
      order.errorMessage = depositResult.errorMessage;
    } else {
      order.status = OrderStatusEnum.WAITINGPAID;
      order.providerOrderId = depositResult.providerOrderId;
    }

    return await this.depositPendingOrderService.update(
      order,
      transaction ? { transaction } : null
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Update/Remove Pending Deposit
  /// And Create New Deosit Order After DepositCallback
  ////////////////////////////////////////////////////////////////////////////////
  async updateOrderAfterDepositCallback(
    order: DepositPendingOrderModel,
    transaction: Transaction
  ) {
    if (order.status === OrderStatusEnum.SUCCESS) {
      const orderCreate = this.buildDepositOrderCreateByPendingOrder(order);

      await this.depositPendingOrderService.destroy(
        order,
        transaction ? { transaction } : null
      );

      await this.depositOrderService.create(
        orderCreate,
        transaction ? { transaction } : null
      );
    } else {
      await this.depositPendingOrderService.update(
        order,
        transaction ? { transaction } : null
      );
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Create New Pending Withdraw Order
  ////////////////////////////////////////////////////////////////////////////////
  async createOrderBeforeWithdraw(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    transaction: Transaction
  ): Promise<WithdrawPendingOrderModel> {
    const orderCreate = new WithdrawPendingOrderCreateDto();

    orderCreate.orderId =
      `${(numeral(Math.random().toString(10).substr(2, 1)).value() % 9) + 1}` +
      `${Math.random().toString(10).substr(2, 7)}`;

    orderCreate.paymentProviderId = this.getPaymentProviderId();
    orderCreate.userId = withdrawRequest.userId;
    orderCreate.clientOrderId = withdrawRequest.orderId;
    orderCreate.currency = withdrawRequest.currency;
    orderCreate.amount = withdrawRequest.amount;
    orderCreate.hashcode = withdrawRequest.hashcode;

    const bank = await this.bankService.findOne({
      where: { bankCode: withdrawRequest.bankCode },
    });
    if (!bank) {
      return null;
    }
    orderCreate.bankId = bank.id;

    orderCreate.bankAccountName = withdrawRequest.bankAccountName;
    orderCreate.bankAccountNumber = withdrawRequest.bankAccountNumber;
    orderCreate.province = withdrawRequest.province;
    orderCreate.city = withdrawRequest.city;
    orderCreate.branch = withdrawRequest.branch;
    orderCreate.userName = withdrawRequest.userName;
    orderCreate.countryCallingCode = withdrawRequest.countryCallingCode;
    orderCreate.phoneNumber = withdrawRequest.phoneNumber;
    orderCreate.status = OrderStatusEnum.NEW;

    return await this.withdrawPendingOrderService.create(
      orderCreate,
      transaction ? { transaction } : null
    );
  }

  static async createPendingWithdrawOrderByRequest(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    options: {
      bankService: BankService;
      withdrawPendingOrderService: WithdrawPendingOrderService;
    }
  ) {
    const orderCreate = new WithdrawPendingOrderCreateDto();

    orderCreate.orderId =
      `${(numeral(Math.random().toString(10).substr(2, 1)).value() % 9) + 1}` +
      `${Math.random().toString(10).substr(2, 7)}`;

    orderCreate.paymentProviderId = null;
    orderCreate.userId = withdrawRequest.userId;
    orderCreate.clientOrderId = withdrawRequest.orderId;
    orderCreate.currency = withdrawRequest.currency;
    orderCreate.amount = withdrawRequest.amount;
    orderCreate.hashcode = withdrawRequest.hashcode;

    const bank = await options.bankService.findOne({
      where: { bankCode: withdrawRequest.bankCode },
    });
    if (!bank) {
      return null;
    }
    orderCreate.bankId = bank.id;

    orderCreate.bankAccountName = withdrawRequest.bankAccountName;
    orderCreate.bankAccountNumber = withdrawRequest.bankAccountNumber;
    orderCreate.province = withdrawRequest.province;
    orderCreate.city = withdrawRequest.city;
    orderCreate.branch = withdrawRequest.branch;
    orderCreate.userName = withdrawRequest.userName;
    orderCreate.countryCallingCode = withdrawRequest.countryCallingCode;
    orderCreate.phoneNumber = withdrawRequest.phoneNumber;
    orderCreate.status = OrderStatusEnum.NEW;

    return await options.withdrawPendingOrderService.create(orderCreate, null);
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Update Pending Withdraw Order After Withdraw
  ////////////////////////////////////////////////////////////////////////////////
  async updateOrderAfterWithdraw(
    order: WithdrawPendingOrderModel,
    withdrawResult: PaymentProviderChannelWithdrawResult,
    transaction: Transaction
  ) {
    if (!withdrawResult.result) {
      order.status = OrderStatusEnum.FAILED;
      order.errorCode = withdrawResult.errorCode;
      order.errorMessage = withdrawResult.errorMessage;
    } else {
      order.status = this.paymentProviderEntity.isOnlyCardSupport
        ? OrderStatusEnum.WAITINGPAID
        : OrderStatusEnum.PENDING;
      order.providerOrderId = withdrawResult.providerId;
    }

    return await this.withdrawPendingOrderService.update(
      order,
      transaction ? { transaction } : null
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Update/Remove Pending Withdraw
  /// And Create New Withdraw Order After WithdrawCallback
  ////////////////////////////////////////////////////////////////////////////////
  async updateOrderAfterWithdrawCallback(
    order: WithdrawPendingOrderModel,
    transaction: Transaction
  ) {
    if (order.status === OrderStatusEnum.SUCCESS) {
      const orderCreate = this.buildWithdrawOrderCreateByPendingOrder(order);

      this.withdrawPendingOrderService.destroy(
        order,
        transaction ? { transaction } : null
      );

      await this.withdrawOrderService.create(
        orderCreate,
        transaction ? { transaction } : null
      );
    } else {
      await this.withdrawPendingOrderService.update(
        order,
        transaction ? { transaction } : null
      );
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Build Withdraw Order Create By Pending Order
  ////////////////////////////////////////////////////////////////////////////////
  private buildWithdrawOrderCreateByPendingOrder(
    order: WithdrawPendingOrderModel
  ): WithdrawOrderCreateDto {
    const orderCreate: WithdrawOrderCreateDto = new WithdrawOrderCreateDto();

    orderCreate.orderId = order.orderId;
    orderCreate.userId = order.userId;
    orderCreate.clientOrderId = order.clientOrderId;
    orderCreate.amount = order.amount;
    orderCreate.providerOrderId = order.providerOrderId;
    orderCreate.paymentProviderId = order.paymentProviderId;
    orderCreate.hashcode = order.hashcode;
    orderCreate.currency = order.currency;
    orderCreate.status = order.status;
    orderCreate.date = order.date;
    orderCreate.bankId = order.bankId;
    orderCreate.bankAccountName = order.bankAccountName;
    orderCreate.bankAccountNumber = order.bankAccountNumber;
    orderCreate.province = order.province;
    orderCreate.city = order.city;
    orderCreate.currency = order.currency;
    orderCreate.userName = order.userName;
    orderCreate.countryCallingCode = order.countryCallingCode;
    orderCreate.phoneNumber = order.phoneNumber;
    orderCreate.branch = order.branch;

    return orderCreate;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Build Deposit Order Create By Pending Order
  ////////////////////////////////////////////////////////////////////////////////
  private buildDepositOrderCreateByPendingOrder(
    order: DepositPendingOrderModel
  ): DepositOrderCreateDto {
    const orderCreate = new DepositOrderCreateDto();

    orderCreate.orderId = order.orderId;
    orderCreate.userId = order.userId;
    orderCreate.amount = order.amount;
    orderCreate.usdtExchangeRate = order.usdtExchangeRate;
    orderCreate.status = order.status;
    orderCreate.providerOrderId = order.providerOrderId;
    orderCreate.channelId = order.channelId;
    orderCreate.date = order.date;
    orderCreate.paymentProviderId = order.paymentProviderId;
    orderCreate.paymentProviderChannelId = order.paymentProviderChannelId;
    orderCreate.paymentProviderCardId = order.paymentProviderCardId;
    orderCreate.userName = order.userName;
    orderCreate.last4Digit = order.last4Digit;
    orderCreate.hash = order.hash;

    return orderCreate;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Sync BetConsruct After DepositCallback
  ////////////////////////////////////////////////////////////////////////////////
  async depositBCAfterDepositCallback(
    order: DepositPendingOrderModel
  ): Promise<BcOrdersModel> {
    const params = new BCDepositInParams();
    params.userId = numeral(order.userId).value();
    params.orderId = numeral(order.orderId).value();
    params.amount = numeral(order.amount).value();
    params.currency = CurrencyEnum[CurrencyEnum.CNY];

    const bcOrder = await this.betConstructService.addDepositBcOrder(params);

    return bcOrder;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Sync BetConsruct After WithdrawCallback
  ////////////////////////////////////////////////////////////////////////////////
  async withdrawBCAfterWithdrawCallback(
    order: WithdrawPendingOrderModel
  ): Promise<BcOrdersModel> {
    const params = new BCWithdrawInParams();

    params.userId = numeral(order.userId).value();
    params.orderId = numeral(order.clientOrderId).value();
    params.amount = order.amount;
    params.currency = order.currency;
    params.reason = this.configService.get<string>(
      'betConstruct.withdraw.reason'
    );
    params.status = this.betConstructService.getBCWithdrawStatusByOrderStatus(
      <OrderStatusEnum>order.status
    );

    const bcOrder = await this.betConstructService.addWithdrawBcOrder(params);

    return bcOrder;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Before DepositCallback
  ////////////////////////////////////////////////////////////////////////////////
  async beforeDepositCallback(
    statusResponse: PaymentStatusResponseDto,
    ip: string
  ): Promise<boolean> {
    if (!this.checkIpWhiteList(ip)) {
      return false;
    }

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Before DepositCallback
  ////////////////////////////////////////////////////////////////////////////////
  async beforeWithdrawCallback(
    statusResponse: PaymentStatusResponseDto,
    ip: string
  ): Promise<boolean> {
    if (!this.checkIpWhiteList(ip)) {
      return false;
    }

    return true;
  }

  protected checkIpWhiteList(ip: string): boolean {
    const providerName = this.getPaymentProviderName();
    const ipWhiteListEnable = numeral(
      this.configService.get<string>(`${providerName}_IP_WHITELIST_ENABLE`)
    ).value();

    if (ipWhiteListEnable !== 1) {
      return true;
    }

    const ipWhiteList = this.configService.get<string>(
      `${providerName}_IP_WHITELIST`
    );

    const ips = ipWhiteList.split(',') || [];
    const ipMatched = ips.find((_ip) => _ip.trim() === ip);

    return ipMatched ? true : false;
  }
}
