import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FindOptions } from 'sequelize/types';
import { QueryTypes } from 'sequelize';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { PaymentProviderCardService } from '../payment-provider-card/payment.provider.card.service';
import {
  DepositOrWithdrawalEnum,
  PaymentProviderChannelService,
} from '../payment-provider-channel/payment.provider.channel.service';
import { ChannelModel } from '../../../models/channel.model';
import { PaymentSystemModel } from '../../../models/payment.system.model';
import * as numeral from 'numeral';
import { PaymentProviderChannelModel } from '../../../models/payment.provider.channel.model';
import { PaymentProviderCardModel } from '../../../models/payment.provider.card.model';
import { PaymentProviderCardMinMaxAmount } from '../payment-provider-card/interface/payment.provider.card.minmaxamont';
import { Transaction } from 'sequelize';

@Injectable()
export class PaymentProviderSharedService {
  constructor(
    private sequelize: Sequelize,

    @InjectModel(PaymentProviderChannelModel)
    private paymentProviderChannelRepository: typeof PaymentProviderChannelModel,

    @InjectModel(PaymentProviderCardModel)
    private pyamentProviderCardRepository: typeof PaymentProviderCardModel
  ) {}

  /**
   * Get Min, Max Value
   */
  public async getMinMaxAmountByProvider(
    paymentProviderId: number,
    options?: {
      transaction: Transaction;
    }
  ) {
    const transaction =
      options && options.transaction ? options.transaction : null;

    const items = await this.sequelize.query(
      `select 
            min(ppc."minAmount") "minAmount" , max(ppc."maxAmount") "maxAmount" 
          from "paymentProviderCard" ppc 
          where ppc."paymentProviderId" = ${paymentProviderId} and ppc.active`,
      { type: QueryTypes.SELECT, transaction: transaction }
    );

    const item = <PaymentProviderCardMinMaxAmount>items[0];

    return item;
  }

  public async uptodateChannelMinMaxAmountForCardProvider(
    paymentProviderId: number,
    options?: {
      transaction: Transaction;
    }
  ) {
    const transaction =
      options && options.transaction ? options.transaction : null;

    const minMaxAmount = await this.getMinMaxAmountByProvider(
      paymentProviderId,
      transaction ? { transaction } : null
    );

    const ppcs = await this.paymentProviderChannelRepository.findAll({
      include: [
        {
          model: ChannelModel,
          as: 'channel',
          include: [
            { model: PaymentSystemModel, as: 'fromPaymentSystem' },
            { model: PaymentSystemModel, as: 'toPaymentSystem' },
          ],
        },
      ],
      where: {
        paymentProviderId,
        '$channel.fromPaymentSystem.isBank$': true,
        '$channel.toPaymentSystem.isBank$': true,
        '$channel.depositOrWithdrawable$': DepositOrWithdrawalEnum.DEPOSIT,
      },
    });

    if (!ppcs || ppcs.length < 1) {
      return;
    }

    const paymentProviderChannel = ppcs[0];

    paymentProviderChannel.providerMinAmount =
      numeral(minMaxAmount.minAmount).value() || null;
    paymentProviderChannel.providerMaxAmount =
      numeral(minMaxAmount.maxAmount).value() || null;

    await paymentProviderChannel.save(transaction ? { transaction } : null);
  }
}
