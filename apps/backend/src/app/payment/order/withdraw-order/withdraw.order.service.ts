import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { WithdrawOrderCreateDto } from './withdraw.order.dto';

import { CreateOptions, SaveOptions } from 'sequelize';
import { WithdrawOrderModel } from '../../../models/withdraw.order.model';
import { PaymentWithdrawQueryRequestDto } from '../../dto/payment.withdraw.request.dto';

@Injectable()
export class WithdrawOrderService {
  constructor(
    @InjectModel(WithdrawOrderModel)
    private withdrawRepository: typeof WithdrawOrderModel
  ) {}

  async create(
    withdrawOrderCreateDto: WithdrawOrderCreateDto,
    options?: CreateOptions
  ): Promise<WithdrawOrderModel> {
    withdrawOrderCreateDto.date = new Date();

    const order = new WithdrawOrderModel(withdrawOrderCreateDto);

    await order.save(options);

    return order;
  }

  async update(
    order: WithdrawOrderModel,
    options: SaveOptions
  ): Promise<WithdrawOrderModel> {
    return await order.save(options);
  }

  sanitizeWithdraw(Withdraw: WithdrawOrderModel): WithdrawOrderModel {
    const sanitized = Withdraw;
    delete sanitized.status;
    delete sanitized.paymentProviderId;
    return sanitized;
  }

  async findByOrderId(orderId: string): Promise<WithdrawOrderModel> {
    return this.withdrawRepository.findOne({
      where: {
        orderId: orderId,
      },
    });
  }

  async findByClientOrderId(
    clientOrderId: string
  ): Promise<WithdrawOrderModel> {
    return this.withdrawRepository.findOne({
      where: { clientOrderId },
    });
  }

  async findByOrder(withdrawQueryRequestDto: PaymentWithdrawQueryRequestDto) {
    const orderId: string = withdrawQueryRequestDto.orderId;
    const currency: string = withdrawQueryRequestDto.currency;
    const amount: number = withdrawQueryRequestDto.amount;
    return this.withdrawRepository.findOne({
      where: {
        orderId: orderId,
        currency: currency,
        amount: amount,
      },
    });
  }
}
