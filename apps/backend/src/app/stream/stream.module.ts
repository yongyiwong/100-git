import { Module } from '@nestjs/common';

import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';

import { KSportModule } from './ksport/ksport.module';
import { TecentModule } from './tencent/tencent.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { BCToKSportModel } from './ksport/entities/bc.ksport.entity';

import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  controllers: [StreamController],
  providers: [StreamService],
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    KSportModule,
    TecentModule,
    SequelizeModule.forFeature([BCToKSportModel]),
  ],
})
export class StreamModule {}
