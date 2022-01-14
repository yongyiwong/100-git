import { HttpModule, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

import { PaymentProviderModule } from './providers/payment-provider/payment.provider.module';
import configuration from './providers/payment-provider/configuration';
import { ConfigModule } from '@nestjs/config';
import { DepositOrderModule } from './order/deposit-order/deposit.order.module';
import { WithdrawOrderModule } from './order/withdraw-order/withdraw.order.module';
import { WithdrawPendingOrderModule } from './order/withdraw-pending-order/withdraw.pending.order.module';
import { PaymentProviderEntityModule } from './providers/payment-provider-entity/payment.provider.entity.module';
import { ChannelModule } from './channel/channel.module';
import { PaymentProviderChannelModule } from './providers/payment-provider-channel/payment.provider.channel.module';
import { BetConstructModule } from './betContruct/betConsturct.module';
import { BankModule } from './bank/bank.module';
import { PaymentProviderBankModule } from './providers/payment-provider-bank/payment.provider.bank.module';
import { PaymentSystemModule } from './paymentSystem/payment.system.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentCheckServie } from './payment.check.service';
import { TestModel } from '../models/test.entity';
import { BullModule } from '@nestjs/bull';
import { DepositPendingOrderModel } from '../models/deposit.pending.order.model';
import { DepositOrderModel } from '../models/deposit.order.model';
import { WithdrawPendingOrderModel } from '../models/withdraw.pending.order.model';
import { WithdrawOrderModel } from '../models/withdraw.order.model';
import { OptionsModel } from '../models/options.model';
import { ErrorModule } from '../error/error.module';
import { PaymentProviderCardModule } from './providers/payment-provider-card/payment.provider.card.module';
import { HuobiModule } from './huobi/huobi.module';
import { UsdtProtoModule } from './usdtProtocol/usdt.proto.module';
import { PaymentProviderUsdtProtoModule } from './providers/payment-provider-usdt-protocol/payment.provider.usdt.proto.module';

@Module({
  providers: [PaymentService, PaymentCheckServie],
  controllers: [PaymentController],
  imports: [
    BullModule.registerQueue({ name: 'paymentCheckTasks' }),
    PaymentProviderModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    HttpModule.register({
      timeout: 45000,
      maxRedirects: 5,
    }),
    SequelizeModule.forFeature([
      TestModel,
      DepositPendingOrderModel,
      DepositOrderModel,
      WithdrawPendingOrderModel,
      WithdrawOrderModel,
      OptionsModel,
    ]),
    PaymentProviderEntityModule,
    ChannelModule,
    BankModule,
    PaymentProviderChannelModule,
    PaymentProviderBankModule,
    PaymentProviderCardModule,
    PaymentProviderUsdtProtoModule,
    DepositOrderModule,
    WithdrawOrderModule,
    WithdrawPendingOrderModule,
    BetConstructModule,
    PaymentSystemModule,
    ErrorModule,
    HuobiModule,
    UsdtProtoModule,
  ],
  exports: [PaymentCheckServie],
})
export class PaymentModule { }
