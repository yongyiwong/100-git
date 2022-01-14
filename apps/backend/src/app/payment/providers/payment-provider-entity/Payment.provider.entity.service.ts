import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FindOptions } from 'sequelize/types';
import { QueryTypes } from 'sequelize';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { PaymentProviderGetRequestDto } from './dto/payment.provider.get.request.dto';
import { PaymentProviderUpdateRequestDto } from './dto/payment.provider.update.request.dto';
import { PaymentProviderUpdateResponseDto } from './dto/payment.provider.update.response.dto';
import { UpdatePaymentProviderDto } from './dto/update-payment.provider.dto';
import { PaymentProviderCardService } from '../payment-provider-card/payment.provider.card.service';
import { PaymentProviderChannelService } from '../payment-provider-channel/payment.provider.channel.service';
import { ChannelModel } from '../../../models/channel.model';
import { PaymentSystemModel } from '../../../models/payment.system.model';
import * as numeral from 'numeral';

@Injectable()
export class PaymentProviderEntityService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(PaymentProviderEntityModel)
    private paymentProvidersRepository: typeof PaymentProviderEntityModel,
    private paymentProviderCardService: PaymentProviderCardService,
    private paymentProviderChannelService: PaymentProviderChannelService
  ) {}

  async findAll(options?: FindOptions): Promise<PaymentProviderEntityModel[]> {
    return await this.paymentProvidersRepository.findAll(options);
  }

  async findAllByQuery(
    query: PaymentProviderGetRequestDto
  ): Promise<IPaymentProvider[]> {
    let sqlWhere = `where true`;

    if (query.isDepositSupport !== undefined) {
      sqlWhere += ` and vpp."isDepositSupport" `;
    }

    if (query.isWithdrawalSupport !== undefined) {
      sqlWhere += ` and vpp."isWithdrawalSupport" `;
    }

    if (query.isOnlyCardSupport !== undefined) {
      sqlWhere += ` and vpp."isOnlyCardSupport"`;
    }

    const sql = `select * from "v_paymentProvider" vpp ${sqlWhere}`;

    const items = <IPaymentProvider[]>await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return items;

    // const findOptions: FindOptions = {
    //     order: [['id', 'asc']],
    //   },
    //   where: {} = {};

    // if (query.isDepositSupport !== undefined) {
    //   where['isDepositSupport'] = query.isDepositSupport;
    // }

    // if (query.isWithdrawalSupport !== undefined) {
    //   where['isWithdrawalSupport'] = query.isWithdrawalSupport;
    // }

    // findOptions.where = where;

    // return this.paymentProvidersRepository.findAll(findOptions);
  }

  async findById(
    paymentProviderId: number
  ): Promise<PaymentProviderEntityModel> {
    return await this.paymentProvidersRepository.findByPk(paymentProviderId);
  }

  async findByProviderName(
    providerName: string
  ): Promise<PaymentProviderEntityModel> {
    return await this.paymentProvidersRepository.findOne({
      where: {
        providerName: providerName,
      },
    });
  }

  async findDepositAvailableProvider(
    isAvailable: boolean = true
  ): Promise<PaymentProviderEntityModel[]> {
    return await this.paymentProvidersRepository.findAll({
      where: {
        isDepositSupport: isAvailable,
      },
    });
  }

  async findWithdrawalAvailableProvider(
    isAvailable: boolean = true
  ): Promise<PaymentProviderEntityModel[]> {
    return await this.paymentProvidersRepository.findAll({
      where: {
        isWithdrawalSupport: isAvailable,
      },
    });
  }

  async update(
    updateRequest: PaymentProviderUpdateRequestDto
  ): Promise<PaymentProviderUpdateResponseDto> {
    const response = new PaymentProviderUpdateResponseDto();

    for (let i = 0; i < updateRequest.paymentProviders.length; i++) {
      const requestItem = updateRequest.paymentProviders[i];

      const paymentProvider = await this.paymentProvidersRepository.findByPk(
        requestItem.id
      );

      if (!paymentProvider) {
        continue;
      }

      const paymentProviderUpdated = UpdatePaymentProviderDto.updateRequestFactory(
        paymentProvider,
        requestItem
      );

      await paymentProviderUpdated.save();
    }

    response.result = true;
    return response;
  }
}
