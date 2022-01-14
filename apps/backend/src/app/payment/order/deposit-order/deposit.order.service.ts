import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { DepositOrderCreateDto } from './deposit.order.dto';

import { CreateOptions, SaveOptions } from 'sequelize';
import { DepositOrderModel } from '../../../models/deposit.order.model';

@Injectable()
export class DepositOrderService {
  constructor(
    @InjectModel(DepositOrderModel)
    private depositRepository: typeof DepositOrderModel
  ) {}
  async create(
    depositOrderCreateDto: DepositOrderCreateDto,
    options: CreateOptions
  ): Promise<DepositOrderModel> {
    depositOrderCreateDto.date = new Date();

    const createdDepositOrder = new DepositOrderModel(depositOrderCreateDto);

    await createdDepositOrder.save(options);

    return this.sanitizeDeposit(createdDepositOrder);
  }

  async update(
    order: DepositOrderModel,
    options: SaveOptions
  ): Promise<DepositOrderModel> {
    return await order.save(options);
  }

  sanitizeDeposit(Deposit: DepositOrderModel): DepositOrderModel {
    const sanitized = Deposit;
    delete sanitized.status;
    delete sanitized.paymentProviderId;
    delete sanitized.paymentProviderChannelId;
    return sanitized;
  }

  async findByOrderId(orderId: string): Promise<DepositOrderModel> {
    return this.depositRepository.findOne({
      where: {
        orderId: orderId,
      },
    });
  }

  async findByHash(hash: string): Promise<DepositOrderModel> {
    return this.depositRepository.findOne({
      where: {
        hash,
      },
    });
  }
}
