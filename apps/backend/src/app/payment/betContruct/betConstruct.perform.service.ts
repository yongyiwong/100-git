import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { CurrencyEnum, OrderStatusEnum } from '@workspace/enums';
import { Job, Queue } from 'bull';
import { BcOrdersModel } from '../../models/bcOrders';
import { DepositOrderService } from '../order/deposit-order/deposit.order.service';
import { DepositPendingOrderService } from '../order/deposit-pending-order/deposit.pending.order.service';
import { WithdrawOrderService } from '../order/withdraw-order/withdraw.order.service';
import { WithdrawPendingOrderService } from '../order/withdraw-pending-order/withdraw.pending.order.service';
import { DepositOrWithdrawalEnum } from '../providers/payment-provider-channel/payment.provider.channel.service';
import { BCDepositInParams } from './dto/bc.deposit.in.params';
import {
  BCWithdrawInParams,
  BCWithdrawStatus,
} from './dto/bc.withdraw.in.params';
import * as numeral from 'numeral';
import * as moment from 'moment-timezone';
import { BetConstructService } from './betConstruct.service';
import { Interval } from '@nestjs/schedule';
import { TestModel } from '../../models/test.entity';

@Injectable()
@Processor('performBCTasks')
export class BetConstructPerformService {
  private performJob: Job;
  private bcOrderInProcess: BcOrdersModel;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,

    @InjectModel(BcOrdersModel)
    private bcOrdersRepository: typeof BcOrdersModel,

    private betConstructService: BetConstructService,

    private depositPendingOrderService: DepositPendingOrderService,
    private depositOrderService: DepositOrderService,
    private withdrawPendingOrderService: WithdrawPendingOrderService,
    private withdrawOrderService: WithdrawOrderService,

    @InjectQueue('performBCTasks') private performBCTasksQueue: Queue,

    @InjectModel(TestModel)
    private testRepository: typeof TestModel
  ) {}

  @Interval('bcPerformScheduler', 60000)
  async intervalEntry() {
    this.performTask();
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Perform BetConstruct Task
  ///////////////////////////////////////////////////////////////////////////////
  async performTask(force?: boolean) {
    if (this.performJob && !force) {
      return false;
    }

    try {
      if (this.performJob) {
        await this.performJob.finished();
      }

      this.performJob = await this.performBCTasksQueue.add(
        'perform-bc-tasks',
        {},
        { timeout: 60000, attempts: 1 } // 60s 1m
      );

      /* await this.testRepository.create({
        a: JSON.stringify({ createdJob: this.performJob.id }),
      }); */

      await this.performJob.finished();
    } catch (error) {
      await this.testRepository.create({
        a: JSON.stringify(error),
      });
    }

    this.performJob = null;

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Perform BcTasks Consumer
  ///////////////////////////////////////////////////////////////////////////////
  @Process('perform-bc-tasks')
  private async performBCTasks(job: Job) {
    const bcOrders = await this.bcOrdersRepository.findAll({
      where: { processed: false },
      limit: this.configService.get<number>(
        'betConstruct.numberOfTasksProcessed'
      ),
    });

    /* await this.testRepository.create({
      a: JSON.stringify({
        name: 'perform-bc-tasks',
        job: job.id,
        bcOrders: bcOrders.length,
      }),
    }); */

    for (let i = 0; i < bcOrders.length; i++) {
      const bcOrder = bcOrders[i];

      if (this.bcOrderInProcess && this.bcOrderInProcess.id === bcOrder.id) {
        continue;
      }

      this.bcOrderInProcess = bcOrder;
      await this.performBcOrder(bcOrder);
      this.bcOrderInProcess = null;

      if (await job.isFailed()) {
        break;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Perform BcOrder
  ///////////////////////////////////////////////////////////////////////////////
  private async performBcOrder(bcOrder: BcOrdersModel) {
    bcOrder.logData = JSON.stringify({
      performed: moment().utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss'),
    });
    await bcOrder.save();

    switch (`${bcOrder.depositOrWithdrawable}`) {
      case `${DepositOrWithdrawalEnum.DEPOSIT}`:
        await this.performBcOrderDeposit(bcOrder);
        break;
      case `${DepositOrWithdrawalEnum.WITHDRAWAL}`:
        await this.performBcOrderWithdraw(bcOrder);
        break;
      default:
        break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Perform BcOrder Deposit
  ///////////////////////////////////////////////////////////////////////////////
  private async performBcOrderDeposit(bcOrder: BcOrdersModel) {
    try {
      const inParams = new BCDepositInParams();

      const orderPending = await this.depositPendingOrderService.findByOrderId(
        `${bcOrder.orderId}`
      );

      if (orderPending) {
        inParams.amount = orderPending.amount;
        inParams.currency = CurrencyEnum.CNY;
        inParams.orderId = numeral(bcOrder.orderId).value();
        inParams.userId = numeral(orderPending.userId).value();

        // Do not Process for Pending Order
        return false;
      } else {
        const orderSuccess = await this.depositOrderService.findByOrderId(
          `${bcOrder.orderId}`
        );
        if (!orderSuccess) {
          return false;
        }

        inParams.amount = orderSuccess.amount;
        inParams.currency = CurrencyEnum.CNY;
        inParams.orderId = numeral(bcOrder.orderId).value();
        inParams.userId = numeral(orderSuccess.userId).value();
      }

      console.log(inParams, '... BC Deposit Start');
      const bcDepositResult = await this.betConstructService.deposit(inParams);

      return bcDepositResult.result;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Perform BcOrder Withdraw
  ///////////////////////////////////////////////////////////////////////////////
  private async performBcOrderWithdraw(bcOrder: BcOrdersModel) {
    try {
      const inParams = new BCWithdrawInParams();

      const orderPending = await this.withdrawPendingOrderService.findByClientOrderId(
        `${bcOrder.orderId}`
      );

      if (orderPending) {
        inParams.amount = orderPending.amount;
        inParams.currency = orderPending.currency;
        inParams.orderId = numeral(bcOrder.orderId).value();
        inParams.reason = this.configService.get<string>(
          'betConstruct.withdraw.reason'
        );
        inParams.userId = orderPending.userId;
        inParams.status = this.betConstructService.getBCWithdrawStatusByOrderStatus(
          <OrderStatusEnum>orderPending.status
        );
      } else {
        const orderSuccess = await this.withdrawOrderService.findByClientOrderId(
          `${bcOrder.orderId}`
        );

        if (!orderSuccess) {
          return false;
        }

        inParams.amount = orderSuccess.amount;
        inParams.currency = orderSuccess.currency;
        inParams.orderId = numeral(bcOrder.orderId).value();
        inParams.reason = this.configService.get<string>(
          'betConstruct.withdraw.reason'
        );
        inParams.userId = orderSuccess.userId;
        inParams.status = this.betConstructService.getBCWithdrawStatusByOrderStatus(
          <OrderStatusEnum>orderSuccess.status
        );
      }

      if (
        inParams.status !== BCWithdrawStatus.SUCCESS &&
        inParams.status !== BCWithdrawStatus.FAILED
      ) {
        return false;
      }

      console.log(inParams, '... BC Withdraw Start');

      const bcWithdrawResult = await this.betConstructService.withdraw(
        inParams
      );

      return bcWithdrawResult.result;
    } catch (error) {
      console.log(error);
    }
  }

  /* delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  } */
}
