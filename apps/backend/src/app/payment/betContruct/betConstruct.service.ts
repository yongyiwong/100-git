import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions, SaveOptions } from 'sequelize';
import { OrderStatusEnum } from '@workspace/enums';
import * as md5 from 'md5';
import * as qs from 'qs';
import * as numeral from 'numeral';
import { BcOrdersModel } from '../../models/bcOrders';
import { DepositOrWithdrawalEnum } from '../providers/payment-provider-channel/payment.provider.channel.service';
import { BCCheckWithdrawHashInparams } from './dto/bc.check.withdraw.hash.in.param';
import { BCCheckWithdrawHashOut } from './dto/bc.check.withdraw.hash.out';
import { BCCheckWithdrawIPWhiteListInparams } from './dto/bc.check.withdraw.ipwhitelist.in.params';
import { BCCheckWithdrawIPWhiteListOut } from './dto/bc.check.withdraw.ipwhitelist.out';
import { BCCheckClientInParams } from './dto/bc.checkclient.in.params';
import { BCCheckClientOut } from './dto/bc.checkclient.out';
import { BCCheckClientRequestParams } from './dto/bc.checkclient.request.params';
import { BCDepositInParams, BCDepositStatus } from './dto/bc.deposit.in.params';
import { BCDepositOut } from './dto/bc.deposit.out';
import { BCDepositRequestParams } from './dto/bc.deposit.request.params';
import {
  BCWithdrawInParams,
  BCWithdrawStatus,
} from './dto/bc.withdraw.in.params';
import { BCWithdrawOut } from './dto/bc.withdraw.out';
import { BCWithdrawRequestParams } from './dto/bc.withdraw.request.params';
import { CreateBCOrdersDto } from './dto/create-bcorders.dto';
import { BCCheckClientResponse } from './interfaces/bc.checkclient.response';
import { BCDepositResponse } from './interfaces/bc.deposit.response';
import { BCWithdrawResponse } from './interfaces/bc.withdraw.response';

@Injectable()
export class BetConstructService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,

    @InjectModel(BcOrdersModel)
    private bcOrdersRepository: typeof BcOrdersModel
  ) {}

  ////////////////////////////////////////////////////////////////////////////////
  /// Check Client
  ////////////////////////////////////////////////////////////////////////////////
  async checkClient(inParams: BCCheckClientInParams) {
    const checkOut = new BCCheckClientOut();
    checkOut.result = false;

    try {
      const host = this.configService.get<string>('BC_HOST');
      const url = this.configService.get<string>('BC_CHECKCLIENT_URL');
      const resource = this.configService.get<string>('BC_RESOURCE');
      const key = this.configService.get<string>('BC_SECRETKEY');

      const params = new BCCheckClientRequestParams();
      params.command = this.configService.get<string>(
        'betConstruct.checkClient.command'
      );
      params.account = inParams.userId;
      params.currency = inParams.currency;
      params.sid = this.configService.get<string>('BC_SID');
      params.hashcode = md5(
        `${params.command}${params.account}${params.currency}${params.sid}${key}`
      );

      const response = await this.httpService
        .get(`https://${host}/${url}/${resource}`, { params })
        .toPromise();

      const data = <BCCheckClientResponse>response.data;

      // console.log(`https://${host}/${url}/${resource}`);
      // console.log(JSON.stringify(params));
      // console.log(JSON.stringify(data), '++++++');

      if (data && `${data.response.code}` === `0`) {
        checkOut.result = true;
      } else {
        checkOut.errorCode = data ? data.response.code : -1;
        checkOut.errorMessage = data ? data.response.message : 'UNKNOWN';
      }
    } catch (error) {
      checkOut.error = error;
    }

    return checkOut;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Add Deposit BCOrder
  ////////////////////////////////////////////////////////////////////////////////
  async addDepositBcOrder(inParams: BCDepositInParams): Promise<BcOrdersModel> {
    let bcOrder = await this.bcOrdersRepository.findOne({
      where: {
        orderId: inParams.orderId,
        depositOrWithdrawable: DepositOrWithdrawalEnum.DEPOSIT,
      },
    });

    // Check There is already success processed Order.
    if (bcOrder && bcOrder.processed) {
      return null;
    }

    if (bcOrder) {
      bcOrder.status = OrderStatusEnum.SUCCESS;
      bcOrder.processed = false;

      await bcOrder.save();
    } else {
      const createBCOrders = new CreateBCOrdersDto();
      createBCOrders.orderId = inParams.orderId;
      createBCOrders.depositOrWithdrawable = DepositOrWithdrawalEnum.DEPOSIT;
      createBCOrders.processed = false;
      createBCOrders.status = OrderStatusEnum.SUCCESS;

      bcOrder = await this.bcOrdersRepository.create(createBCOrders);
      if (!bcOrder) {
        return null;
      }
    }

    return bcOrder;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit
  ////////////////////////////////////////////////////////////////////////////////
  async deposit(inParams: BCDepositInParams): Promise<BCDepositOut> {
    const depositOut = new BCDepositOut();
    depositOut.result = false;

    const bcOrder = await this.addDepositBcOrder(inParams);

    if (!bcOrder) {
      depositOut.errorCode = this.configService.get<number>(
        'betConstruct.notCreateBCOrdersRecordErrorCode'
      );
      depositOut.errorMessage = this.configService.get<string>(
        'betConstruct.notCreateBCOrdersRecordErrorMessage'
      );
      return depositOut;
    }

    try {
      const host = this.configService.get<string>('BC_HOST');
      const url = this.configService.get<string>('BC_DEPOSIT_URL');
      const resource = this.configService.get<string>('BC_RESOURCE');
      const key = this.configService.get<string>('BC_SECRETKEY');

      const params = new BCDepositRequestParams();
      params.command = this.configService.get<string>(
        'betConstruct.deposit.command'
      );
      params.account = inParams.userId;
      params.txn_id = inParams.orderId;
      params.amount = inParams.amount;
      params.currency = inParams.currency;
      params.sid = this.configService.get<string>('BC_SID');
      params.hashcode = md5(
        `${params.command}${params.txn_id}${params.account}${params.amount}${params.currency}${params.sid}${key}`
      );

      const response = await this.httpService
        .get(`https://${host}/${url}/${resource}`, { params })
        .toPromise();

      const data = <BCDepositResponse>response.data;

      //console.log(data, '>>> BC Deposit');

      if (`${data.response.code}` === `0`) {
        depositOut.result = true;

        bcOrder.processed = true;
        await bcOrder.save();
      } else {
        depositOut.errorCode = data.response.code;
        depositOut.errorMessage = data.response.message;
      }
    } catch (error) {
      depositOut.error = error;
    }

    return depositOut;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Add Withdraw BC Order
  ////////////////////////////////////////////////////////////////////////////////
  async addWithdrawBcOrder(
    inParams: BCWithdrawInParams,
    options?: CreateOptions
  ): Promise<BcOrdersModel> {
    let bcOrder = await this.bcOrdersRepository.findOne({
      where: {
        orderId: inParams.orderId,
        depositOrWithdrawable: DepositOrWithdrawalEnum.WITHDRAWAL,
      },
    });

    if (bcOrder && bcOrder.processed) {
      return null;
    }

    const status = this.getOrderStatusByBCWithdrawStatus(inParams.status);
    if (status === null) {
      return null;
    }

    if (bcOrder) {
      bcOrder.processed = false;
      bcOrder.status = status;
    } else {
      const createBCOrders = new CreateBCOrdersDto();
      createBCOrders.orderId = numeral(inParams.orderId).value();
      createBCOrders.depositOrWithdrawable = DepositOrWithdrawalEnum.WITHDRAWAL;
      createBCOrders.processed = false;
      createBCOrders.status = status;

      bcOrder = await this.bcOrdersRepository.create(createBCOrders, options);
      if (!bcOrder) {
        return null;
      }
    }

    return bcOrder;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw
  ////////////////////////////////////////////////////////////////////////////////
  async withdraw(inParams: BCWithdrawInParams): Promise<BCWithdrawOut> {
    const withdrawOut = new BCWithdrawOut();
    withdrawOut.result = false;

    const bcOrder = await this.addWithdrawBcOrder(inParams);
    if (!bcOrder) {
      withdrawOut.errorCode = this.configService.get<number>(
        'betConstruct.notCreateBCOrdersRecordErrorCode'
      );
      withdrawOut.errorMessage = this.configService.get<string>(
        'betConstruct.notCreateBCOrdersRecordErrorMessage'
      );
      return withdrawOut;
    }

    const params = new BCWithdrawRequestParams();

    params.playerId = inParams.userId;
    params.orderId = inParams.orderId;
    params.currency = inParams.currency;
    params.amount = inParams.amount;
    params.status = inParams.status;
    params.reason = inParams.reason;

    const withdrawalKey = this.configService.get<string>('WITHDRAWAL_TOKEN');
    const bcKey = this.configService.get<string>('BC_SECRETKEY');

    const txtSource =
      `${params.orderId}` +
      `${params.playerId}` +
      `${params.currency}` +
      `${params.amount}` +
      `${params.status}` +
      `${withdrawalKey}` +
      `${bcKey}`;

    params.hash = md5(txtSource);

    // console.log(JSON.stringify(params));
    // console.log('_________________');
    // console.log(txtSource);
    // console.log('_________________');
    // console.log(params.hash);

    try {
      const host = this.configService.get<string>('BC_HOST_WITHDRAW');
      const url = this.configService.get<string>('BC_WITHDRAW_URL');

      //console.log(`https://${host}/${url}`);

      const response = await this.httpService
        .post(`https://${host}/${url}`, qs.stringify(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .toPromise();

      const data = <BCWithdrawResponse>response.data;

      //console.log(data, '>>> WITHDRAW');

      if (`${data.response.code}` === `0`) {
        withdrawOut.result = true;

        bcOrder.processed = true;
        await bcOrder.save();
      } else {
        withdrawOut.errorCode = data.response.code;
        withdrawOut.errorMessage = data.response.message;
      }

      //console.log(withdrawOut);

      return withdrawOut;
    } catch (error) {
      //console.log(error);
      withdrawOut.error = error;
      withdrawOut.errorCode = this.configService.get<number>(
        'betConstruct.withdraw.serviceErrorCode'
      );
      withdrawOut.errorMessage = this.configService.get<string>(
        'betConstruct.withdraw.serviceErrorMessage'
      );
    }

    return withdrawOut;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// CHECK WITHDRAW IP WHITELIST
  ////////////////////////////////////////////////////////////////////////////////
  checkWithdrawIPWhitelist(
    inParams: BCCheckWithdrawIPWhiteListInparams
  ): BCCheckWithdrawIPWhiteListOut {
    const out = new BCCheckWithdrawIPWhiteListOut();
    out.result = false;

    const ip_in = inParams.ip.trim();

    const ipWhiteList = this.configService.get<string>(
      'BC_WITHDRAW_IP_WHITELIST'
    );
    if (!ipWhiteList) {
      return out;
    }

    const ips = ipWhiteList.split(',') || [];
    const ipMatched = ips.find((ip) => ip.trim() === ip_in);

    out.result = ipMatched ? true : false;

    if (!out.result) {
      out.errorCode = this.configService.get<number>(
        'betConstruct.withdraw.checkIPWhiteListErrorCode'
      );
      out.errorMessage = this.configService.get<string>(
        'betConstruct.withdraw.checkIPWhiteListErrorMessage'
      );
    }

    return out;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// CHECK WITHDRAW HASH
  ////////////////////////////////////////////////////////////////////////////////
  checkWithdrawHash(
    inParams: BCCheckWithdrawHashInparams
  ): BCCheckWithdrawHashOut {
    const out = new BCCheckWithdrawHashOut();
    out.result = false;

    const command = this.configService.get<string>(
      'betConstruct.withdraw.command'
    );
    const keyBC = this.configService.get<string>('BC_SECRETKEY');
    const tokenWithdrawal = this.configService.get<string>('WITHDRAWAL_TOKEN');
    const txtSource =
      `${command}${inParams.amount}` +
      `${inParams.bankAccountName}${inParams.bankAccountNumber}` +
      `${inParams.bankCode}${inParams.branch}` +
      `${inParams.city}${inParams.currency}${inParams.orderId}` +
      `${inParams.phoneNumber !== undefined ? inParams.phoneNumber : ''}` +
      `${inParams.province}` +
      `${tokenWithdrawal}${inParams.userId}` +
      `${inParams.userName !== undefined ? inParams.userName : ''}` +
      `${keyBC}`;
    const hash = md5(txtSource);

    out.result = hash.toUpperCase() === inParams.hashCode.toUpperCase();

    // console.log(txtSource);
    console.log(hash);

    if (!out.result) {
      out.errorCode = this.configService.get<number>(
        'betConstruct.withdraw.checkHashErrorCode'
      );
      out.errorMessage = this.configService.get<string>(
        'betConstruct.withdraw.checkHashErrorMessage'
      );
    }

    return out;
  }

  public getBCDepositStatusByOrderStatus(
    orderStatus: OrderStatusEnum
  ): BCWithdrawStatus {
    switch (orderStatus) {
      case OrderStatusEnum.SUCCESS:
        return BCWithdrawStatus.SUCCESS;
      case OrderStatusEnum.FAILED:
        return BCWithdrawStatus.FAILED;
      default:
        break;
    }
    return null;
  }

  public getOrderStatusByBCDepositStatus(
    depositStatus: BCDepositStatus
  ): OrderStatusEnum {
    switch (depositStatus) {
      case BCDepositStatus.SUCCESS:
        return OrderStatusEnum.SUCCESS;
      case BCDepositStatus.FAILED:
        return OrderStatusEnum.FAILED;
      default:
        break;
    }
    return null;
  }

  public getBCWithdrawStatusByOrderStatus(
    orderStatus: OrderStatusEnum
  ): BCWithdrawStatus {
    switch (orderStatus) {
      case OrderStatusEnum.SUCCESS:
        return BCWithdrawStatus.SUCCESS;
      case OrderStatusEnum.FAILED:
        return BCWithdrawStatus.FAILED;
      default:
        break;
    }
    return null;
  }

  public getOrderStatusByBCWithdrawStatus(
    withdrawStatus: BCWithdrawStatus
  ): OrderStatusEnum {
    switch (withdrawStatus) {
      case BCWithdrawStatus.SUCCESS:
        return OrderStatusEnum.SUCCESS;
      case BCWithdrawStatus.FAILED:
        return OrderStatusEnum.FAILED;
      default:
        break;
    }
    return null;
  }
}
