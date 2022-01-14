import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { OptionsModel } from '../../models/options.model';
import { HuobiService } from './huobi.service';

@Module({
  imports: [
    SequelizeModule.forFeature([OptionsModel]),
    BullModule.registerQueue({
      name: 'performHuobi',
    }),
    HttpModule.register({
      timeout: 45000,
      maxRedirects: 5,
    }),
    ConfigModule.forRoot({}),
  ],
  providers: [HuobiService],
  controllers: [],
  exports: [HuobiService],
})
export class HuobiModule {}
