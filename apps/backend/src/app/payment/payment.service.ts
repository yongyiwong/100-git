import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import {
  BankCodeEnum,
  DepositChannelEnum,
  CurrencyEnum,
  PaymentProviderEnum,
  PaymentSystemEnum,
  OrderStatusEnum,
} from '@workspace/enums';
import * as md5 from 'md5';
import * as qs from 'qs';
import * as moment from 'moment-timezone';
import * as numeral from 'numeral';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { PaymentProviderBankModel } from '../models/payment.provider.bank.entity';
import { PaymentProviderChannelModel } from '../models/payment.provider.channel.model';
import { TestModel } from '../models/test.entity';
import { BankService } from './bank/bank.service';
import { BetConstructService } from './betContruct/betConstruct.service';
import { BCCheckWithdrawHashInparams } from './betContruct/dto/bc.check.withdraw.hash.in.param';
import { BCCheckClientInParams } from './betContruct/dto/bc.checkclient.in.params';
import {
  BCWithdrawInParams,
  BCWithdrawStatus,
} from './betContruct/dto/bc.withdraw.in.params';
import { ChannelService } from './channel/channel.service';
import { DepositableChannel } from './dto/depositable.channel';
import { DepositablePaymentSystem } from './dto/depositable.paymentsystem';
import { WithdrawableBank } from './dto/withdrawable.banks';
import {
  NoProviderException,
  PaymentProviderException,
} from './payment.exception';
import { PaymentSystemService } from './paymentSystem/payment.system.service';
import { PaymentProviderBankService } from './providers/payment-provider-bank/payment.provider.bank.service';
import {
  DepositOrWithdrawalEnum,
  PaymentProviderChannelService,
} from './providers/payment-provider-channel/payment.provider.channel.service';
import { PaymentProviderEntityService } from './providers/payment-provider-entity/Payment.provider.entity.service';
import { D1FPaymentProviderService } from './providers/payment-provider/d1f/d1f.payment.provider.service';
import { MSZFPaymentProviderService } from './providers/payment-provider/mszf/mszf.payment.provider.service';
import { PaymentProviderDepositRequestDto } from './providers/payment-provider/payment.provider.deposit.request.dto';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
} from './providers/payment-provider/payment.provider.deposit.result';
import { PaymentProviderService } from './providers/payment-provider/payment.provider.service';
import { PaymentProviderWithdrawRequestDto } from './providers/payment-provider/payment.provider.withdraw.request.dto';
import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from './providers/payment-provider/payment.provider.withdraw.result';
//import { SDDPaymentProviderService } from './providers/payment-provider/sdd/sdd.payment.provider.service';
import { UzPAYPaymentProviderService } from './providers/payment-provider/uzpay/uzpay.payment.provider.service';
import { XingChenPaymentProviderService } from './providers/payment-provider/xingchen/xingchen.payment.provider.service';
import { HengXinPaymentProviderService } from './providers/payment-provider/hengxin/hengxin.payment.provider.service';
import { ChannelModel } from '../models/channel.model';
import { PaymentManualDepositRequestDto } from './dto/payment.manual.deposit.request.dto';
import { PaymentManualDepositResultDto } from './dto/payment.manual.deposit.result.dto';
import { PaymentProviderEntityModel } from '../models/payment.provider.entity.model';
import { PaymentSystemModel } from '../models/payment.system.model';
import { PaymentMakeDepositSuccessRequestDto } from './dto/payment.make.deposit.success.request.dto';
import { DepositPendingOrderModel } from '../models/deposit.pending.order.model';
import { DepositOrderCreateDto } from './order/deposit-order/deposit.order.dto';
import { DepositOrderModel } from '../models/deposit.order.model';
import { PaymentManualWithdrawRequestDto } from './dto/payment.manual.withdraw.request.dto';
import { PaymentManualWithdrawResultDto } from './dto/payment.manual.withdraw.result.dto';
import { WithdrawPendingOrderCreateDto } from './order/withdraw-pending-order/withdraw.pending.order.dto';
import { WithdrawOrderCreateDto } from './order/withdraw-order/withdraw.order.dto';
import { WithdrawOrderService } from './order/withdraw-order/withdraw.order.service';
import { PaymentMakeWithdrawSuccessRequestDto } from './dto/payment.make.withdraw.success.request.dto';
import { WithdrawPendingOrderModel } from '../models/withdraw.pending.order.model';
import { WithdrawOrderModel } from '../models/withdraw.order.model';
import { BCDepositInParams } from './betContruct/dto/bc.deposit.in.params';
import { JBPPaymentProviderService } from './providers/payment-provider/jbp/jbp.payment.provider.service';
import { BCCheckWithdrawIPWhiteListInparams } from './betContruct/dto/bc.check.withdraw.ipwhitelist.in.params';
import { OptionsModel } from '../models/options.model';
import { ErrorService } from '../error/error.service';
import { PaymentTestDepositRequestDto } from './dto/payment.test.deposit.request.dto';
import { PaymentTestDepositResultDto } from './dto/payment.test.deposit.result.dto';
import { SXCPaymentProviderService } from './providers/payment-provider/sxc/sxc.payment.provider.service';
import { PaymentDepositByCardRequestDto } from './dto/payment.deposit.bycard.request.dto';
import * as crypto from 'crypto';
import { PaymentDepositByCardRequest } from './interface/payment.deposit.bycard.request';
import { DBPayPaymentProviderService } from './providers/payment-provider/dbpay/dbpay.payment.provider.service';
import { PaymentWithdrawRequestDto } from './dto/payment.withdraw.request.dto';
import { BisaPaymentProviderService } from './providers/payment-provider/bisa/bisa.payment.provider.service';
import { WithdrawPendingOrderService } from './order/withdraw-pending-order/withdraw.pending.order.service';
import { ErrorCodeEnum } from '../error/enums/errorCodeEnum';
import { UsdtProtocolModel } from '../models/usdtProtocol';
import { PaymentProviderUsdtProtoService } from './providers/payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { UsdtProtoService } from './usdtProtocol/usdt.proto.service';
import { DepositableUsdtProto } from './dto/depositable.usdtproto';

@Injectable()
export class PaymentService {
  private payProviderServices: Array<PaymentProviderService>;
  private payProviderServicesMap: {};

  constructor(
    private configService: ConfigService,
    private payProviderEntityService: PaymentProviderEntityService,
    private paymentSystemService: PaymentSystemService,
    private usdtProtoService: UsdtProtoService,
    private channelService: ChannelService,
    private bankService: BankService,
    private payProviderChannelService: PaymentProviderChannelService,
    private payProviderBankService: PaymentProviderBankService,
    private payProviderUsdtProtoService: PaymentProviderUsdtProtoService,
    private mszfPaymentProviderService: MSZFPaymentProviderService,
    private d1fPaymentProviderService: D1FPaymentProviderService,
    private xingchenPaymentProviderService: XingChenPaymentProviderService,
    private uzpayPaymentProviderService: UzPAYPaymentProviderService,
    //private sddPaymentProviderService: SDDPaymentProviderService,
    private hengxinPaymentProviderService: HengXinPaymentProviderService,
    private jbpPaymentProviderService: JBPPaymentProviderService,
    private sxcPaymentProviderService: SXCPaymentProviderService,
    private dbPayPaymentProviderService: DBPayPaymentProviderService,
    private bisaPaymentProviderService: BisaPaymentProviderService,

    protected betConstructService: BetConstructService,
    protected withdrawOrderService: WithdrawOrderService,
    protected withdrawPendingOrderService: WithdrawPendingOrderService,
    protected httpService: HttpService,
    protected sequelize: Sequelize,
    protected errorService: ErrorService,

    @InjectModel(DepositPendingOrderModel)
    private depositPendingOrderRepository: typeof DepositPendingOrderModel,

    @InjectModel(DepositOrderModel)
    private depositOrderRepository: typeof DepositOrderModel,

    @InjectModel(WithdrawPendingOrderModel)
    private withdrawPendingOrderRepository: typeof WithdrawPendingOrderModel,

    @InjectModel(WithdrawOrderModel)
    private withdrawOrderRepository: typeof WithdrawOrderModel,

    @InjectModel(OptionsModel) private optionsRepository: typeof OptionsModel,

    @InjectModel(TestModel) private testRepository: typeof TestModel
  ) {
    this.payProviderServices = new Array<PaymentProviderService>();
    this.registerPaymentProviders();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Register All Payment Provider Services
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  private async registerPaymentProviders() {
    const implProviderServices = [
      this.mszfPaymentProviderService,
      this.d1fPaymentProviderService,
      this.xingchenPaymentProviderService,
      this.uzpayPaymentProviderService,
      //this.sddPaymentProviderService,
      this.hengxinPaymentProviderService,
      this.jbpPaymentProviderService,
      this.sxcPaymentProviderService,
      this.dbPayPaymentProviderService,
      this.bisaPaymentProviderService,
    ];
    const providerServicesMap = (this.payProviderServicesMap = {});
    const providerServices = this.payProviderServices;
    const paymentProviderEntities = await this.payProviderEntityService.findAll();
    paymentProviderEntities.forEach((paymentProviderEntity) => {
      const index = implProviderServices.findIndex(
        (paymentProviderService) =>
          paymentProviderService.getPaymentProviderEnum() ===
          paymentProviderEntity.id
      );

      if (index < 0) {
        return;
      }

      const paymentProviderSerivce = implProviderServices[index];

      paymentProviderSerivce.setPaymentProviderEntity(paymentProviderEntity);

      providerServices.push(paymentProviderSerivce);
      providerServicesMap[paymentProviderEntity.id] = paymentProviderSerivce;

      implProviderServices.splice(index, 1);
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Deposit
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async deposit(
    depositRequest: PaymentProviderDepositRequestDto
  ): Promise<PaymentProviderDepositResult | any> {
    let depositResult: PaymentProviderDepositResult;

    // const inParams = new BCCheckClientInParams();
    // inParams.userId = depositRequest.userId;
    // inParams.currency = CurrencyEnum[CurrencyEnum.CNY];

    // const bcResult = await this.betConstructService.checkClient(inParams);

    // if (!bcResult.result) {
    //   depositResult = PaymentProviderDepositResult.bcCheckClientErrorFactory(
    //     bcResult
    //   );
    //   depositResult.errorFront = this.errorService.getMsgDeposit(
    //     depositRequest,
    //     depositResult,
    //     {
    //       bcFailed: true,
    //     }
    //   );

    //   return depositResult;
    // }

    const providerServices = await this.getDepositPaymentProviderServices(
      depositRequest
    );

    for (let i = 0; i < providerServices.length; i++) {
      const providerService = providerServices[i];

      const is_avaiable = await providerService.isAvailable();
      if (!is_avaiable) {
        continue;
      }

      depositResult = await providerService.depositGeneralWrapper(
        depositRequest
      );

      if (!depositResult || !depositResult.result) {
        continue;
      }

      break;
    }

    if (!depositResult) {
      depositResult = new PaymentProviderDepositResult();
      depositResult.code = ErrorCodeEnum.DEPOSIT_PROVIDER_NO_AVAILABLE;
      depositResult.result = false;
    }

    depositResult.errorFront = this.errorService.getMsgDeposit(
      depositRequest,
      depositResult
    );

    this.errorService.santitizeDeposit(depositRequest, depositResult);

    return depositResult;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get Deposit Info
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async depositByCard(request: PaymentDepositByCardRequestDto) {
    const iv = Buffer.from(decodeURIComponent(request.data2), 'base64');
    const password = this.configService.get<string>('DEPOSIT_KEY');
    const key = Buffer.from(password);

    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    let decDst = decipher.update(
      decodeURIComponent(request.data1),
      'base64',
      'utf8'
    );
    decDst += decipher.final('utf8');

    const data = <
      { paymentProviderId: number; amount: number; userId: number }
      >JSON.parse(decDst);

    const paymentProviderService: PaymentProviderService = this
      .payProviderServicesMap[data.paymentProviderId];

    if (!paymentProviderService) {
      return;
    }

    const params: PaymentDepositByCardRequest = {
      userId: data.userId,
      amount: data.amount,
      userName: request.userName,
      last4Digit: '', // request.last4Digit,
      hash: md5(
        `${decodeURIComponent(request.data1)}` +
        `${decodeURIComponent(request.data2)}`
      ),
    };

    return paymentProviderService.depositByCard(params);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Manual Deposit
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async manualDeposit(
    manualDepositRequest: PaymentManualDepositRequestDto,
    ip: string,
    headers
  ): Promise<PaymentManualDepositResultDto> {
    const response = new PaymentManualDepositResultDto();
    response.result = false;

    const paymentProviderService = <PaymentProviderService>(
      this.payProviderServicesMap[manualDepositRequest.paymentProviderId]
    );

    if (!paymentProviderService) {
      throw new NoProviderException();
    }

    const paymentProviderChannels = await this.payProviderChannelService.findAll(
      {
        include: [
          {
            model: PaymentProviderEntityModel,
            as: 'paymentProvider',
          },
          {
            model: ChannelModel,
            as: 'channel',
            include: [
              { model: PaymentSystemModel, as: 'fromPaymentSystem' },
              { model: PaymentSystemModel, as: 'toPaymentSystem' },
            ],
          },
        ],
        where: { id: manualDepositRequest.paymentProviderChannelId },
      }
    );

    if (!paymentProviderChannels || paymentProviderChannels.length < 1) {
      throw new NoProviderException();
    }

    const paymentProviderChannel = paymentProviderChannels[0];

    const depositRequest = new PaymentProviderDepositRequestDto();

    depositRequest.userId = `${manualDepositRequest.userId}`;
    depositRequest.amount = numeral(manualDepositRequest.amount).value();
    depositRequest.headers = headers;
    depositRequest.ip = ip;
    depositRequest.paymentSystem =
      PaymentSystemEnum[paymentProviderChannel.channel.fromPaymentSystemId];

    try {
      await this.sequelize.transaction(async (transaction) => {
        const channelDepositResultBundle = await paymentProviderService.depositByPaymentProviderChannel(
          depositRequest,
          paymentProviderChannel,
          null,
          transaction
        );

        if (!channelDepositResultBundle) {
          throw new PaymentProviderException();
        }

        await paymentProviderService.updateOrderAfterDeposit(
          channelDepositResultBundle.order,
          channelDepositResultBundle.depositResult,
          transaction
        );

        const channelDepositResult = channelDepositResultBundle.depositResult;

        response.result = channelDepositResult.result;

        if (!response.result) {
          response.errorCode = channelDepositResult.errorCode;
          response.errorMessage = channelDepositResult.errorMessage;
        }
        response.requestJson = channelDepositResult.channelRequestJson;
        response.responseJson = channelDepositResult.channelResponseJson;
        response.requestTime = channelDepositResult.channelRequestTime;

        if (!response.result) {
          throw new PaymentProviderException();
        }
      });
    } catch (error) {
      response.error = error;
      return response;
    }

    return response;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Manual Deposit
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async testDeposit(
    request: PaymentTestDepositRequestDto,
    ip: string,
    headers
  ): Promise<PaymentTestDepositResultDto> {
    const response = new PaymentTestDepositResultDto();
    response.result = false;

    const paymentProviderChannels = await this.payProviderChannelService.findAll(
      {
        include: [
          {
            model: PaymentProviderEntityModel,
            as: 'paymentProvider',
          },
          {
            model: ChannelModel,
            as: 'channel',
            include: [
              { model: PaymentSystemModel, as: 'fromPaymentSystem' },
              { model: PaymentSystemModel, as: 'toPaymentSystem' },
            ],
          },
        ],
        where: { id: request.paymentProviderChannelId },
      }
    );

    if (!paymentProviderChannels || paymentProviderChannels.length < 1) {
      throw new NoProviderException();
    }

    const paymentProviderChannel = paymentProviderChannels[0];

    const paymentProviderService = <PaymentProviderService>(
      this.payProviderServicesMap[paymentProviderChannel.paymentProviderId]
    );

    if (!paymentProviderService) {
      throw new NoProviderException();
    }

    const bank = request.bankId
      ? await this.bankService.findById(request.bankId)
      : null;

    const depositRequest = new PaymentProviderDepositRequestDto();

    depositRequest.userId = this.configService.get<string>(
      'testUserId'
    ) /* `${request.userId}` */;
    depositRequest.amount = numeral(request.amount).value();
    depositRequest.headers = headers;
    depositRequest.ip = ip;
    depositRequest.paymentSystem =
      PaymentSystemEnum[paymentProviderChannel.channel.fromPaymentSystemId];

    if (request.userName) {
      depositRequest.userName = request.userName;
    }

    if (request.phoneNumber) {
      depositRequest.phoneNumber = request.phoneNumber;
    }

    if (request.countryCallingCode) {
      depositRequest.countryCallingCode = request.countryCallingCode;
    }

    if (bank) {
      depositRequest.bankCode = bank.bankCode;
    }

    try {
      paymentProviderChannel.testedAt = moment().toDate();
      await paymentProviderChannel.save();

      await this.sequelize.transaction(async (transaction) => {
        const channelDepositResultBundle = await paymentProviderService.depositByPaymentProviderChannel(
          depositRequest,
          paymentProviderChannel,
          null,
          transaction
        );

        if (!channelDepositResultBundle) {
          throw new PaymentProviderException();
        }

        await paymentProviderService.updateOrderAfterDeposit(
          channelDepositResultBundle.order,
          channelDepositResultBundle.depositResult,
          transaction
        );

        const channelDepositResult = channelDepositResultBundle.depositResult;

        response.result = channelDepositResult.result;

        if (!response.result) {
          response.errorCode = channelDepositResult.errorCode;
          response.errorMessage = channelDepositResult.errorMessage;
        }
        response.requestJson = channelDepositResult.channelRequestJson;
        response.responseJson = channelDepositResult.channelResponseJson;
        response.requestTime = channelDepositResult.channelRequestTime;

        //console.log(response);

        if (!response.result) {
          throw new PaymentProviderException();
        }

        response.url = channelDepositResult.data.url;

        throw new PaymentProviderException();
      });
    } catch (error) {
      response.error = error;
      return response;
    }

    return response;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Manual Withdraw
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async manualWithdraw(
    manualWithdrawRequest: PaymentManualWithdrawRequestDto,
    ip: string,
    headers
  ): Promise<PaymentManualWithdrawResultDto> {
    const response = new PaymentManualWithdrawResultDto();
    response.result = false;

    const paymentProviderService = <PaymentProviderService>(
      this.payProviderServicesMap[manualWithdrawRequest.paymentProviderId]
    );

    if (!paymentProviderService) {
      throw new NoProviderException();
    }

    const paymentProviderChannels = await this.payProviderChannelService.findAll(
      {
        include: [
          {
            model: PaymentProviderEntityModel,
            as: 'paymentProvider',
          },
          {
            model: ChannelModel,
            as: 'channel',
            include: [
              { model: PaymentSystemModel, as: 'fromPaymentSystem' },
              { model: PaymentSystemModel, as: 'toPaymentSystem' },
            ],
          },
        ],
        where: {
          paymentProviderId: manualWithdrawRequest.paymentProviderId,
          '$channel.depositOrWithdrawable$': DepositOrWithdrawalEnum.WITHDRAWAL,
        },
      }
    );

    if (!paymentProviderChannels || paymentProviderChannels.length < 1) {
      throw new NoProviderException();
    }

    const paymentProviderChannel = paymentProviderChannels[0];

    const bank = await this.bankService.findById(manualWithdrawRequest.bankId);
    if (!bank) {
      throw new NoProviderException();
    }

    const withdrawRequest = new PaymentProviderWithdrawRequestDto();
    withdrawRequest.ip = ip;
    withdrawRequest.headers = headers;
    withdrawRequest.amount = numeral(manualWithdrawRequest.amount).value();
    withdrawRequest.orderId = manualWithdrawRequest.orderId;
    withdrawRequest.userId = `${manualWithdrawRequest.userId}`;
    withdrawRequest.bankCode = bank.bankCode;
    withdrawRequest.bankAccountName = manualWithdrawRequest.bankAccountName;
    withdrawRequest.bankAccountNumber = manualWithdrawRequest.bankAccountNumber;
    withdrawRequest.province = manualWithdrawRequest.province;
    withdrawRequest.city = manualWithdrawRequest.city;
    withdrawRequest.branch = manualWithdrawRequest.branch;
    withdrawRequest.currency = manualWithdrawRequest.currency;
    withdrawRequest.userName = manualWithdrawRequest.userName;
    withdrawRequest.countryCallingCode =
      manualWithdrawRequest.countryCallingCode;
    withdrawRequest.phoneNumber = manualWithdrawRequest.phoneNumber;
    withdrawRequest.hashcode = '';

    try {
      await this.sequelize.transaction(async (transaction) => {
        const ppcWithdrawResultBundle = await paymentProviderService.withdrawByPaymentProviderChannel(
          withdrawRequest,
          paymentProviderChannel,
          transaction
        );

        if (!ppcWithdrawResultBundle) {
          throw new PaymentProviderException();
        }

        await paymentProviderService.updateOrderAfterWithdraw(
          ppcWithdrawResultBundle.order,
          ppcWithdrawResultBundle.withdrawResult,
          transaction
        );

        const ppcWithdrawResult = ppcWithdrawResultBundle.withdrawResult;

        response.result = ppcWithdrawResult.result;

        if (!response.result) {
          response.errorCode = ppcWithdrawResult.errorCode;
          response.errorMessage = ppcWithdrawResult.errorMessage;
        }
        response.requestJson = ppcWithdrawResult.channelRequestJson;
        response.responseJson = ppcWithdrawResult.channelResponseJson;
        response.requestTime = ppcWithdrawResult.channelRequestTime;

        if (!response.result) {
          throw new PaymentProviderException();
        }
      });
    } catch (error) {
      response.error = error;
      return response;
    }

    return response;

    // const response = new PaymentManualWithdrawResultDto();
    // response.result = false;

    // const orderCreate = new WithdrawOrderCreateDto();

    // orderCreate.orderId =
    //   `${(numeral(Math.random().toString(10).substr(2, 1)).value() % 9) + 1}` +
    //   `${Math.random().toString(10).substr(2, 7)}`;

    // orderCreate.userId = `${manualWithdrawRequest.userId}`;
    // orderCreate.clientOrderId = `${manualWithdrawRequest.orderId}`;
    // orderCreate.currency = CurrencyEnum.CNY;
    // orderCreate.amount = numeral(manualWithdrawRequest.amount).value();

    // orderCreate.status = OrderStatusEnum.SUCCESS;

    // try {
    //   await this.sequelize.transaction(async (transaction) => {
    //     const order = await this.withdrawOrderService.create(orderCreate, {
    //       transaction,
    //     });

    //     if (!order) {
    //       throw new Error('creating withdraw order is failed');
    //     }

    //     const params = new BCWithdrawInParams();

    //     params.userId = numeral(order.userId).value();
    //     params.orderId = numeral(order.clientOrderId).value();
    //     params.amount = order.amount;
    //     params.currency = order.currency;
    //     params.reason = this.configService.get<string>(
    //       'betConstruct.withdraw.reason'
    //     );
    //     params.status = this.betConstructService.getBCWithdrawStatusByOrderStatus(
    //       <OrderStatusEnum>order.status
    //     );

    //     const bcOrder = await this.betConstructService.addWithdrawBcOrder(
    //       params,
    //       { transaction }
    //     );

    //     if (!bcOrder) {
    //       throw new Error('creating bcOrder record is failed');
    //     }
    //   });
    // } catch (error) {
    //   response.error = error;
    //   return response;
    // }

    // response.result = true;
    // return response;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Make Deposit Success
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async makeDepositSuccess(
    request: PaymentMakeDepositSuccessRequestDto
  ): Promise<boolean> {
    const pendingOrder = await this.depositPendingOrderRepository.findOne({
      where: { orderId: `${request.orderId}` },
    });

    if (!pendingOrder) {
      return false;
    }

    pendingOrder.status = OrderStatusEnum.SUCCESS;

    const orderCreate = DepositOrderCreateDto.pendingDepositFactory(
      pendingOrder
    );

    orderCreate.date = new Date();

    if (request.amount !== undefined) {
      orderCreate.amount = numeral(request.amount).value();
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await pendingOrder.destroy({ transaction });

        const order = new this.depositOrderRepository(orderCreate);

        await order.save({ transaction });

        const params = new BCDepositInParams();
        params.userId = numeral(order.userId).value();
        params.orderId = numeral(order.orderId).value();
        params.amount = numeral(order.amount).value();
        params.currency = CurrencyEnum[CurrencyEnum.CNY];

        const bcOrder = await this.betConstructService.addDepositBcOrder(
          params
        );
      });
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Make Withdraw Success
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async makeWithdrawSuccess(
    request: PaymentMakeWithdrawSuccessRequestDto
  ): Promise<boolean> {
    const pendingOrder = await this.withdrawPendingOrderRepository.findOne({
      where: { orderId: `${request.orderId}` },
    });

    if (!pendingOrder) {
      return false;
    }

    pendingOrder.status = OrderStatusEnum.SUCCESS;

    const orderCreate = WithdrawOrderCreateDto.pendingWithdrawFactory(
      pendingOrder
    );

    orderCreate.date = new Date();

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await pendingOrder.destroy({ transaction });

        const order = new this.withdrawOrderRepository(orderCreate);

        await order.save({ transaction });

        // create BC Order
        const params = new BCWithdrawInParams();

        params.userId = numeral(order.userId).value();
        params.orderId = numeral(order.clientOrderId).value();
        params.amount = order.amount;
        params.currency = order.currency;
        params.reason = this.configService.get<string>(
          'betConstruct.withdraw.reason'
        );
        params.status = this.betConstructService.getBCWithdrawStatusByOrderStatus(
          <OrderStatusEnum>order.status
        );

        const bcOrder = await this.betConstructService.addWithdrawBcOrder(
          params,
          { transaction }
        );

        if (!bcOrder) {
          throw new Error('creating bcOrder record is failed');
        }
      });
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Withdraw
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async withdraw(
    withdrawRequest: PaymentProviderWithdrawRequestDto
  ): Promise<PaymentProviderWithdrawResult> {
    let withdrawResult: PaymentProviderWithdrawResult;

    await this.testRepository.create({ a: JSON.stringify(withdrawRequest) });

    // check withdraw ipwhitelist
    const inParamsIP = new BCCheckWithdrawIPWhiteListInparams();
    inParamsIP.ip = withdrawRequest.ip;
    const checkWithdrawIPOut = this.betConstructService.checkWithdrawIPWhitelist(
      inParamsIP
    );

    if (!checkWithdrawIPOut.result) {
      // console.log(inParamsIP.ip);
      // return PaymentProviderWithdrawResult.bcCheckIPWhiteListErrorFactory(
      //   checkWithdrawIPOut
      // );
      withdrawResult.code = ErrorCodeEnum.WITHDRAW_IP_INVALID;
      withdrawResult.result = false;
      this.errorService.santitizeWithdraw(withdrawRequest, withdrawResult);

      return withdrawResult;
    }

    // check withdraw hash
    const inParamsHash = new BCCheckWithdrawHashInparams();
    inParamsHash.amount = withdrawRequest.amount;
    inParamsHash.bankAccountName = withdrawRequest.bankAccountName;
    inParamsHash.bankAccountNumber = withdrawRequest.bankAccountNumber;
    inParamsHash.bankCode = withdrawRequest.bankCode;
    inParamsHash.branch = withdrawRequest.branch;
    inParamsHash.city = withdrawRequest.city;
    inParamsHash.currency = withdrawRequest.currency;
    inParamsHash.hashCode = withdrawRequest.hashcode;
    inParamsHash.orderId = withdrawRequest.orderId;
    inParamsHash.province = withdrawRequest.province;
    inParamsHash.userId = withdrawRequest.userId;
    inParamsHash.userName = withdrawRequest.userName;
    inParamsHash.phoneNumber = withdrawRequest.phoneNumberRaw;

    const checkWithdrawHashOut = this.betConstructService.checkWithdrawHash(
      inParamsHash
    );

    if (!checkWithdrawHashOut.result) {
      // return PaymentProviderWithdrawResult.bcCheckWithdrawHashErrorFactory(
      //   checkWithdrawHashOut
      // );
      withdrawResult.code = ErrorCodeEnum.WITHDRAW_SIGN_INVALID;
      withdrawResult.result = false;
    }

    withdrawResult = new PaymentProviderWithdrawResult();
    //withdrawResult.response = { code: 0, message: 'OK' };

    // get Withdrawable PaymentProviderServices
    const providerServices = await this.getWithdrawPaymentProviderServices(
      withdrawRequest
    );

    let withdrawResultProvider: PaymentProviderWithdrawResult;
    for (let i = 0; i < providerServices.length; i++) {
      const providerService = providerServices[i];

      const is_avaiable = await providerService.isAvailable();
      if (!is_avaiable) {
        continue;
      }

      withdrawResultProvider = await providerService.withdrawGeneralWrapper(
        withdrawRequest
      );

      if (!withdrawResultProvider || !withdrawResultProvider.result) {
        continue;
      }

      break;
    }

    if (!withdrawResultProvider) {
      withdrawResult.code = ErrorCodeEnum.WITHDRAW_PROVIDER_NO_AVAILABLE;
      withdrawResult.result = false;
      this.errorService.santitizeWithdraw(withdrawRequest, withdrawResult);
      return withdrawResult;
    }

    if (!withdrawResult.result) {
      const pendingOrder = await PaymentProviderService.createPendingWithdrawOrderByRequest(
        withdrawRequest,
        {
          bankService: this.bankService,
          withdrawPendingOrderService: this.withdrawPendingOrderService,
        }
      );

      pendingOrder.status = OrderStatusEnum.FAILED;
      pendingOrder.errorCode = '100';
      pendingOrder.errorMessage = 'No PaymentProvider';

      await pendingOrder.save();

      withdrawResult.code = withdrawResultProvider.code;
      this.errorService.santitizeWithdraw(withdrawRequest, withdrawResult);
      return withdrawResult;

      // withdrawResult.response = withdrawResultProvider
      //   ? {
      //     code: withdrawResultProvider.response.code,
      //     message: withdrawResultProvider.response.message,
      //   }
      //   : { code: 100, message: 'There is no payment provider' };
    }

    // create bcOrders Item
    // if (
    //   !withdrawResultProvider ||
    //   `${withdrawResultProvider.response.code}` !== `0`
    // ) {
    //   const bcWithdrawInParams = new BCWithdrawInParams();

    //   bcWithdrawInParams.amount = withdrawRequest.amount;
    //   bcWithdrawInParams.currency = withdrawRequest.currency;
    //   bcWithdrawInParams.orderId = numeral(withdrawRequest.orderId).value();
    //   bcWithdrawInParams.reason = this.configService.get<string>(
    //     'betConstruct.withdraw.reason'
    //   );
    //   bcWithdrawInParams.status = BCWithdrawStatus.FAILED;
    //   bcWithdrawInParams.userId = withdrawRequest.userId;

    //   const bcOrder = await this.betConstructService.addWithdrawBcOrder(
    //     bcWithdrawInParams
    //   );

    //   console.log(':BCOrder Created');
    // }

    // if (!withdrawResult) {
    //   throw new NoProviderException();
    // }
    withdrawResult.code = 0;
    withdrawResult.msg = "Success";
    return withdrawResult;
  }

  async bcWithdraw(request) {
    const params = new BCWithdrawInParams();

    params.amount = request.amount;
    params.currency = request.currency;
    params.orderId = request.orderId;
    params.reason = 'this is test reason';
    params.status = BCWithdrawStatus.FAILED;
    params.userId = request.userId;

    const withdrawOut = await this.betConstructService.withdraw(params);

    if (withdrawOut) {
      return {
        response: {
          code: withdrawOut.result ? 0 : 101,
          message: withdrawOut.result ? null : withdrawOut.errorMessage,
        },
      };
    }

    return null;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get Deposit Payment Provider Service List
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  private async getDepositPaymentProviderServices(
    depositRequest: PaymentProviderDepositRequestDto
  ): Promise<PaymentProviderService[]> {
    const depositProviderServices = [];

    const paymetnSystemId: number =
      PaymentSystemEnum[depositRequest.paymentSystem];

    const depositProviderEntities = await this.payProviderEntityService.findDepositAvailableProvider();

    if (!depositProviderEntities || depositProviderEntities.length < 1) {
      return depositProviderServices;
    }

    for (let i = 0; i < depositProviderEntities.length; i++) {
      const providerEntity = depositProviderEntities[i];
      const providerService = this.payProviderServicesMap[providerEntity.id];

      if (!providerService) {
        continue;
      }

      const providerChannels = await this.payProviderChannelService.getDepositablesByPaymentSystem(
        paymetnSystemId,
        providerEntity.id,
        depositRequest.amount
      );

      if (!providerChannels || providerChannels.length < 1) {
        continue;
      }

      depositProviderServices.push(providerService);
    }

    return depositProviderServices;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get Withdraw Payment Provider Service List
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  private async getWithdrawPaymentProviderServices(
    withdrawRequest: PaymentWithdrawRequestDto
  ): Promise<PaymentProviderService[]> {
    const withdrawProviderServices = [];

    const withdrawProviderEntities = await this.payProviderEntityService.findWithdrawalAvailableProvider();

    if (!withdrawProviderEntities || withdrawProviderEntities.length < 1) {
      return withdrawProviderServices;
    }

    for (let i = 0; i < withdrawProviderEntities.length; i++) {
      const providerEntity = withdrawProviderEntities[i];
      const providerService = this.payProviderServicesMap[providerEntity.id];

      if (!providerService) {
        continue;
      }

      const providerChannels = await this.payProviderChannelService.getWithdrawablesByPaymentProvider(
        providerEntity.id,
        withdrawRequest.amount
      );

      if (!providerChannels || providerChannels.length < 1) {
        continue;
      }

      withdrawProviderServices.push(providerService);
    }

    return withdrawProviderServices;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get PaymentProviderChannel Depositable
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public async getPaymentProviderChannelDepositable(
    paymentProviderChannel: PaymentProviderChannelModel
  ): Promise<boolean> {
    const paymentProvider = await this.payProviderEntityService.findById(
      paymentProviderChannel.paymentProviderId
    );

    if (!paymentProvider) {
      return false;
    }

    const paymentProviderService: PaymentProviderService = this
      .payProviderServicesMap[paymentProvider.id];

    if (!paymentProviderService) {
      return false;
    }

    const depositRequest = new PaymentProviderDepositRequestDto();
    depositRequest.paymentSystem =
      PaymentSystemEnum[paymentProviderChannel.channel.fromPaymentSystemId];
    depositRequest.amount = this.configService.get<number>('minDeposit.AMOUNT');
    depositRequest.userId = this.configService.get<string>('minDeposit.USERID');

    if (paymentProviderChannel.paymentProviderId === PaymentProviderEnum.D1F) {
      const channel = await this.channelService.findById(
        paymentProviderChannel.channelId
      );
      if (!channel) {
        return false;
      }
      if (channel.fromPaymentSystem.isBank && channel.toPaymentSystem.isBank) {
        depositRequest.bankCode =
          BankCodeEnum[this.configService.get<number>('minDeposit.D1FBANKID')];
      }
    }

    depositRequest.headers = {
      'user-agent': this.configService.get<number>('minDeposit.USERAGENT'),
    };
    depositRequest.ip = this.configService.get<string>('minDeposit.IP');

    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>: ', paymentProviderChannel.providerChannelName);
    // console.log(depositRequest);

    const depositResult = await paymentProviderService.channelDepositPreTryWrapper(
      depositRequest,
      paymentProviderChannel
    );

    // console.log(depositResult);
    // console.log('===========================');

    const isAvailable = this.getDepositableByDepositResult(
      paymentProviderChannel,
      depositResult
    );

    return isAvailable;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get PaymentProviderBank Withdrawable
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public async getPaymentProviderBankWithdrawable(
    payProviderBank: PaymentProviderBankModel
  ): Promise<boolean> {
    const paymentProviderId = payProviderBank.paymentProviderId;

    if (paymentProviderId === PaymentProviderEnum.HENGXIN) {
      return true;
    }

    const payProviderService: PaymentProviderService = this
      .payProviderServicesMap[paymentProviderId];
    if (!payProviderService) {
      return false;
    }

    const paymentProviderChannels = await this.payProviderChannelService.findAll(
      {
        include: [{ model: ChannelModel, as: 'channel' }],
        where: {
          paymentProviderId,
          '$channel.depositOrWithdrawable$': DepositOrWithdrawalEnum.WITHDRAWAL,
        },
      }
    );

    const bank = await this.bankService.findById(payProviderBank.bankId);
    if (!bank) {
      return false;
    }

    const withdrawRequest = new PaymentWithdrawRequestDto();

    withdrawRequest.bankCode = BankCodeEnum[payProviderBank.bankId];

    withdrawRequest.amount = this.configService.get<number>(
      'minWithdraw.AMOUNT'
    );
    withdrawRequest.userId =
      this.configService.get<string>('minWithdraw.USERID_PREFIX') +
      Math.random().toString(10).substr(2, 5);
    withdrawRequest.currency = this.configService.get<CurrencyEnum>(
      'minWithdraw.CURRENCY'
    );
    withdrawRequest.bankAccountName =
      this.configService.get<string>('minWithdraw.BANKACCOUNTNAME_PREFIX') +
      Math.random().toString(36).substring(2, 7);
    withdrawRequest.bankAccountNumber =
      this.configService.get<string>('minWithdraw.BANKACCOUNTNUMBER_PREFIX') +
      Math.random().toString(10).substr(2, 10);
    withdrawRequest.city =
      this.configService.get<string>('minWithdraw.CITY') +
      Math.random().toString(36).substring(2, 7);
    withdrawRequest.province =
      this.configService.get<string>('minWithdraw.PROVINCE') +
      Math.random().toString(36).substring(2, 7);
    withdrawRequest.orderId =
      Date.now() + Math.random().toString(36).substring(2, 7);
    withdrawRequest.hashcode =
      this.configService.get<string>('minWithdraw.HASHCODE') +
      Math.random().toString(10).substr(2, 10);

    let isAvailableFinal = false;
    for (let i = 0; i < paymentProviderChannels.length; i++) {
      const paymentProviderChannel = paymentProviderChannels[i];

      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log(withdrawRequest);

      const withdrawResult = await payProviderService.channelWithdrawPreTryWrapper(
        withdrawRequest,
        paymentProviderChannel
      );

      console.log(withdrawResult);
      console.log('===========================');

      const isAvailable = this.getWithdrawableByWithdrawResult(
        payProviderBank,
        withdrawResult
      );

      paymentProviderChannel.isAvailable = isAvailable;

      await paymentProviderChannel.save();

      if (isAvailable) {
        isAvailableFinal = true;
      }
    }

    return isAvailableFinal;
  }

  private getWithdrawableByWithdrawResult(
    paymentProviderBank: PaymentProviderBankModel,
    withdrawResult: PaymentProviderChannelWithdrawResult
  ): boolean {
    if (!withdrawResult) {
      return false;
    }

    if (withdrawResult.result) {
      return true;
    }

    const errorCode = withdrawResult.errorCode;
    let minAmountErrorCode: number;

    switch (paymentProviderBank.paymentProviderId) {
      case PaymentProviderEnum.MSZF:
        minAmountErrorCode = this.configService.get<number>(
          'mszf.WITHDRAW_MINAMOUNT_ERROR_CODE'
        );
        return `${errorCode}` === `${minAmountErrorCode}`;
      case PaymentProviderEnum.D1F:
        return false;
      case PaymentProviderEnum.XINGCHEN:
        minAmountErrorCode = this.configService.get<number>(
          'xingchen.WITHDRAW_MINAMOUNT_ERROR_CODE'
        );
        return `${errorCode}` === `${minAmountErrorCode}`;
      case PaymentProviderEnum.UZPAY:
        minAmountErrorCode = this.configService.get<number>(
          'uzpay.WITHDRAW_MINAMOUNT_ERROR_CODE'
        );
        return `${errorCode}` === `${minAmountErrorCode}`;
      default:
        break;
    }
    return true;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get Depositable By DepositResult
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  private getDepositableByDepositResult(
    paymentProviderChannel: PaymentProviderChannelModel,
    depositResult: PaymentProviderChannelDepositResult
  ): boolean {
    if (!depositResult) {
      return false;
    }

    if (depositResult.result) {
      return true;
    }

    const errorCode = depositResult.errorCode;
    let minAmountErrorCode: number;

    switch (paymentProviderChannel.paymentProviderId) {
      case PaymentProviderEnum.MSZF:
        minAmountErrorCode = this.configService.get<number>(
          'mszf.DEPOSIT_MINAMOUNT_ERROR_CODE'
        );
        return `${errorCode}` === `${minAmountErrorCode}`;
      case PaymentProviderEnum.D1F:
        return false;
      case PaymentProviderEnum.XINGCHEN:
        minAmountErrorCode = this.configService.get<number>(
          'xingchen.DEPOSIT_MINAMOUNT_ERROR_CODE'
        );
        return `${errorCode}` === `${minAmountErrorCode}`;
      case PaymentProviderEnum.UZPAY:
        minAmountErrorCode = this.configService.get<number>(
          'uzpay.DEPOSIT_MINAMOUNT_ERROR_CODE'
        );
        return `${errorCode}` === `${minAmountErrorCode}`;
      default:
        break;
    }

    return false;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get Depositable PaymentSystems
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async getDepositablePaymentSystems(): Promise<DepositablePaymentSystem[]> {
    return this.paymentSystemService.getDepositables(true);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get Depositable PaymentSystems
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async getDepositableUsdtProts(): Promise<DepositableUsdtProto[]> {
    return this.usdtProtoService.getDepositables(true);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get Depositable Channels
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async getDepositableChannels(): Promise<DepositableChannel[]> {
    return this.payProviderChannelService.getDepositables();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get Depositable Channels
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async getWithdrawableBanks() {
    const response = {
      options: {
        withdrawDefaultMinAmount: null,
        withdrawDefaultMaxAmount: null,
        dailyMaxNumWithdraw: null,
        dailyMaxAmountWithdraw: null,
      },
      banks: await this.payProviderBankService.getWithdrawableBanks(true),
    };

    const optWithdrawDefaultMinAmount = await this.optionsRepository.findOne({
      where: { optName: 'withdrawDefaultMinAmount' },
    });
    if (optWithdrawDefaultMinAmount != null) {
      response.options.withdrawDefaultMinAmount = numeral(
        optWithdrawDefaultMinAmount.optValue
      ).value();
    }

    const optWithdrawDefaultMaxAmount = await this.optionsRepository.findOne({
      where: { optName: 'withdrawDefaultMaxAmount' },
    });
    if (optWithdrawDefaultMaxAmount != null) {
      response.options.withdrawDefaultMaxAmount = numeral(
        optWithdrawDefaultMaxAmount.optValue
      ).value();
    }

    const optDailyMaxNumWithdraw = await this.optionsRepository.findOne({
      where: { optName: 'dailyMaxNumWithdraw' },
    });
    if (optDailyMaxNumWithdraw != null) {
      response.options.dailyMaxNumWithdraw = numeral(
        optDailyMaxNumWithdraw.optValue
      ).value();
    }

    const optDailyMaxAmountWithdraw = await this.optionsRepository.findOne({
      where: { optName: 'dailyMaxAmountWithdraw' },
    });
    if (optDailyMaxAmountWithdraw != null) {
      response.options.dailyMaxAmountWithdraw = numeral(
        optDailyMaxAmountWithdraw.optValue
      ).value();
    }

    return response;
  }
}
