import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FindOptions, Op, QueryTypes, SaveOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DepositableChannel } from '../../dto/depositable.channel';

import * as numeral from 'numeral';
import * as moment from 'moment-timezone';
import { ConfigService } from '@nestjs/config';
import { ChannelLocaleModel } from '../../../models/channel.locale.model';
import { ChannelModel } from '../../../models/channel.model';
import { LocaleModel } from '../../../models/locale.model';
import { PaymentProviderChannelModel } from '../../../models/payment.provider.channel.model';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { PaymentProviderChannelUpdateRequestDto } from './dto/payment.provider.channel.update.request.dto';
import { PaymentProviderChannelUpdateResponseDto } from './dto/payment.provider.channel.update.response.dto';
import { UpdatePaymentProviderChannelDto } from './dto/update-payment.provider.channel.dto';
import { PaymentProviderChannelGetRequestDto } from './dto/payment.provider.channel.get.request.dto';
import { PaymentSystemModel } from '../../../models/payment.system.model';
import { PaymentSystemEnum } from '@workspace/enums';

export enum DepositOrWithdrawalEnum {
  DEPOSIT = 1,
  WITHDRAWAL = 2,
}

@Injectable()
export class PaymentProviderChannelService {
  constructor(
    @InjectModel(PaymentProviderEntityModel)
    private paymentProviderRepository: typeof PaymentProviderEntityModel,

    @InjectModel(PaymentProviderChannelModel)
    private paymentProviderChannelRepository: typeof PaymentProviderChannelModel,

    @InjectModel(ChannelModel)
    private channelRepository: typeof ChannelModel,

    @InjectModel(LocaleModel)
    private localeRepository: typeof LocaleModel,

    @InjectModel(ChannelLocaleModel)
    private channelLocaleRepository: typeof ChannelLocaleModel,

    protected sequelize: Sequelize,
    protected configService: ConfigService
  ) {}

  async update(
    paymentProviderChannel: PaymentProviderChannelModel,
    options: SaveOptions
  ): Promise<PaymentProviderChannelModel> {
    return await paymentProviderChannel.save(options);
  }

  async updateByRequest(
    updateRequest: PaymentProviderChannelUpdateRequestDto
  ): Promise<PaymentProviderChannelUpdateResponseDto> {
    const response = new PaymentProviderChannelUpdateResponseDto();

    for (let i = 0; i < updateRequest.paymentProviderChannels.length; i++) {
      const requestItem = updateRequest.paymentProviderChannels[i];

      const paymentProviderChannel = await this.paymentProviderChannelRepository.findByPk(
        requestItem.id
      );

      if (!paymentProviderChannel || paymentProviderChannel.isMinMaxAuto) {
        continue;
      }

      const paymentProviderChannelUpdated = UpdatePaymentProviderChannelDto.updateRequestFactory(
        paymentProviderChannel,
        requestItem
      );

      await paymentProviderChannelUpdated.save();
    }

    response.result = true;
    return response;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // Find All Channels
  /////////////////////////////////////////////////////////////////////////////////////////////
  public async findAll(options?: FindOptions) {
    return await this.paymentProviderChannelRepository.findAll(options);
  }

  public async findAllByQuery(query: PaymentProviderChannelGetRequestDto) {
    const findOptions: FindOptions = {
        include: [
          { model: PaymentProviderEntityModel, as: 'paymentProvider' },
          {
            model: ChannelModel,
            as: 'channel',
            include: [
              { model: PaymentSystemModel, as: 'fromPaymentSystem' },
              { model: PaymentSystemModel, as: 'toPaymentSystem' },
            ],
          },
        ],
        order: [
          ['paymentProviderId', 'asc'],
          ['channel', 'depositOrWithdrawable', 'asc'],
          ['channelId', 'asc'],
        ],
      },
      where: {} = {};

    if (query.depositOrWithdrawable !== undefined) {
      where['$channel.depositOrWithdrawable$'] = query.depositOrWithdrawable;
    }

    if (query.paymentProviderId !== undefined) {
      where['paymentProviderId'] = query.paymentProviderId;
    }

    findOptions.where = where;

    return this.paymentProviderChannelRepository.findAll(findOptions);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // Find One Deposit USDT USDT Channel
  /////////////////////////////////////////////////////////////////////////////////////////////
  public async findOneDepositUsdtToUsdt(paymentProviderId: number) {
    return this.paymentProviderChannelRepository.findOne({
      include: [{ model: ChannelModel, as: 'channel' }],
      where: {
        paymentProviderId,
        '$channel.fromPaymentSystemId$': PaymentSystemEnum.USDT,
        '$channel.toPaymentSystemId$': PaymentSystemEnum.USDT,
        '$channel.depositOrWithdrawable$': DepositOrWithdrawalEnum.DEPOSIT,
      },
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // Find One Withdraw USDT USDT Channel
  /////////////////////////////////////////////////////////////////////////////////////////////
  public async findOneWithdrawUsdtToUsdt(paymentProviderId: number) {
    return this.paymentProviderChannelRepository.findOne({
      include: [{ model: ChannelModel, as: 'channel' }],
      where: {
        paymentProviderId,
        '$channel.fromPaymentSystemId$': PaymentSystemEnum.USDT,
        '$channel.toPaymentSystemId$': PaymentSystemEnum.USDT,
        '$channel.depositOrWithdrawable$': DepositOrWithdrawalEnum.WITHDRAWAL,
      },
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // Get Channel By Provider Channel Name
  /////////////////////////////////////////////////////////////////////////////////////////////
  async getChannelIdByProviderChannelName(
    paymentProviderId: number,
    providerChannelName: string
  ): Promise<number> {
    const paymentProviderChannel = await this.paymentProviderChannelRepository.findOne(
      {
        where: {
          paymentProviderId,
          providerChannelName,
        },
      }
    );

    if (!paymentProviderChannel) {
      return null;
    }

    return paymentProviderChannel.channelId;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // Get Depositable Channels
  /////////////////////////////////////////////////////////////////////////////////////////////
  async getDepositables(): Promise<DepositableChannel[]> {
    const depositableChannels: DepositableChannel[] = [];

    const sql = `
      select 
          c.id "channelId",
          c."channelName",
          bool_or (case when (pp."isDepositSupport" and ppc."isAvailable") then true else false end) "isAvailable",
          min(case when (pp."isDepositSupport" and ppc."isAvailable") then ppc."providerMinAmount" end) "minAmount" ,
          max(case when (pp."isDepositSupport" and ppc."isAvailable") then ppc."providerMaxAmount" end) "maxAmount" 
        from channel c 
        left join "paymentProviderChannel" ppc on c.id  = ppc."channelId" 
        left join "paymentProviders" pp on ppc."paymentProviderId"  = pp.id 
        where ppc."depositOrWithdrawal"  = ${DepositOrWithdrawalEnum.DEPOSIT}
        group by c.id  
    `;

    const channels = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    for (let i = 0; i < channels.length; i++) {
      const channel = <
        {
          channelId: number;
          channelName: string;
          isAvailable: boolean;
          minAmount: string;
          maxAmount: string;
        }
      >channels[i];

      const depositableChannel = new DepositableChannel();

      depositableChannel.channelId = channel.channelId;
      depositableChannel.isAvailable = channel.isAvailable;
      depositableChannel.channelName = channel.channelName;
      depositableChannel.minAmount = numeral(channel.minAmount).value();
      depositableChannel.maxAmount = numeral(channel.maxAmount).value();

      const channelLocales = await this.channelLocaleRepository.findAll({
        where: {
          channelId: depositableChannel.channelId,
        },
        include: ['locale'],
      });

      const locales: { [key: string]: string } = {};
      channelLocales.forEach((channelLocale) => {
        locales[channelLocale.locale.localeName] = channelLocale.label;
      });

      depositableChannel.locales = locales;

      depositableChannels.push(depositableChannel);
    }

    return depositableChannels;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // GetDepositablesByPaymentSystem
  /////////////////////////////////////////////////////////////////////////////////////////////
  async getDepositablesByPaymentSystem(
    paymentSystemId: number,
    paymentProviderId: number,
    amount: number
  ): Promise<PaymentProviderChannelModel[]> {
    const frozenPeriod = this.configService.get<number>('FROZEN_PERIOD');
    const paymentProviderChannels = await this.paymentProviderChannelRepository.findAll(
      {
        include: [{ model: ChannelModel, as: 'channel' }],
        where: {
          isAvailable: true, // check isAvailable
          isActive: true,
          [Op.or]: [
            { isFrozen: false },
            {
              frozenCheckedDate: {
                [Op.notBetween]: [
                  moment().subtract(frozenPeriod, 'minutes').format(),
                  moment().add(frozenPeriod, 'minutes').format(),
                ],
              },
            },
          ], // check frozen flexible
          '$channel.depositOrWithdrawable$': DepositOrWithdrawalEnum.DEPOSIT, // check channel depositable
          '$channel.fromPaymentSystemId$': paymentSystemId,
          paymentProviderId: paymentProviderId,
          providerMinAmount: {
            [Op.lte]: amount,
          },
          providerMaxAmount: {
            [Op.gte]: amount,
          },
        },
        order: [['isFrozen', 'DESC']],
      }
    );

    return paymentProviderChannels;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // Get Depositable Entities By Channel
  /////////////////////////////////////////////////////////////////////////////////////////////
  async getDeposits(
    channelId?: number,
    paymentProviderId?: number
  ): Promise<PaymentProviderChannelModel[]> {
    const findOptions: FindOptions = {
      include: [{ model: ChannelModel, as: 'channel' }],
      where: {
        '$channel.depositOrWithdrawable$': DepositOrWithdrawalEnum.DEPOSIT,
      },
    };

    if (channelId) {
      findOptions.where['channelId'] = channelId;
    }

    if (paymentProviderId) {
      findOptions.where['paymentProviderId'] = paymentProviderId;
    }

    return this.paymentProviderChannelRepository.findAll(findOptions);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // GetWithdrawables
  /////////////////////////////////////////////////////////////////////////////////////////////
  async getWithdrawablesByPaymentProvider(
    paymentProviderId: number,
    amount?: number
  ): Promise<PaymentProviderChannelModel[]> {
    const frozenPeriod = this.configService.get<number>('FROZEN_PERIOD');
    const findOptions: FindOptions = {
      include: [{ model: ChannelModel, as: 'channel' }],
      where: {
        isAvailable: true,
        isActive: true,
        [Op.or]: [
          { isFrozen: false },
          {
            frozenCheckedDate: {
              [Op.notBetween]: [
                moment().subtract(frozenPeriod, 'minutes').format(),
                moment().add(frozenPeriod, 'minutes').format(),
              ],
            },
          },
        ], // check frozen
        '$channel.depositOrWithdrawable$': DepositOrWithdrawalEnum.WITHDRAWAL,
        paymentProviderId: paymentProviderId,
      },
      order: [
        ['isFrozen', 'DESC'],
        ['paymentProviderId', 'ASC'],
      ],
    };

    if (amount) {
      findOptions.where['providerMinAmount'] = {
        [Op.lte]:
          amount +
          (this.configService.get<number>('withdrawMinAmountDelta') || 0),
      };
      findOptions.where['providerMaxAmount'] = {
        [Op.gte]: amount,
      };
    }

    const paymentProviderChannels = await this.paymentProviderChannelRepository.findAll(
      findOptions
    );

    return paymentProviderChannels;
  }

  async findAvailableChannel(
    channelId: number,
    paymentProviderId: number,
    amount: number,
    depositOrWithdrawal: number = 1
  ): Promise<PaymentProviderChannelModel> {
    return this.paymentProviderChannelRepository.findOne({
      include: [{ model: ChannelModel, as: 'channel' }],
      where: {
        '$channel.depositOrWithdrawable$': depositOrWithdrawal,
        channelId: channelId,
        paymentProviderId: paymentProviderId,
        providerMinAmount: {
          [Op.lte]: amount,
        },
        providerMaxAmount: {
          [Op.gte]: amount,
        },
        isAvailable: true,
      },
    });
  }
}
