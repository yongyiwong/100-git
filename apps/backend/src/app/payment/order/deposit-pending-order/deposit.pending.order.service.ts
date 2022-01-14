import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions, SaveOptions, DestroyOptions } from 'sequelize/types';
import { DepositPendingOrderModel } from '../../../models/deposit.pending.order.model';

import { DepositPendingOrderCreateDto } from './deposit.pending.order.dto';

@Injectable()
export class DepositPendingOrderService {
  constructor(
    @InjectModel(DepositPendingOrderModel)
    private depositPendingOrderRepository: typeof DepositPendingOrderModel
  ) {}

  async create(
    orderCreate: DepositPendingOrderCreateDto,
    options: CreateOptions
  ): Promise<DepositPendingOrderModel> {
    orderCreate.date = new Date();

    const order = new DepositPendingOrderModel(orderCreate);

    await order.save(options);

    return this.sanitizeDeposit(order);
  }

  async update(
    order: DepositPendingOrderModel,
    options: SaveOptions
  ): Promise<DepositPendingOrderModel> {
    return await order.save(options);
  }

  sanitizeDeposit(Deposit: DepositPendingOrderModel): DepositPendingOrderModel {
    const sanitized = Deposit;
    delete sanitized.status;
    delete sanitized.paymentProviderId;
    delete sanitized.paymentProviderChannelId;
    return sanitized;
  }

  async findByOrderId(orderId: string): Promise<DepositPendingOrderModel> {
    return this.depositPendingOrderRepository.findOne({
      where: {
        orderId: orderId,
      },
    });
  }

  async findByHash(hash: string): Promise<DepositPendingOrderModel> {
    return this.depositPendingOrderRepository.findOne({
      where: {
        hash,
      },
    });
  }

  async destroy(order: DepositPendingOrderModel, options?: DestroyOptions) {
    await order.destroy(options);
  }
}
