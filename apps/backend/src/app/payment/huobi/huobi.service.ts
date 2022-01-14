import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Job, Queue } from 'bull';
import { FindOptions } from 'sequelize';
import { OptionsModel } from '../../models/options.model';

@Injectable()
@Processor('performHuobi')
export class HuobiService {
  private performJob: Job;

  constructor(
    @InjectQueue('performHuobi') private performHuobiTasksQueue: Queue,
    private httpService: HttpService,
    @InjectModel(OptionsModel) private optionsRepository: typeof OptionsModel,
    private configService: ConfigService
  ) {
    this.performTask();
  }

  @Interval('huobiPerformScheduler', 60000)
  async intervalEntry() {
    const huobiCheck = this.configService.get<string>('HUOBI_CHECK');

    if (!huobiCheck || !JSON.parse(huobiCheck)) {
      return;
    }

    this.performTask();
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Perform Huobi Task
  ///////////////////////////////////////////////////////////////////////////////
  async performTask(force?: boolean) {
    if (this.performJob && !force) {
      return false;
    }

    try {
      if (this.performJob) {
        await this.performJob.finished();
      }

      this.performJob = await this.performHuobiTasksQueue.add(
        'perform-huobi-tasks',
        {},
        { timeout: 60000, attempts: 1 } // 60s 1m
      );

      await this.performJob.finished();
    } catch (error) {}

    this.performJob = null;

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Perform Huobi Task Consumer
  ///////////////////////////////////////////////////////////////////////////////
  @Process('perform-huobi-tasks')
  private async performHuobiTasks(job: Job) {
    let itemUsdtRate;
    try {
      const response = await this.httpService
        .get('https://api.huobi.pro/general/exchange_rate/list', { params: {} })
        .toPromise();

      const rawData = response.data;
      if (!rawData) {
        return;
      }

      const { code, data, message, success } = rawData;

      if (code !== 200 || success !== true) {
        return;
      }

      itemUsdtRate = data.find((item) => item.name === 'usdt_cny');

      if (!itemUsdtRate) {
        return;
      }

      let optionItem = await this.optionsRepository.findOne({
        where: { optName: 'huobiExchangeData' },
      });

      if (!optionItem) {
        optionItem = this.optionsRepository.build({
          optName: 'huobiExchangeData',
          optValue: JSON.stringify(itemUsdtRate),
        });
      } else {
        optionItem.optValue = Buffer.from(JSON.stringify(itemUsdtRate));
      }

      await optionItem.save();
    } catch (error) {
      //console.log(error);
    }
  }
}
