import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { Job, Queue } from 'bull';
import { BankModel } from '../models/bank.entity';
import { ChannelService } from './channel/channel.service';
import { PaymentService } from './payment.service';
import { PaymentProviderBankService } from './providers/payment-provider-bank/payment.provider.bank.service';
import { PaymentProviderChannelService } from './providers/payment-provider-channel/payment.provider.channel.service';
import { PaymentProviderEntityService } from './providers/payment-provider-entity/Payment.provider.entity.service';

@Injectable()
@Processor('paymentCheckTasks')
export class PaymentCheckServie {
  private performJob: Job;

  constructor(
    private configService: ConfigService,
    private channelService: ChannelService,
    private paymentService: PaymentService,
    private payProviderEntityService: PaymentProviderEntityService,
    private payProviderChannelService: PaymentProviderChannelService,
    private payProviderBankService: PaymentProviderBankService,

    @InjectQueue('paymentCheckTasks') private paymentCheckQueue: Queue
  ) {}

  ////////////////////////////////////////////////////////////////////////////////
  // Perform Check Schedule
  ///////////////////////////////////////////////////////////////////////////////
  @Interval('paymentCheckScheduler', 900000) // 15mins
  async intervalEntry() {
    const paymentChannelCheck = this.configService.get<string>(
      'PAYMENT_CHANNEL_CHECK'
    );

    if (!paymentChannelCheck || !JSON.parse(paymentChannelCheck)) {
      return;
    }

    this.performPaymentCheck();
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Perform Payment Check
  ///////////////////////////////////////////////////////////////////////////////
  async performPaymentCheck(force?: boolean) {
    if (this.performJob && !force) {
      return false;
    }

    try {
      if (this.performJob) {
        await this.performJob.finished();
      }

      this.performJob = await this.paymentCheckQueue.add(
        'perform-payment-check-tasks',
        {},
        { timeout: 900000, attempts: 1 } // 15mins
      );

      await this.performJob.finished();
    } catch (error) {}

    this.performJob = null;

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Perform PaymentCheckTasks Consummer
  ///////////////////////////////////////////////////////////////////////////////
  @Process('perform-payment-check-tasks')
  private async performPaymentCheckTasks(job: Job) {
    // check payment provider channel
    console.log('check payment provider channel');
    try {
      const paymentProviderChannels = await this.payProviderChannelService.getDeposits();
      if (paymentProviderChannels && paymentProviderChannels.length > 0) {
        for (let i = 0; i < paymentProviderChannels.length; i++) {
          const paymentProviderChannel = paymentProviderChannels[i];
          const isAvaialble = await this.paymentService.getPaymentProviderChannelDepositable(
            paymentProviderChannel
          );

          paymentProviderChannel.isAvailable = isAvaialble;
          await paymentProviderChannel.save();

          if (await job.isFailed()) {
            return;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    // check payment provider bank
    console.log('check payment provider bank');
    try {
      const paymentProviders = await this.payProviderEntityService.findAll();
      for (let i = 0; i < paymentProviders.length; i++) {
        const paymentProvider = paymentProviders[i];

        const paymentProviderBanks = await this.payProviderBankService.findAll({
          include: [{ model: BankModel, as: 'bank' }],
          where: {
            paymentProviderId: paymentProvider.id,
          },
          order: [[{ model: BankModel, as: 'bank' }, 'id', 'ASC']],
        });

        if (!paymentProviderBanks || paymentProviderBanks.length < 1) {
          continue;
        }

        let paymentProviderBank = paymentProviderBanks[0];

        // console.log(
        //   paymentProviderBank.paymentProviderId,
        //   ':',
        //   paymentProviderBank.paymentProviderBankName
        // );

        const isAvailable = await this.paymentService.getPaymentProviderBankWithdrawable(
          paymentProviderBank
        );

        for (let j = 0; j < paymentProviderBanks.length; j++) {
          paymentProviderBank = paymentProviderBanks[j];
          paymentProviderBank.isAvailable = isAvailable;

          await paymentProviderBank.save();
        }

        if (await job.isFailed()) {
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }

    console.log('END OF CHECK');
  }

  // delay(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
}
