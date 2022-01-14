import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WithdrawOrderModel } from '../../../models/withdraw.order.model';
import { WithdrawOrderService } from './withdraw.order.service';

@Module({
  imports: [SequelizeModule.forFeature([WithdrawOrderModel])],
  providers: [WithdrawOrderService, WithdrawOrderModel],
  controllers: [],
  exports: [WithdrawOrderService],
})
export class WithdrawOrderModule {}
