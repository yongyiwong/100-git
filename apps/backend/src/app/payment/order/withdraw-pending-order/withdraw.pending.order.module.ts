import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WithdrawPendingOrderModel } from '../../../models/withdraw.pending.order.model';
import { WithdrawPendingOrderService } from './withdraw.pending.order.service';

@Module({
  imports: [SequelizeModule.forFeature([WithdrawPendingOrderModel])],
  providers: [WithdrawPendingOrderService, WithdrawPendingOrderModel],
  controllers: [],
  exports: [WithdrawPendingOrderService],
})
export class WithdrawPendingOrderModule {}
