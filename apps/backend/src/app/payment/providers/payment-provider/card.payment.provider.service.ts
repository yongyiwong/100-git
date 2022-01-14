import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import {
  PaymentSystemEnum,
  OrderStatusEnum,
  PaymentProviderEnum,
} from '@workspace/enums';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { BankModel } from '../../../models/bank.entity';
import { PaymentProviderChannelModel } from '../../../models/payment.provider.channel.model';
import { TestModel } from '../../../models/test.entity';
import { BankService } from '../../bank/bank.service';
import { BetConstructService } from '../../betContruct/betConstruct.service';
import { ChannelService } from '../../channel/channel.service';
import { PaymentDepositByCardRequest } from '../../interface/payment.deposit.bycard.request';
import { DepositOrderService } from '../../order/deposit-order/deposit.order.service';
import { DepositPendingOrderService } from '../../order/deposit-pending-order/deposit.pending.order.service';
import { WithdrawOrderService } from '../../order/withdraw-order/withdraw.order.service';
import { WithdrawPendingOrderService } from '../../order/withdraw-pending-order/withdraw.pending.order.service';
import { PaymentProviderBankService } from '../payment-provider-bank/payment.provider.bank.service';
import { PaymentProviderCardService } from '../payment-provider-card/payment.provider.card.service';
import { PaymentProviderChannelService } from '../payment-provider-channel/payment.provider.channel.service';
import { PaymentProviderEntityService } from '../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderSharedService } from '../payment-provider-shared/payment.provider.shared.service';
import {
  CardChannelDepositResult,
  CardDepositResultData,
} from './dto/card.deposit.result';
import { PaymentProviderDepositRequestDto } from './payment.provider.deposit.request.dto';
import {
  PaymentProviderDepositResult,
  PaymentProviderChannelDepositResult,
} from './payment.provider.deposit.result';
import {
  PaymentProviderService,
  PaymentProviderChannelDepositResultBundle,
  PaymentProviderChannelWithdrawResultBundle,
} from './payment.provider.service';
import { PaymentProviderWithdrawRequestDto } from './payment.provider.withdraw.request.dto';
import {
  PaymentProviderWithdrawResult,
  PaymentProviderChannelWithdrawResult,
} from './payment.provider.withdraw.result';
import * as crypto from 'crypto';
import { CardDepositByCardResult } from './dto/card.deposit.bycard.deposit.result';
import { CardChannelWithdrawResult } from './dto/card.withdraw.result';
import { PaymentProviderUsdtProtoService } from '../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { PaymentProviderUsdtProtocolModel } from '../../../models/payment.provider.usdt.protocol.model';
import { OptionsService } from '../../../options/options.service';

@Injectable()
export class CardPaymentProviderService extends PaymentProviderService {
  constructor(
    //protected bankRepository: typeof BankModel,
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
    protected httpService: HttpService //protected testRepository: typeof TestModel
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

    //this.bankRepository.find
  }

  getPaymentProviderEnum(): PaymentProviderEnum {
    return null;
  }
  async isAvailable(): Promise<boolean> {
    return true;
  }

  public async depositByPaymentProviderChannel(
    depositRequest: PaymentProviderDepositRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    paymentProviderUsdtProto: PaymentProviderUsdtProtocolModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelDepositResultBundle> {
    let depositResult: CardChannelDepositResult;
    const channelDepositResultBundle = new PaymentProviderChannelDepositResultBundle();

    const paymentProviderCards = await this.paymentProviderCardService.findActiveByDateAndAmount(
      {
        day: moment().utcOffset('+08:00').format('MM/DD/YYYY'),
        amount: `${depositRequest.amount}`,
        providerId: this.getPaymentProviderId(),
      }
    );

    if (!paymentProviderCards || paymentProviderCards.length < 1) {
      depositResult = CardChannelDepositResult.errorFactory(
        {
          code: 101,
          message: 'No Provider Cards',
          error: null,
        },
        this.getPaymentProviderName()
      );
      channelDepositResultBundle.depositResult = depositResult;
      return channelDepositResultBundle;
    }

    depositResult = new CardChannelDepositResult();
    depositResult.providerName = this.getPaymentProviderName();

    try {
      const paymentProviderCard = paymentProviderCards[0];
      const amount = depositRequest.amount;
      const userId = depositRequest.userId;

      const iv = crypto.randomBytes(16);
      const password = this.configService.get<string>('DEPOSIT_KEY');
      const key = Buffer.from(password);
      const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);

      const txtSrc = JSON.stringify({
        paymentProviderId: paymentProviderCard.paymentProviderId,
        amount,
        userId,
      });

      let encDst = cipher.update(txtSrc, 'utf8', 'base64');
      encDst += cipher.final('base64');

      const url =
        `${environment.settings.baseUrl}/dashboard/bank-account-details/` +
        `${encodeURIComponent(encDst)}/` +
        `${encodeURIComponent(iv.toString('base64'))}`;

      depositResult.result = true;
      depositResult.data = new CardDepositResultData();
      depositResult.data.url = url;
    } catch (error) {
      depositResult = CardChannelDepositResult.errorFactory(
        {
          code: 102,
          message: 'unknown',
          error: error,
        },
        this.getPaymentProviderName()
      );
    }

    channelDepositResultBundle.depositResult = depositResult;

    return channelDepositResultBundle;
  }

  public async depositByCard(request: PaymentDepositByCardRequest) {
    const result = new CardDepositByCardResult();

    const paymentProviderChannels = await this.paymentProviderChannelService.getDepositablesByPaymentSystem(
      PaymentSystemEnum.BANK,
      this.getPaymentProviderId(),
      request.amount
    );

    if (!paymentProviderChannels || paymentProviderChannels.length < 1) {
      result.result = false;
      result.errorCode = 201;
      result.errorMessage = 'No Provider Channels';
      return result;
    }

    const paymentProviderChannel = paymentProviderChannels[0];

    const paymentProviderCards = await this.paymentProviderCardService.findActiveByDateAndAmount(
      {
        day: moment().utcOffset('+08:00').format('MM/DD/YYYY'),
        amount: `${request.amount}`,
        providerId: this.getPaymentProviderId(),
      }
    );

    if (!paymentProviderCards || paymentProviderCards.length < 1) {
      result.result = false;
      result.errorCode = 202;
      result.errorMessage = 'No Provider Cards';
      return result;
    }

    const paymentProviderCard = paymentProviderCards[0];

    const order = await this.createOrderBeforeDepositByCard(
      request,
      paymentProviderChannel,
      paymentProviderCard,
      null
    );
    if (!order) {
      return null;
    }

    result.result = true;
    result.bankInfo = {
      bankAccountName: paymentProviderCard.bankAccountName,
      bankAccountNumber: paymentProviderCard.bankAccountNumber,
      bank: {
        bankName: paymentProviderCard.bank.bankName,
        bankCode: paymentProviderCard.bank.bankCode,
      },
      amount: request.amount,
    };

    return result;
  }

  public async withdrawByPaymentProviderChannel(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelWithdrawResultBundle> {
    const withdrawProcResult = new PaymentProviderChannelWithdrawResultBundle();

    let withdrawResult: CardChannelWithdrawResult;

    const order = await this.createOrderBeforeWithdraw(
      withdrawRequest,
      transaction
    );

    // const paymentProviderBank = await this.getPaymentProviderBank(
    //   withdrawRequest.bankCode
    // );
    // if (!paymentProviderBank) {
    //   withdrawResult.errorCode = '301';
    //   withdrawResult.errorMessage = 'No Payment Provider Bank';
    // }

    withdrawResult = new CardChannelWithdrawResult();
    withdrawResult.result = true;
    withdrawResult.providerName = this.getPaymentProviderName();

    withdrawProcResult.withdrawResult = withdrawResult;
    withdrawProcResult.order = order;

    return withdrawProcResult;
  }

  public depositErrorFactory(error: any): PaymentProviderDepositResult {
    return null;
  }

  public withdrawErrorFactory(error: any): PaymentProviderWithdrawResult {
    return null;
  }

  getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum {
    return null;
  }

  getOrderStatusByWithdrawStatus(argWithdrawStatus: {}): OrderStatusEnum {
    return null;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Frozen Status By Channel DepositResult
  ////////////////////////////////////////////////////////////////////////////////
  protected getFrozenByChannelDepositResult(
    paymentProviderChannel: PaymentProviderChannelModel,
    depositRequest: PaymentProviderDepositRequestDto,
    depositResult: PaymentProviderChannelDepositResult
  ): boolean {
    return false;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Frozen Status By Channel WithdrawResult
  ////////////////////////////////////////////////////////////////////////////////
  protected getFrozenByChannelWithdrawResult(
    withdrawResult: PaymentProviderChannelWithdrawResult
  ): boolean {
    return false;
  }
}
