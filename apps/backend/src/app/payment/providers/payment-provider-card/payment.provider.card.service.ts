import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Op, QueryTypes, SaveOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { WithdrawableBank } from '../../dto/withdrawable.banks';
import * as moment from 'moment-timezone';
import * as numeral from 'numeral';
import { DepositOrWithdrawalEnum } from '../payment-provider-channel/payment.provider.channel.service';
import { BankModel } from '../../../models/bank.entity';
import { PaymentProviderCardModel } from '../../../models/payment.provider.card.model';
import { ConfigService } from '@nestjs/config';
import { PaymentProviderCardGetRequestDto } from './dto/payment.provider.card.get.request.dto';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { ChannelModel } from '../../../models/channel.model';
import { PaymentProviderCardUpdateRequestDto } from './dto/payment.provider.card.update.request.dto';
import { PaymentProviderCardUpdateResponseDto } from './dto/payment.provider.card.update.response.dto';
import { UpdatePaymentProviderCardDto } from './dto/update-payment.provider.card.dto';
import { PaymentProviderCardCreateRequestDto } from './dto/payment.provider.card.create.request.dto';
import { PaymentProviderCardCreateResponseDto } from './dto/payment.provider.card.create.response.dto';
import { CreatePaymentProviderCardDto } from './dto/create-payment.provider.card.dto';
import { PaymentProviderCardDeleteRequestDto } from './dto/payment.provider.card.delete.request.dto';
import { PaymentProviderCardDeleteResponseDto } from './dto/payment.provider.card.delete.response.dto';
import { PaymentProviderCardMinMaxAmount } from './interface/payment.provider.card.minmaxamont';
import { PaymentProviderSharedService } from '../payment-provider-shared/payment.provider.shared.service';

@Injectable()
export class PaymentProviderCardService {
  constructor(
    @InjectModel(PaymentProviderCardModel)
    private pyamentProviderCardRepository: typeof PaymentProviderCardModel,

    @InjectModel(BankModel)
    private bankRepository: typeof BankModel,

    private sequelize: Sequelize,
    private configService: ConfigService,

    private paymentProviderSharedService: PaymentProviderSharedService
  ) {}

  public async get(
    paymentProviderId: number,
    bankId: number
  ): Promise<PaymentProviderCardModel> {
    return await this.pyamentProviderCardRepository.findOne({
      where: {
        bankId,
        paymentProviderId,
      },
    });
  }

  async updateByRequest(
    updateRequest: PaymentProviderCardUpdateRequestDto
  ): Promise<PaymentProviderCardUpdateResponseDto> {
    const response = new PaymentProviderCardUpdateResponseDto();

    try {
      await this.sequelize.transaction(async (transaction) => {
        for (let i = 0; i < updateRequest.paymentProviderCards.length; i++) {
          const requestItem = updateRequest.paymentProviderCards[i];

          const paymentProviderChannel = await this.pyamentProviderCardRepository.findByPk(
            requestItem.id
          );

          if (!paymentProviderChannel) {
            continue;
          }

          const paymentProviderChannelUpdated = UpdatePaymentProviderCardDto.updateRequestFactory(
            paymentProviderChannel,
            requestItem
          );

          const paymentProviderCardUpdated = await paymentProviderChannelUpdated.save(
            { transaction }
          );

          await this.paymentProviderSharedService.uptodateChannelMinMaxAmountForCardProvider(
            paymentProviderCardUpdated.paymentProviderId,
            { transaction }
          );
        }
      });
    } catch (error) {
      response.error = error;
      return response;
    }

    response.result = true;
    return response;
  }

  async createByRequest(
    createRequest: PaymentProviderCardCreateRequestDto
  ): Promise<PaymentProviderCardCreateResponseDto> {
    const response = new PaymentProviderCardUpdateResponseDto();

    try {
      await this.sequelize.transaction(async (transaction) => {
        for (let i = 0; i < createRequest.paymentProviderCards.length; i++) {
          const requestItem = createRequest.paymentProviderCards[i];

          if (requestItem.id) {
            const paymentProviderCard = await this.pyamentProviderCardRepository.findByPk(
              requestItem.id
            );

            if (!paymentProviderCard) {
              continue;
            }

            const paymentProviderCardUpdated = UpdatePaymentProviderCardDto.updateRequestFactory(
              paymentProviderCard,
              requestItem
            );

            await paymentProviderCardUpdated.save({ transaction });

            await this.paymentProviderSharedService.uptodateChannelMinMaxAmountForCardProvider(
              paymentProviderCardUpdated.paymentProviderId,
              { transaction }
            );

            continue;
          }

          const createPaymentProviderCard = CreatePaymentProviderCardDto.createRequestFactory(
            requestItem
          );

          const paymentProviderCardCreated = await this.pyamentProviderCardRepository.create(
            createPaymentProviderCard,
            { transaction }
          );

          await this.paymentProviderSharedService.uptodateChannelMinMaxAmountForCardProvider(
            createPaymentProviderCard.paymentProviderId,
            { transaction }
          );
        }
      });
    } catch (error) {
      response.error = error;
      return response;
    }

    response.result = true;
    return response;
  }

  async deleteByRequest(
    deleteRequest: PaymentProviderCardDeleteRequestDto
  ): Promise<PaymentProviderCardDeleteResponseDto> {
    const response = new PaymentProviderCardDeleteResponseDto();
    response.result = false;

    try {
      await this.sequelize.transaction(async (transaction) => {
        const cardItems = deleteRequest.cards;

        for (let i = 0; i < cardItems.length; i++) {
          const cardItem = cardItems[i];

          const paymentProviderCard = await this.pyamentProviderCardRepository.findOne(
            {
              where: {
                id: cardItem.id,
              },
            }
          );

          if (!paymentProviderCard) {
            continue;
          }

          await paymentProviderCard.destroy({ transaction });

          await this.paymentProviderSharedService.uptodateChannelMinMaxAmountForCardProvider(
            paymentProviderCard.paymentProviderId,
            { transaction }
          );
        }
      });
    } catch (error) {
      response.error = error;
      return response;
    }

    response.result = true;
    return response;
  }

  public async findAll(options?: FindOptions) {
    return await this.pyamentProviderCardRepository.findAll(options);
  }

  public async findAllByQuery(query: PaymentProviderCardGetRequestDto) {
    const findOptions: FindOptions = {
        include: [
          { model: PaymentProviderEntityModel, as: 'paymentProvider' },
          { model: BankModel, as: 'bank' },
        ],
        order: [
          ['paymentProviderId', 'asc'],
          ['bankId', 'asc'],
          ['bankAccountName', 'asc'],
        ],
      },
      where: {} = {};

    if (query.paymentProviderId !== undefined) {
      where['paymentProviderId'] = query.paymentProviderId;
    }

    findOptions.where = where;

    return this.pyamentProviderCardRepository.findAll(findOptions);
  }

  public async findAllWithUsed(options: { day: string; providerId: number }) {
    const whereProvider = options.providerId
      ? `ppc."paymentProviderId" = ${options.providerId}`
      : 'true';
    const sql = `select 
      ppc.*, coalesce(sum(d.amount),0) "usedDay",
      pp."providerName", pp."isDepositSupport", pp."isWithdrawalSupport", pp."isOnlyCardSupport",
      bk."bankCode", bk."bankName"
    from "paymentProviderCard" ppc 
    left join "paymentProviders" pp on ppc."paymentProviderId" = pp."id"
    left join "bank" bk on ppc."bankId" = bk."id"
    left join deposit d on 
      ppc.id  = d."paymentProviderCardId"  and 
      d."date" >= to_date('${options.day}', 'MM/DD/YYYY' )  and d."date"  < (to_date('${options.day}', 'MM/DD/YYYY' ) + interval '1 day')
    where ${whereProvider}
    group by ppc.id, pp.id, bk.id `;

    const items = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    const providerCards = [];
    items.forEach((item) =>
      providerCards.push({
        id: item['id'],
        bankAccountName: item['bankAccountName'],
        bankAccountNumber: item['bankAccountNumber'],
        province: item['province'],
        city: item['city'],
        branch: item['branch'],
        minAmount: numeral(item['minAmount']).value(),
        maxAmount: numeral(item['maxAmount']).value(),
        maxDailyAmount: numeral(item['maxDailyAmount']).value(),
        usedDay: numeral(item['usedDay']).value(),
        active: item['active'],
        paymentProvider: {
          id: item['paymentProviderId'],
          providerName: item['providerName'],
          isDepositSupport: item['isDepositSupport'],
          isWithdrawalSupport: item['isWithdrawalSupport'],
          isOnlyCardSupport: item['isOnlyCardSupport'],
        },
        bank: {
          id: item['bankId'],
          bankCode: item['bankCode'],
          bankName: item['bankName'],
        },
      })
    );

    return providerCards;
  }

  public async findActiveByDateAndAmount(options: {
    day: string;
    amount: string;
    providerId: number;
  }) {
    const sql = `select 
      ppc.id
    from "paymentProviderCard" ppc 
    left join deposit d on 
      ppc.id  = d."paymentProviderCardId"  and 
      d."date" >= to_date('${options.day}', 'MM/DD/YYYY' )  and d."date"  < (to_date('${options.day}', 'MM/DD/YYYY' ) + interval '1 day')
    where ppc."paymentProviderId" = ${options.providerId} and ppc.active and ppc."minAmount" <= ${options.amount}
    group by ppc.id  having 
      case 
        when ppc."maxDailyAmount" is null then ppc."maxAmount" 
        else least (ppc."maxAmount", ppc."maxDailyAmount"-coalesce(sum(d.amount),0) ) 
      end >= ${options.amount}`;

    const items = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    const ids = [];
    items.forEach((item) => ids.push(item['id']));

    return this.pyamentProviderCardRepository.findAll({
      include: [{ model: BankModel, as: 'bank' }],
      where: { id: { [Op.in]: ids } },
    });
  }
}
