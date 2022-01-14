import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BcOrdersModel } from '../../models/bcOrders';
import { TestModel } from '../../models/test.entity';
import { DepositOrderModule } from '../order/deposit-order/deposit.order.module';
import { DepositPendingOrderModule } from '../order/deposit-pending-order/deposit.pending.order.module';
import { WithdrawOrderModule } from '../order/withdraw-order/withdraw.order.module';
import { WithdrawPendingOrderModule } from '../order/withdraw-pending-order/withdraw.pending.order.module';
import { BetConstructPerformService } from './betConstruct.perform.service';
import { BetConstructService } from './betConstruct.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'performBCTasks',
    }),
    SequelizeModule.forFeature([BcOrdersModel, TestModel]),
    HttpModule.register({
      timeout: 45000,
      maxRedirects: 5,
    }),
    DepositPendingOrderModule,
    DepositOrderModule,
    WithdrawPendingOrderModule,
    WithdrawOrderModule,
  ],
  providers: [BetConstructService, BetConstructPerformService],
  controllers: [],
  exports: [BetConstructService, BetConstructPerformService],
})
export class BetConstructModule {}
