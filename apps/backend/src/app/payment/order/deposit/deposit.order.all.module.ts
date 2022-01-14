import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DepositOrderAllController } from './deposit.order.all.controller';
import { DepositOrderAllService } from './deposit.order.all.service';

@Module({
  imports: [],
  providers: [DepositOrderAllService],
  controllers: [DepositOrderAllController],
  exports: [DepositOrderAllService],
})
export class DepositOrderAllModule {}
