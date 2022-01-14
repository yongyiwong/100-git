import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { Job, Queue } from 'bull';
import { KSportService } from '../../../stream/ksport/ksport.service';
import { StreamingMatchBcRequests } from './streaming-match.bc-requests';
const WebSocket = require('ws');
const wspromise = require('websocket-lowfat-promise');
import * as moment from 'moment-timezone';

@Injectable()
export class StreamingMatchProducerService {
  private jobs: Job[];

  constructor(
    private configService: ConfigService,
    @InjectQueue('streaming-matching') private readonly queue: Queue,
    private bcRequests: StreamingMatchBcRequests,
    private ksportService: KSportService
  ) {}

  @Interval('websocket', Number(process.env.QUEUE_MATCH_GAMES))
  async iterateQuest() {

    try {
      const streamScrapping = this.configService.get<string>(
        'STREAM_SCRAPPING'
      );
  
      if (!streamScrapping || !JSON.parse(streamScrapping)) {
        return;
      }

      console.log('interval start....');

      if (this.jobs) {
        console.log('interval end for this.jobs is not null');
        return;
        // for (let i = 0; i < this.jobs.length; i++) {
        //   const job = this.jobs[i];
        //   await job.finished();
        // }
      }

      await this.ksportService.fetchUpdatedKSportResult(
        false,
        true,
        true,
        true
      );

      console.log('wating job finished has done ....');

      let allJobs = [];

      allJobs = allJobs.concat(
        (await this.createQueue('Soccer', 'football')) || []
      );
      allJobs = allJobs.concat(
        (await this.createQueue('Basketball', 'basketball')) || []
      );
      allJobs = allJobs.concat(
        (await this.createQueue('Tennis', 'tennis')) || []
      );
      allJobs = allJobs.concat(
        (await this.createQueue('Baseball', 'baseball')) || []
      );
      allJobs = allJobs.concat(
        (await this.createQueue('Volleyball', 'volleyball')) || []
      );
      allJobs = allJobs.concat(
        (await this.createQueue('RugbyUnion', 'rugby')) || []
      );
      allJobs = allJobs.concat(
        (await this.createQueue('RugbyLeague', 'rugby')) || []
      );
      allJobs = allJobs.concat(
        (await this.createQueue('TableTennis', 'pingpong')) || []
      );

      this.jobs = allJobs;

      console.log('this.jobs has been built.', this.jobs.length);

      for (let i = 0; i < this.jobs.length; i++) {
        const job = this.jobs[i];
        await job.finished();
      }

      console.log('interval end....');

      this.jobs = null;
    } catch (error) {
      console.log(error);
      console.log('interval end with catch....');
    }
  }

  async createQueue(bcSport, kSport) {
    const eventMessage = await this.createEventMessage(bcSport);
    if (!eventMessage) {
      return [];
    }

    const eventsTaskObject = await this.taskFactory(
      JSON.parse(eventMessage),
      kSport
    );

    if (!eventsTaskObject) {
      return [];
    }

    return await this.queue.addBulk(eventsTaskObject);
  }

  async createEventMessage(bcSport) {
    try {
      const wsp = new wspromise(
        new WebSocket('wss://eu-swarm-test.betconstruct.com/')
      );
      await wsp.open();

      //console.log(JSON.stringify(this.bcRequests.requestSession()));

      await wsp.send(JSON.stringify(this.bcRequests.requestSession()));
      const session = await wsp.recv();
      const timeRange = await this.bcRequests.calculateNowPlusDays(
        Number(process.env.QUEUE_EVENT_DAYS)
      );

      // console.log(
      //   JSON.stringify(this.bcRequests.eventRequest(timeRange, bcSport))
      // );

      await wsp.send(
        JSON.stringify(this.bcRequests.eventRequest(timeRange, bcSport))
      );
      const events = await wsp.recv();
      await wsp.close();
      return events;
    } catch (error) {}

    return null;
  }

  async taskFactory(eventMessage, kSport) {
    if (!eventMessage || !eventMessage.data || !eventMessage.data.data) {
      return null;
    }

    const reduceSportToArray = Object.keys(eventMessage.data.data.sport).map(
      (sportId) => ({
        sportId,
        game: eventMessage.data.data.sport[sportId],
      })
    );

    const reducedGameToArray = reduceSportToArray.map((object) =>
      Object.keys(object.game.game).map((gameId) => ({
        gameId,
        sportName: object.game.name,
        game: object.game.game[gameId],
      }))
    );

    const past_period = this.configService.get<number>(
      'runner.stream.past_period'
    );
    const later_period = this.configService.get<number>(
      'runner.stream.later_period'
    );

    const mergeArrays = [].concat
      .apply([], reducedGameToArray)
      .filter((data) => {
        const diffHours = moment().diff(
          moment.unix(data.game.start_ts),
          'hours'
        );

        //console.log(data.game.team1_name, data.game.team2_name);

        if (diffHours > past_period || diffHours < -later_period) return false;

        /* console.log(
          moment
            .unix(data.game.start_ts)
            .tz('Asia/Shanghai')
            .format('YYYY-MM-DD HH:mm')
        ); */

        return true;
      });

    return mergeArrays.map(function (object) {
      return Object.assign({
        name: 'game-match',
        data: {
          gameId: object.gameId,
          gameStart: object.game.start_ts,
          team1Id: object.game.team1_id,
          team1: object.game.team1_name,
          team2Id: object.game.team2_id,
          team2: object.game.team2_name,
          sport: kSport,
        },
        opts: {
          priority: 1,
          delay: 200,
          attempts: 1,
          timeout: 180000,
          //removeOnComplete: true,
          //removeOnFail: false,
          backoff: 1500,
          stackTrace: 20,
        },
      });
    });
  }
}
