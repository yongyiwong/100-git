import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import * as moment from 'moment-timezone';
import { KSportService } from '../../../stream/ksport/ksport.service';

@Injectable()
@Processor('streaming-matching')
export class StreamingMatchConsumerService {
  constructor(private ksportService: KSportService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of ${job.name} with data:`);
  }

  @Process('game-match')
  async matchQueue(job: Job) {
    try {
      await this.ksportService.buildCandidateEventByBC({
        sport: job.data.sport.toLowerCase(),
        bcItems: [
          {
            bcEventId: job.data.gameId,
            bcTeamId1: job.data.team1Id.toString(),
            bcTeamName1: job.data.team1,
            bcTeamId2: job.data.team2Id ? job.data.team2Id.toString() : '',
            bcTeamName2: job.data.team2 || '',
            bcEventTime: moment
              .unix(job.data.gameStart)
              .tz('Asia/Shanghai')
              .format('YYYY-MM-DD HH:mm'),
          },
        ],
      });

      //console.log('ff_', job.id);
    } catch (error) {
      //console.log('f_', job.id);
      console.log(error);
      return error;
    }
  }
}
