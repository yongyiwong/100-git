import { HttpModule, Module } from '@nestjs/common';
import { KSportService } from './ksport.service';
import { KSportController } from './ksport.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BCToKSportTeamModel } from './entities/bc.ksport.team.entity';
import { BCToKSportModel } from './entities/bc.ksport.entity';
import { KSportFetchService } from './ksport.fetch.service';
import { BullModule } from '@nestjs/bull';
import { TestModel } from '../../models/test.entity';

@Module({
  controllers: [KSportController],
  providers: [KSportService, KSportFetchService],
  imports: [
    BullModule.registerQueue({
      name: 'fetch-ksport',
    }),
    HttpModule.register({
      timeout: 45000,
      maxRedirects: 5,
    }),
    SequelizeModule.forFeature([
      BCToKSportModel,
      BCToKSportTeamModel,
      TestModel,
    ]),
  ],
  exports: [KSportService],
})
export class KSportModule {}
