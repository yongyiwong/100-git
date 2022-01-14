import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { ScheduleModule } from '@nestjs/schedule';
import { Sequelize } from 'sequelize-typescript';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BannersModel } from './cms/banners/banners.model';
import { CmsModule } from './cms/cms.module';
import { RunnerModule } from './runner/runner.module';

import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { StreamModule } from './stream/stream.module';

///////////////////////////////////////////////////////////////////////////////////
// IMPORT MODEL
////////////////////////////////////////////////////////////////////////////////////
import { UserModel } from './user/user.model';
import { BankModel } from './models/bank.entity';
import { ChannelLocaleModel } from './models/channel.locale.model';
import { PaymentProviderChannelModel } from './models/payment.provider.channel.model';
import { ChannelModel } from './models/channel.model';
import { DepositOrderModel } from './models/deposit.order.model';
import { DepositPendingOrderModel } from './models/deposit.pending.order.model';
import { LocaleModel } from './models/locale.model';
import { PaymentProviderBankModel } from './models/payment.provider.bank.entity';
import { PaymentProviderEntityModel } from './models/payment.provider.entity.model';
import { PaymentSystemLocaleModel } from './models/payment.system.locale.model';
import { PaymentSystemModel } from './models/payment.system.model';
import { WithdrawOrderModel } from './models/withdraw.order.model';
import { WithdrawPendingOrderModel } from './models/withdraw.pending.order.model';
import { BCToKSportModel } from './stream/ksport/entities/bc.ksport.entity';
import { BCToKSportTeamModel } from './stream/ksport/entities/bc.ksport.team.entity';
import { BullModule } from '@nestjs/bull';
import { BcOrdersModel } from './models/bcOrders';
import { TestModel } from './models/test.entity';
import { OptionsModel } from './models/options.model';
import { PaymentProviderCardModel } from './models/payment.provider.card.model';
import { UsdtProtocolModel } from './models/usdtProtocol';
import { PaymentProviderUsdtProtocolModel } from './models/payment.provider.usdt.protocol.model';
import { OptionsModule } from './options/options.module';
import { NotifyModule } from './notify/notify.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike()
      ),
      defaultMeta: { service: 'backend' },
      transports: [new winston.transports.Console()],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectOptions: {
        useUTC: false,
      },
      logging: false,
      timezone: '+08:00',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [
        UserModel,
        PaymentSystemModel,
        ChannelModel,
        BankModel,
        PaymentProviderEntityModel,
        BCToKSportModel,
        BCToKSportTeamModel,
        LocaleModel,
        DepositPendingOrderModel,
        DepositOrderModel,
        WithdrawPendingOrderModel,
        WithdrawOrderModel,
        PaymentProviderChannelModel,
        PaymentProviderBankModel,
        PaymentProviderCardModel,
        BCToKSportModel,
        BCToKSportTeamModel,
        BannersModel,
        PaymentSystemLocaleModel,
        ChannelLocaleModel,
        BcOrdersModel,
        OptionsModel,
        UsdtProtocolModel,
        PaymentProviderUsdtProtocolModel,
        TestModel,
      ],
    }),
    AuthModule,
    PaymentModule,
    StreamModule,
    CmsModule,
    RunnerModule,
    OptionsModule,
    NotifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private sequelize: Sequelize) {}

  configure(consumer: MiddlewareConsumer) {}
}
