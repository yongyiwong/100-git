import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, QueryTypes, SaveOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { WithdrawableBank } from '../../dto/withdrawable.banks';
import * as moment from 'moment-timezone';
import * as numeral from 'numeral';
import { DepositOrWithdrawalEnum } from '../payment-provider-channel/payment.provider.channel.service';
import { BankModel } from '../../../models/bank.entity';
import { PaymentProviderBankModel } from '../../../models/payment.provider.bank.entity';
import { ConfigService } from '@nestjs/config';
import { PaymentProviderBankGetRequestDto } from './dto/payment.provider.bank.get.request.dto';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { ChannelModel } from '../../../models/channel.model';
import { PaymentProviderBankUpdateRequestDto } from './dto/payment.provider.bank.update.request.dto';
import { PaymentProviderBankUpdateResponseDto } from './dto/payment.provider.bank.update.response.dto';
import { UpdatePaymentProviderBankDto } from './dto/update-payment.provider.bank.dto';

@Injectable()
export class PaymentProviderBankService {
  constructor(
    @InjectModel(PaymentProviderBankModel)
    private pyamentProviderBankRepository: typeof PaymentProviderBankModel,

    @InjectModel(BankModel)
    private bankRepository: typeof BankModel,

    private sequelize: Sequelize,
    private configService: ConfigService
  ) {}

  public async get(
    paymentProviderId: number,
    bankId: number
  ): Promise<PaymentProviderBankModel> {
    return await this.pyamentProviderBankRepository.findOne({
      where: {
        bankId,
        paymentProviderId,
      },
    });
  }

  async update(
    paymentProviderChannel: PaymentProviderBankModel,
    options: SaveOptions
  ): Promise<PaymentProviderBankModel> {
    return await paymentProviderChannel.save(options);
  }

  async updateByRequest(
    updateRequest: PaymentProviderBankUpdateRequestDto
  ): Promise<PaymentProviderBankUpdateResponseDto> {
    const response = new PaymentProviderBankUpdateResponseDto();

    for (let i = 0; i < updateRequest.paymentProviderBanks.length; i++) {
      const requestItem = updateRequest.paymentProviderBanks[i];

      const paymentProviderChannel = await this.pyamentProviderBankRepository.findByPk(
        requestItem.id
      );

      if (!paymentProviderChannel) {
        continue;
      }

      const paymentProviderChannelUpdated = UpdatePaymentProviderBankDto.updateRequestFactory(
        paymentProviderChannel,
        requestItem
      );

      await paymentProviderChannelUpdated.save();
    }

    response.result = true;
    return response;
  }

  public async findAll(options?: FindOptions) {
    return await this.pyamentProviderBankRepository.findAll(options);
  }

  public async findAllByQuery(query: PaymentProviderBankGetRequestDto) {
    const findOptions: FindOptions = {
        include: [
          { model: PaymentProviderEntityModel, as: 'paymentProvider' },
          { model: BankModel, as: 'bank' },
        ],
        order: [
          ['paymentProviderId', 'asc'],
          ['bankId', 'asc'],
        ],
      },
      where: {} = {};

    if (query.paymentProviderId !== undefined) {
      where['paymentProviderId'] = query.paymentProviderId;
    }

    findOptions.where = where;

    return this.pyamentProviderBankRepository.findAll(findOptions);
  }

  public async getWithdrawableBanks(
    frozenRestrict?: boolean
  ): Promise<WithdrawableBank[]> {
    const withdrawableBanks: WithdrawableBank[] = [];

    let sqlFrozenFlexible = ``;

    // if (!frozenRestrict) {
    //   const frozenPeriod = this.configService.get<number>('FROZEN_PERIOD');
    //   const frozenPeriodBegin = moment()
    //     .subtract(frozenPeriod, 'minutes')
    //     .format();
    //   const frozenPeriodEnd = moment().add(frozenPeriod, 'minutes').format();
    //   sqlFrozenFlexible = `and ( not ppc."isFrozen" or ppc."frozenCheckedDate" between '${frozenPeriodBegin}' and '${frozenPeriodEnd}')`;
    // } else {
    //   sqlFrozenFlexible = `and not ppc."isFrozen"`;
    // }

    const sqlIsAvailable = `pp."isWithdrawalSupport" and ppc."isActive" and ppc."isAvailable" ${sqlFrozenFlexible}`;

    const sql = `
        select
            b.id as "bankId",
            b."bankCode" ,
            b."bankName" ,
            bool_or(${sqlIsAvailable}) "isAvailable" ,
            min(case when (${sqlIsAvailable}) then ppc."providerMinAmount" end)  "minAmount",
            min(case when (${sqlIsAvailable}) then ppc."providerMaxAmount" end)  "maxAmount"
          from bank b 
          left join "paymentProviderBank" ppb on b.id = ppb."bankId" 
          left join "paymentProviders" pp on ppb."paymentProviderId" = pp.id 
          left join "paymentProviderChannel" ppc on pp.id  = ppc."paymentProviderId"
          left join channel c on ppc."channelId"  = c.id 
          where c."depositOrWithdrawable" = ${DepositOrWithdrawalEnum.WITHDRAWAL}
          group by b.id 
          order by b.id `;

    const bankItmes = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    for (let i = 0; i < bankItmes.length; i++) {
      const bankItem = <
        {
          bankId: number;
          bankCode: string;
          bankName: string;
          isAvailable: boolean;
          minAmount: string;
          maxAmount: string;
        }
      >bankItmes[i];

      const withdrawableBank = new WithdrawableBank();

      withdrawableBank.bankId = bankItem.bankId;
      withdrawableBank.minAmount = numeral(bankItem.minAmount).value();
      withdrawableBank.maxAmount = numeral(bankItem.maxAmount).value();
      withdrawableBank.isAvailable = bankItem.isAvailable;
      withdrawableBank.bankCode = bankItem.bankCode;
      withdrawableBank.bankName = bankItem.bankName;

      withdrawableBanks.push(withdrawableBank);
    }

    return withdrawableBanks;
  }
}
