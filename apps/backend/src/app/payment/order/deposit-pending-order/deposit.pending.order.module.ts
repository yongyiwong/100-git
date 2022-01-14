import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DepositPendingOrderModel } from '../../../models/deposit.pending.order.model';
import { DepositPendingOrderService } from './deposit.pending.order.service';

@Module({
  imports: [SequelizeModule.forFeature([DepositPendingOrderModel])],
  providers: [DepositPendingOrderService, DepositPendingOrderModel],
  controllers: [],
  exports: [DepositPendingOrderService],
})
export class DepositPendingOrderModule {}
