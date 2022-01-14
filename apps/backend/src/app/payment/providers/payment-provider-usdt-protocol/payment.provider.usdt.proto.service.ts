import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PaymentProviderUsdtProtocolModel } from '../../../models/payment.provider.usdt.protocol.model';
import { UsdtProtocolModel } from '../../../models/usdtProtocol';
import { FindOptions, QueryTypes, SaveOptions } from 'sequelize';
import { PaymentProviderUsdtProtoUpdateRequestDto } from './dto/payment.provider.usdt.proto.update.request.dto';
import { PaymentProviderUsdtProtoUpdateResponseDto } from './dto/payment.provider.usdt.proto.update.response.dto';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { PaymentProviderUsdtProtoGetRequestDto } from './dto/payment.provider.usdt.proto.get.request.dto';
import { UpdatePaymentProviderUsdtProtoDto } from './dto/update-payment.provider.usdt.proto.dto';
import { DepositOrWithdrawalEnum } from '../payment-provider-channel/payment.provider.channel.service';

@Injectable()
export class PaymentProviderUsdtProtoService {
  constructor(
    @InjectModel(PaymentProviderUsdtProtocolModel)
    private pyamentProviderUsdtProtoRepository: typeof PaymentProviderUsdtProtocolModel,

    @InjectModel(UsdtProtocolModel)
    private usdtProtoRepository: typeof UsdtProtocolModel,

    private sequelize: Sequelize,
    private configService: ConfigService
  ) {}

  public async findAll(options?: FindOptions) {
    return await this.pyamentProviderUsdtProtoRepository.findAll(options);
  }

  public async findAllByQuery(query: PaymentProviderUsdtProtoGetRequestDto) {
    const findOptions: FindOptions = {
        include: [
          { model: PaymentProviderEntityModel, as: 'paymentProvider' },
          { model: UsdtProtocolModel, as: 'bank' },
        ],
        order: [
          ['paymentProviderId', 'asc'],
          ['usdtProtoId', 'asc'],
        ],
      },
      where: {} = {};

    if (query.paymentProviderId !== undefined) {
      where['paymentProviderId'] = query.paymentProviderId;
    }

    findOptions.where = where;

    return this.pyamentProviderUsdtProtoRepository.findAll(findOptions);
  }

  public async getDepositMinMaxAmount(paymentProviderId) {
    const sql = `
      select 
        min(ppup."providerMinAmount") "providerMinAmount" , 
        max(ppup."providerMaxAmount") "providerMaxAmount" 
      from "paymentProviderUsdtProtocol" ppup
      where 
        ppup."isAvailable" and 
        ppup."paymentProviderId" =${paymentProviderId} and 
        ppup."depositOrWithdrawable"=${DepositOrWithdrawalEnum.DEPOSIT}`;

    const items = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    if (items.length < 1) {
      return null;
    }

    const item = <{ providerMinAmount: number; providerMaxAmount: number }>(
      items[0]
    );

    return item;
  }

  public async getWithdrawMinMaxAmount(paymentProviderId) {
    const sql = `
      select 
        min(ppup."providerMinAmount") "providerMinAmount" , 
        max(ppup."providerMaxAmount") "providerMaxAmount" 
      from "paymentProviderUsdtProtocol" ppup
      where 
        ppup."isAvailable" and 
        ppup."paymentProviderId" =${paymentProviderId} and 
        ppup."depositOrWithdrawable"=${DepositOrWithdrawalEnum.WITHDRAWAL}`;

    const items = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    if (items.length < 1) {
      return null;
    }

    const item = <{ providerMinAmount: number; providerMaxAmount: number }>(
      items[0]
    );

    return item;
  }

  async update(
    paymentProviderChannel: PaymentProviderUsdtProtocolModel,
    options: SaveOptions
  ): Promise<PaymentProviderUsdtProtocolModel> {
    return await paymentProviderChannel.save(options);
  }

  async updateByRequest(
    updateRequest: PaymentProviderUsdtProtoUpdateRequestDto
  ): Promise<PaymentProviderUsdtProtoUpdateResponseDto> {
    const response = new PaymentProviderUsdtProtoUpdateResponseDto();

    for (let i = 0; i < updateRequest.paymentProviderUsdtProtos.length; i++) {
      const requestItem = updateRequest.paymentProviderUsdtProtos[i];

      const paymentProviderChannel = await this.pyamentProviderUsdtProtoRepository.findByPk(
        requestItem.id
      );

      if (!paymentProviderChannel) {
        continue;
      }

      const paymentProviderChannelUpdated = UpdatePaymentProviderUsdtProtoDto.updateRequestFactory(
        paymentProviderChannel,
        requestItem
      );

      await paymentProviderChannelUpdated.save();
    }

    response.result = true;
    return response;
  }
}
