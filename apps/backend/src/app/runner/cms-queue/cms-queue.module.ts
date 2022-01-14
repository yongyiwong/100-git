import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BetConstructModule } from '../../payment/betContruct/betConsturct.module';
import { KSportModule } from '../../stream/ksport/ksport.module';
import configuration from './configuration';
import { StreamingMatchBcRequests } from './streaming-match/streaming-match.bc-requests';
import { StreamingMatchConsumerService } from './streaming-match/streaming-match.consumer.service';
import { StreamingMatchProducerService } from './streaming-match/streaming-match.producer.service';

@Module({
  // imports: [
  //   ConfigModule.forRoot({
  //     load: [configuration],
  //   }),
  //   BullModule.registerQueue({
  //     name: 'streaming-matching',
  //   }),
  //   KSportModule,
  //   BetConstructModule,
  // ],
  // providers: [
  //   StreamingMatchProducerService,
  //   StreamingMatchConsumerService,
  //   StreamingMatchBcRequests,
  // ],
})
export class CmsQueueModule {}
