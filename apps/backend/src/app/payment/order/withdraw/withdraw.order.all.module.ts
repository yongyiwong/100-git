import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WithdrawOrderAllController } from './withdraw.order.all.controller';
import { WithdrawOrderAllService } from './withdraw.order.all.service';

@Module({
  imports: [],
  providers: [WithdrawOrderAllService],
  controllers: [WithdrawOrderAllController],
  exports: [WithdrawOrderAllService],
})
export class WithdrawOrderAllModule {}
