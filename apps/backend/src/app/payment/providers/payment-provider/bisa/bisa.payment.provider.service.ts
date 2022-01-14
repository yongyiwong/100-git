import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { PaymentProviderEnum, OrderStatusEnum } from '@workspace/enums';
import { BankModel } from '../../../../models/bank.entity';
import { PaymentProviderChannelModel } from '../../../../models/payment.provider.channel.model';
import { PaymentProviderUsdtProtocolModel } from '../../../../models/payment.provider.usdt.protocol.model';
import { TestModel } from '../../../../models/test.entity';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { BankService } from '../../../bank/bank.service';
import { BetConstructService } from '../../../betContruct/betConstruct.service';
import { ChannelService } from '../../../channel/channel.service';
import { PaymentWithdrawRequestDto } from '../../../dto/payment.withdraw.request.dto';
import { DepositOrderService } from '../../../order/deposit-order/deposit.order.service';
import { DepositPendingOrderService } from '../../../order/deposit-pending-order/deposit.pending.order.service';
import { WithdrawOrderService } from '../../../order/withdraw-order/withdraw.order.service';
import { WithdrawPendingOrderService } from '../../../order/withdraw-pending-order/withdraw.pending.order.service';
import { PaymentProviderBankService } from '../../payment-provider-bank/payment.provider.bank.service';
import { PaymentProviderCardService } from '../../payment-provider-card/payment.provider.card.service';
import { PaymentProviderChannelService } from '../../payment-provider-channel/payment.provider.channel.service';
import { PaymentProviderEntityService } from '../../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderSharedService } from '../../payment-provider-shared/payment.provider.shared.service';
import { PaymentProviderUsdtProtoService } from '../../payment-provider-usdt-protocol/payment.provider.usdt.proto.service';
import { PaymentProviderDepositRequestDto } from '../payment.provider.deposit.request.dto';
import {
  PaymentProviderChannelDepositResult,
  PaymentProviderDepositResult,
} from '../payment.provider.deposit.result';
import {
  PaymentProviderChannelDepositResultBundle,
  PaymentProviderChannelWithdrawResultBundle,
  PaymentProviderService,
} from '../payment.provider.service';
import {
  PaymentProviderChannelWithdrawResult,
  PaymentProviderWithdrawResult,
} from '../payment.provider.withdraw.result';
import {
  BisaChannelDepositResult,
  BisaDepositResult,
} from './dto/bisa.deposit.result';
import {
  BisaChannelWithdrawResult,
  BisaWithdrawResult,
} from './dto/bisa.withdraw.result';
import { DepositPendingOrderModel } from '../../../../models/deposit.pending.order.model';
import { BisaDepositRequestParams } from './dto/bisa.deposit.request.params';
import * as moment from 'moment-timezone';
import * as crypto from 'crypto';
import * as numeral from 'numeral';
import { BisaDepositStatusResponseDto } from './dto/bisa.deposit.status.response.dto';
import { BisaWithdrawStatusResponseDto } from './dto/bisa.withdraw.status.response.dto';
import { PaymentProviderWithdrawRequestDto } from '../payment.provider.withdraw.request.dto';
import {
  NotSupportedBank,
  PaymentProviderException,
} from '../../../payment.exception';
import { BisaWithdrawRequestParams } from './dto/bisa.withdraw.request.params';
import { OptionsService } from '../../../../options/options.service';
import { ErrorCodeEnum } from '../../../../error/enums/errorCodeEnum';

@Injectable()
export class BisaPaymentProviderService extends PaymentProviderService {
  constructor(
    @InjectModel(BankModel)
    private bankRepository: typeof BankModel,

    protected configService: ConfigService,
    protected channelService: ChannelService,
    protected bankService: BankService,
    protected depositPendingOrderService: DepositPendingOrderService,
    protected depositOrderService: DepositOrderService,
    protected withdrawPendingOrderService: WithdrawPendingOrderService,
    protected withdrawOrderService: WithdrawOrderService,
    protected paymentProviderChannelService: PaymentProviderChannelService,
    protected paymentProviderBankService: PaymentProviderBankService,
    protected paymentProviderUsdtProtoService: PaymentProviderUsdtProtoService,
    protected paymentProviderCardService: PaymentProviderCardService,
    protected payProviderEntityService: PaymentProviderEntityService,
    protected paymentProviderSharedService: PaymentProviderSharedService,
    protected sequelize: Sequelize,
    protected betConstructService: BetConstructService,
    protected optionsService: OptionsService,
    private httpService: HttpService,

    @InjectModel(TestModel)
    private testRepository: typeof TestModel
  ) {
    super(
      configService,
      channelService,
      bankService,
      depositPendingOrderService,
      depositOrderService,
      withdrawPendingOrderService,
      withdrawOrderService,
      paymentProviderChannelService,
      paymentProviderBankService,
      paymentProviderUsdtProtoService,
      paymentProviderCardService,
      payProviderEntityService,
      paymentProviderSharedService,
      sequelize,
      betConstructService,
      optionsService
    );
  }

  getPaymentProviderEnum(): PaymentProviderEnum {
    return PaymentProviderEnum.Bisa;
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  public async depositByPaymentProviderChannel(
    depositRequest: PaymentProviderDepositRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    paymentProviderUsdtProto: PaymentProviderUsdtProtocolModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelDepositResultBundle> {
    const channelDepositResultBundle = new PaymentProviderChannelDepositResultBundle();

    let depositResult: BisaChannelDepositResult;
    let order: DepositPendingOrderModel;

    const channelDepositResultDefault = { providerName: this.getPaymentProviderName() };

    order = await this.createOrderBeforeDeposit(
      depositRequest,
      paymentProviderChannel,
      transaction
    );
    if (!order) {
      return {
        depositResult: { ...channelDepositResultDefault, result: false, code: ErrorCodeEnum.DEPOSIT_PROVIDER_ORDER_NOT_CREATED },
        order: null
      };
    }

    const optItem = await this.optionsService.findOne({
      where: { optName: 'huobiExchangeData' },
    });
    if (!optItem) {
      return {
        depositResult: { ...channelDepositResultDefault, result: false, code: ErrorCodeEnum.DEPOSIT_PROVIDER_USDT_RATE_NOT_FOUND },
        order
      };
    }

    const huobiExchangeData = <
      { data_time: string; name: string; rate: number; time: string }
      >JSON.parse(optItem.optValue.toString('utf8'));

    const usdtExchangeRate = huobiExchangeData.rate;
    order.usdtExchangeRate = usdtExchangeRate;

    const params = new BisaDepositRequestParams();
    params.order_key = order.orderId;
    params.coin = paymentProviderUsdtProto.providerUsdtProtoCurrency;
    params.notification_link =
      this.getBaseUrl(depositRequest.headers['host']) +
      this.configService.get<string>('bisa.DEPOSIT_SUCCESS_URL');
    params.amount = numeral(order.amount / usdtExchangeRate).format('0.00');
    params.expired_at = numeral(moment().add(1, 'hour').format('x')).value();
    params.scale = 0;

    const host = this.configService.get<string>('BISA_HOST');
    const url = this.configService.get<string>('BISA_DEPOSIT_URL');

    const algo = 'sha512'; // sha256 or sha384 are also supported
    const secret = this.configService.get('BISA_SECRET'); // your api secret
    const body = JSON.stringify({ ...params, timestamp: Date.now() }); // current timestamp is required
    const digest = crypto.createHmac(algo, secret).update(body).digest('hex');

    // console.log(body);
    // console.log(`${algo}=${digest}`);

    const response = await this.httpService
      .post(`https://${host}/${url}`, body, {
        headers: {
          'content-type': 'application/json',
          'x-bisa-version': 1,
          'x-bisa-token': this.configService.get<string>('BISA_TOKEN'),
          'x-bisa-signature': `${algo}=${digest}`,
        },
      })
      .toPromise();

    depositResult = BisaChannelDepositResult.responseFactory(
      response,
      this.getPaymentProviderName()
    );

    if (!depositResult.result) {
      depositResult.code = ErrorCodeEnum.DEPOSIT_PROVIDER_FAILED;
    }

    depositResult.channelRequestTime = moment()
      .utcOffset('+08:00')
      .format('YYYY-MM-DD HH:mm:ss');
    depositResult.channelRequestJson = JSON.stringify(params);
    depositResult.channelResponseJson = JSON.stringify(response.data);

    channelDepositResultBundle.depositResult = depositResult;
    channelDepositResultBundle.order = order;

    return channelDepositResultBundle;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Deposit Callback
  ////////////////////////////////////////////////////////////////////////////////
  async depositCallback(
    depositStatusResponse: BisaDepositStatusResponseDto,
    ip: string,
    headers: {}
  ) {
    await this.testRepository.create({
      a: JSON.stringify({ ip, res: JSON.stringify(depositStatusResponse) }),
    });

    if (!(await this.beforeDepositCallback(depositStatusResponse, ip))) {
      throw new HttpException('ip is invalid', HttpStatus.BAD_REQUEST);
    }

    const bisaToken = headers['x-bisa-token'];
    const bisaSignature = headers['x-bisa-signature'];

    if (this.configService.get<string>('BISA_NOTIFY_TOKEN') !== bisaToken) {
      throw new HttpException(
        'notify token is invalid',
        HttpStatus.BAD_REQUEST
      );
    }

    const algo = 'sha512'; // sha256 or sha384 are also supported
    const secret = this.configService.get('BISA_NOTIFY_SECRET'); // your api secret
    const body = JSON.stringify(depositStatusResponse); // current timestamp is required
    const digest = crypto.createHmac(algo, secret).update(body).digest('hex');

    if (`${algo}=${digest}` !== bisaSignature) {
      throw new HttpException('signature is invalid', HttpStatus.BAD_REQUEST);
    }

    const order = await this.depositPendingOrderService.findByOrderId(
      depositStatusResponse.order_key
    );

    if (!order) {
      const orderAlready = await this.depositOrderService.findByOrderId(
        depositStatusResponse.order_key
      );

      if (orderAlready) {
        return true;
      }

      throw new HttpException('orderKey is invalid', HttpStatus.BAD_REQUEST);
    }

    if (order.providerOrderId !== depositStatusResponse.id) {
      throw new HttpException('deposit id is invalid', HttpStatus.BAD_REQUEST);
    }

    order.status = OrderStatusEnum.SUCCESS;

    if (order.status === OrderStatusEnum.SUCCESS) {
      const bcOrder = await this.depositBCAfterDepositCallback(order);
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.updateOrderAfterDepositCallback(order, transaction);
      });
    } catch (error) {
      throw new HttpException(
        'system error(transaction)',
        HttpStatus.BAD_REQUEST
      );
    }

    return true;
  }

  public async withdrawByPaymentProviderChannel(
    withdrawRequest: PaymentProviderWithdrawRequestDto,
    paymentProviderChannel: PaymentProviderChannelModel,
    transaction: Transaction
  ): Promise<PaymentProviderChannelWithdrawResultBundle> {
    const withdrawProcResult = new PaymentProviderChannelWithdrawResultBundle();

    let withdrawResult: BisaChannelWithdrawResult;

    const channelWithdrawResultDefault = { providerName: this.getPaymentProviderName() };

    const order = await this.createOrderBeforeWithdraw(
      withdrawRequest,
      transaction
    );
    if (!order) {
      return {
        withdrawResult: { ...channelWithdrawResultDefault, result: false, code: ErrorCodeEnum.WITHDRAW_PROVIDER_ORDER_NOT_CREATED },
        order: null
      };
    }

    const address = '0x756F45E3FA69347A9A973A725E3C98bC4db0b5a0';

    const optItem = await this.optionsService.findOne({
      where: { optName: 'huobiExchangeData' },
    });
    if (!optItem) {
      return {
        withdrawResult: { ...channelWithdrawResultDefault, result: false, code: ErrorCodeEnum.WITHDRAW_PROVIDER_USDT_RATE_NOT_FOUND },
        order
      };
    }

    const huobiExchangeData = <
      { data_time: string; name: string; rate: number; time: string }
      >JSON.parse(optItem.optValue.toString('utf8'));

    const usdtExchangeRate = huobiExchangeData.rate;
    //order.usdtExchangeRate = usdtExchangeRate;

    const params = new BisaWithdrawRequestParams();
    params.address = address;
    params.coin = 'usdt@erc20';
    params.tag = null;
    params.withdrawal_key = order.orderId;
    params.notification_link =
      this.getBaseUrl(withdrawRequest.headers['host']) +
      this.configService.get<string>('bisa.WITHDRAWAL_SUCCESS_URL');
    params.amount = numeral(order.amount / usdtExchangeRate).format('0.00');
    params.scale = 0;

    const host = this.configService.get<string>('BISA_HOST');
    const url = this.configService.get<string>('BISA_WITHDRAW_URL');

    const algo = 'sha512'; // sha256 or sha384 are also supported
    const secret = this.configService.get('BISA_SECRET'); // your api secret
    const body = JSON.stringify({ ...params, timestamp: Date.now() }); // current timestamp is required
    const digest = crypto.createHmac(algo, secret).update(body).digest('hex');

    // console.log(body);
    // console.log(`${algo}=${digest}`);

    const response = await this.httpService
      .post(`https://${host}/${url}`, body, {
        headers: {
          'content-type': 'application/json',
          'x-bisa-version': 1,
          'x-bisa-token': this.configService.get<string>('BISA_TOKEN'),
          'x-bisa-signature': `${algo}=${digest}`,
        },
      })
      .toPromise();

    withdrawResult = BisaChannelWithdrawResult.responseFactory(
      response,
      this.getPaymentProviderName()
    );

    withdrawProcResult.withdrawResult = withdrawResult;
    withdrawProcResult.order = order;

    if (!withdrawResult.result) {
      withdrawResult.code = ErrorCodeEnum.WITHDRAW_PROVIDER_FAILED;
    }

    return withdrawProcResult;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Withdraw Callback
  ////////////////////////////////////////////////////////////////////////////////
  async withdrawCallback(
    withdrawStatusResponse: BisaWithdrawStatusResponseDto,
    ip: string,
    headers: {}
  ) {
    await this.testRepository.create({
      a: JSON.stringify({ ip, res: JSON.stringify(withdrawStatusResponse) }),
    });

    if (!(await this.beforeWithdrawCallback(withdrawStatusResponse, ip))) {
      throw new HttpException('ip is invalid', HttpStatus.BAD_REQUEST);
    }

    const order = await this.withdrawPendingOrderService.findByOrderId(
      withdrawStatusResponse.withdrawal_key
    );

    if (!order) {
      const orderAlready = await this.withdrawOrderService.findByOrderId(
        withdrawStatusResponse.withdrawal_key
      );

      if (orderAlready) {
        return true;
      }

      throw new HttpException(
        'withdrawalKey is invalid',
        HttpStatus.BAD_REQUEST
      );
    }

    order.status = OrderStatusEnum.SUCCESS;

    if (order.status === OrderStatusEnum.SUCCESS) {
      await this.withdrawBCAfterWithdrawCallback(order);
    }

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.updateOrderAfterWithdrawCallback(order, transaction);
      });
    } catch (error) {
      throw new HttpException(
        'system error(transaction)',
        HttpStatus.BAD_REQUEST
      );
    }

    return true;
  }

  public depositErrorFactory(error: any): PaymentProviderDepositResult {
    return BisaDepositResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('bisa.DEFAULT_ERROR_CODE')
    );
  }

  public withdrawErrorFactory(error: any): PaymentProviderWithdrawResult {
    return BisaWithdrawResult.errorFactory(
      error,
      this.getPaymentProviderName(),
      this.configService.get<string>('bisa.DEFAULT_ERROR_CODE')
    );
  }

  getOrderStatusByDepositStatus(argDepositStatus: {}): OrderStatusEnum {
    throw new Error('Method not implemented.');
  }

  getOrderStatusByWithdrawStatus(argWithdrawStatus: {}): OrderStatusEnum {
    throw new Error('Method not implemented.');
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Frozen Status By Channel DepositResult
  ////////////////////////////////////////////////////////////////////////////////
  protected getFrozenByChannelDepositResult(
    paymentProviderChannel: PaymentProviderChannelModel,
    depositRequest: PaymentProviderDepositRequestDto,
    depositResult: PaymentProviderChannelDepositResult
  ): boolean {
    const errorCode = depositResult
      ? numeral(depositResult.errorCode).value()
      : null;
    if (errorCode === null) {
      return false;
    }

    const frozenCodes =
      this.configService.get<number[]>('bisa.DEPOSIT_FROZEN_CODE') || [];

    return (
      frozenCodes.filter((frozenCode) => frozenCode === errorCode).length > 0
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Get Frozen Status By Channel WithdrawResult
  ////////////////////////////////////////////////////////////////////////////////
  protected getFrozenByChannelWithdrawResult(
    withdrawResult: PaymentProviderChannelWithdrawResult
  ): boolean {
    const errorCode = withdrawResult
      ? numeral(withdrawResult.errorCode).value()
      : null;
    if (errorCode === null) {
      return false;
    }

    const frozenCodes =
      this.configService.get<number[]>('bisa.WITHDRAW_FROZEN_CODE') || [];

    return (
      frozenCodes.filter((frozenCode) => frozenCode === errorCode).length > 0
    );
  }
}
