import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DepositOrderModel } from '../../../models/deposit.order.model';
import { DepositOrderService } from './deposit.order.service';

@Module({
  imports: [SequelizeModule.forFeature([DepositOrderModel])],
  providers: [DepositOrderService, DepositOrderModel],
  controllers: [],
  exports: [DepositOrderService],
})
export class DepositOrderModule {}
