import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DepositChannelEnum } from '@workspace/enums';
import { ChannelModel } from '../../models/channel.model';
import { PaymentSystemModel } from '../../models/payment.system.model';
import { ChannelGetRequestDto } from './dto/channel.get.request.dto';
import { FindOptions } from 'sequelize/types';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(ChannelModel)
    private channelRepository: typeof ChannelModel
  ) {}

  async findAllByQuery(query: ChannelGetRequestDto) {
    const findOptions: FindOptions = {
        include: [
          { model: PaymentSystemModel, as: 'fromPaymentSystem' },
          { model: PaymentSystemModel, as: 'toPaymentSystem' },
        ],
        order: [['id', 'asc']],
      },
      where: {} = {};

    if (query.depositOrWithdrawable !== undefined) {
      where['depositOrWithdrawable'] = query.depositOrWithdrawable;
    }

    findOptions.where = where;

    return this.channelRepository.findAll(findOptions);
  }

  async findById(channelId: number): Promise<ChannelModel> {
    return this.channelRepository.findByPk(channelId, {
      include: [
        { model: PaymentSystemModel, as: 'fromPaymentSystem' },
        { model: PaymentSystemModel, as: 'toPaymentSystem' },
      ],
    });
  }

  async findByChannelName(
    channelName: DepositChannelEnum
  ): Promise<ChannelModel> {
    return this.channelRepository.findOne({
      where: {
        channelName: channelName.toString(),
      },
    });
  }

  async findAll(): Promise<ChannelModel[]> {
    return this.channelRepository.findAll();
  }
}
