import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ChannelModel } from '../../models/channel.model';
import { PaymentProviderChannelModel } from '../../models/payment.provider.channel.model';
import { PaymentProviderEntityModel } from '../../models/payment.provider.entity.model';
import { PaymentSystemModel } from '../../models/payment.system.model';
import { DepositOrWithdrawalEnum } from '../providers/payment-provider-channel/payment.provider.channel.service';
import * as moment from 'moment-timezone';
import * as numeral from 'numeral';
import { DepositablePaymentSystem } from '../dto/depositable.paymentsystem';
import { PaymentSystemLocaleModel } from '../../models/payment.system.locale.model';

@Injectable()
export class PaymentSystemService {
  constructor(
    @InjectModel(PaymentSystemModel)
    private paymentSystemRepository: typeof PaymentSystemModel,

    @InjectModel(PaymentSystemLocaleModel)
    private paymentSystemLocaleRepository: typeof PaymentSystemLocaleModel,

    private configService: ConfigService,
    private sequelize: Sequelize
  ) {}

  public async getDepositables(
    frozenRestrict: boolean
  ): Promise<DepositablePaymentSystem[]> {
    const depositablePaymentSystems: DepositablePaymentSystem[] = [];

    let sqlFrozenFlexible = ``;

    if (!frozenRestrict) {
      const frozenPeriod = this.configService.get<number>('FROZEN_PERIOD');
      const frozenPeriodBegin = moment()
        .subtract(frozenPeriod, 'minutes')
        .format();
      const frozenPeriodEnd = moment().add(frozenPeriod, 'minutes').format();
      //sqlFrozenFlexible = `and ( not "channels->paymentProviderChannels"."isFrozen" or "channels->paymentProviderChannels"."frozenCheckedDate" not between '${frozenPeriodBegin}' and '${frozenPeriodEnd}' )`;
      sqlFrozenFlexible = `and ( not "ppc"."isFrozen" or "ppc"."frozenCheckedDate" not between '${frozenPeriodBegin}' and '${frozenPeriodEnd}' )`;
    } else {
      //sqlFrozenFlexible = `and not "channels->paymentProviderChannels"."isFrozen"`;
      sqlFrozenFlexible = `and not "ppc"."isFrozen"`;
    }

    //const sqlIsAvailable = `"channels->paymentProviderChannels->paymentProvider"."isDepositSupport" and "channels->paymentProviderChannels"."isAvailable" ${sqlFrozenFlexible}`;
    const sqlIsAvailable = `"pp"."isDepositSupport" and "ppc"."isActive" and "ppc"."isAvailable" ${sqlFrozenFlexible}`;

    // const items = await this.paymentSystemRepository.findAll({
    //   attributes: [
    //     'PaymentSystemModel.id',
    //     'paymentSystemName',
    //     [Sequelize.literal(`bool_or(${sqlIsAvailable})`), 'isAvailable'],
    //     [
    //       Sequelize.literal(
    //         `min(case when (${sqlIsAvailable}) then "channels->paymentProviderChannels"."providerMinAmount" end)`
    //       ),
    //       'minAmount',
    //     ],
    //     [
    //       Sequelize.literal(
    //         `max(case when (${sqlIsAvailable}) then "channels->paymentProviderChannels"."providerMaxAmount" end)`
    //       ),
    //       'maxAmount',
    //     ],
    //   ],
    //   include: [
    //     {
    //       model: ChannelModel,
    //       as: 'channels',
    //       attributes: [],
    //       include: [
    //         {
    //           model: PaymentProviderChannelModel,
    //           as: 'paymentProviderChannels',
    //           attributes: [],
    //           include: [
    //             {
    //               model: PaymentProviderEntityModel,
    //               as: 'paymentProvider',
    //               attributes: [],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    //   where: {
    //     '$channels.depositOrWithdrawable$': DepositOrWithdrawalEnum.DEPOSIT,
    //   },
    //   group: ['PaymentSystemModel.id'],
    //   raw: true,
    // });

    const sql = `
      select 
        ps.id , ps."paymentSystemName" , 
        bool_or(${sqlIsAvailable}) "isAvailable",
        min(case when (${sqlIsAvailable}) then "ppc"."providerMinAmount" end) "minAmount",
        max(case when (${sqlIsAvailable}) then "ppc"."providerMaxAmount" end) "maxAmount"
      from "paymentSystem" ps 
      left join channel c on ps.id  = c."fromPaymentSystemId" 
      left join "paymentProviderChannel" ppc on c.id = ppc."channelId" 
      left join "paymentProviders" pp on ppc."paymentProviderId" = pp .id 
      where c."depositOrWithdrawable" = ${DepositOrWithdrawalEnum.DEPOSIT}
      group by ps.id `;

    const items = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    for (let i = 0; i < items.length; i++) {
      const item = <
        {
          id: number;
          paymentSystemName: string;
          isAvailable: boolean;
          minAmount: string;
          maxAmount: string;
        }
      >(<unknown>items[i]);

      const depositablePaymentSystem = new DepositablePaymentSystem();

      depositablePaymentSystem.id = item.id;
      depositablePaymentSystem.paymentMethodName = item.paymentSystemName;
      depositablePaymentSystem.isAvailable = item.isAvailable;
      depositablePaymentSystem.minAmount = numeral(item.minAmount).value();
      depositablePaymentSystem.maxAmount = numeral(item.maxAmount).value();

      const paymentSystemLocales = await this.paymentSystemLocaleRepository.findAll(
        {
          where: {
            paymentSystemId: item.id,
          },
          include: ['locale'],
        }
      );

      const locales: { [key: string]: string } = {};
      paymentSystemLocales.forEach((paymentSystemLocale) => {
        locales[paymentSystemLocale.locale.localeName] =
          paymentSystemLocale.label;
      });

      depositablePaymentSystem.locales = locales;

      depositablePaymentSystems.push(depositablePaymentSystem);
    }

    return depositablePaymentSystems;
  }
}
