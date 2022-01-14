import { PaymentProviderEnum } from '@workspace/enums';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
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
import { BankModel } from '../../../../models/bank.entity';

import { TestModel } from '../../../../models/test.entity';
import { BankService } from '../../../bank/bank.service';
import { PaymentProviderCardService } from '../../payment-provider-card/payment.provider.card.service';
import { PaymentProviderEntityService } from '../../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderSharedService } from '../../payment-provider-shared/payment.provider.shared.service';

import { CardPaymentProviderService } from '../card.payment.provider.service';
import { PaymentProviderUsdtProtoService } from '../../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { OptionsService } from '../../../../options/options.service';

@Injectable()
export class DBPayPaymentProviderService extends CardPaymentProviderService {
  constructor(
    // @InjectModel(BankModel)
    // protected bankRepository: typeof BankModel,

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
    protected httpService: HttpService // @InjectModel(TestModel) // protected testRepository: typeof TestModel
  ) {
    super(
      //bankRepository,
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
      optionsService,
      httpService
      //testRepository
    );
  }

  getPaymentProviderEnum(): PaymentProviderEnum {
    return PaymentProviderEnum.DBPay;
  }
}
