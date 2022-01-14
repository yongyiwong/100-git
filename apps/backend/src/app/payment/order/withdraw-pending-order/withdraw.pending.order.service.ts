import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { WithdrawPendingOrderCreateDto } from './withdraw.pending.order.dto';
import { CreateOptions, DestroyOptions, SaveOptions } from 'sequelize/types';
import { WithdrawPendingOrderModel } from '../../../models/withdraw.pending.order.model';
import { PaymentWithdrawQueryRequestDto } from '../../dto/payment.withdraw.request.dto';

@Injectable()
export class WithdrawPendingOrderService {
  constructor(
    @InjectModel(WithdrawPendingOrderModel)
    private withdrawPendingRepository: typeof WithdrawPendingOrderModel
  ) {}

  async create(
    withdrawOrderCreateDto: WithdrawPendingOrderCreateDto,
    options: CreateOptions
  ): Promise<WithdrawPendingOrderModel> {
    withdrawOrderCreateDto.date = new Date();

    const order = WithdrawPendingOrderModel.build(withdrawOrderCreateDto);

    return await order.save(options);
  }

  async update(
    order: WithdrawPendingOrderModel,
    options: SaveOptions
  ): Promise<WithdrawPendingOrderModel> {
    return await order.save(options);
  }

  async destroy(order: WithdrawPendingOrderModel, options?: DestroyOptions) {
    await order.destroy(options);
  }

  async findOne(): Promise<WithdrawPendingOrderModel> {
    return this.withdrawPendingRepository.findOne();
  }

  async findByOrderId(orderId: string): Promise<WithdrawPendingOrderModel> {
    return this.withdrawPendingRepository.findOne({
      where: {
        orderId: orderId,
      },
    });
  }

  async findByClientOrderId(
    clientOrderId: string
  ): Promise<WithdrawPendingOrderModel> {
    return this.withdrawPendingRepository.findOne({
      where: { clientOrderId },
    });
  }

  async findByOrder(withdrawQueryRequestDto: PaymentWithdrawQueryRequestDto) {
    const orderId: string = withdrawQueryRequestDto.orderId;
    const currency: string = withdrawQueryRequestDto.currency;
    const amount: number = withdrawQueryRequestDto.amount;
    return this.withdrawPendingRepository.findOne({
      where: {
        orderId: orderId,
        currency: currency,
        amount: amount,
      },
    });
  }
}
