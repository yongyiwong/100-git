import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UsdtProtocolModel } from '../../models/usdtProtocol';
import { UsdtProtoGetRequestDto } from './dto/usdt.proto.get.request.dto';
import { DepositableUsdtProto } from '../dto/depositable.usdtproto';
import * as moment from 'moment-timezone';
import * as numeral from 'numeral';

@Injectable()
export class UsdtProtoService {
  constructor(
    private configService: ConfigService,
    private sequelize: Sequelize,

    @InjectModel(UsdtProtocolModel)
    private usdtProtoRepository: typeof UsdtProtocolModel
  ) { }

  async findOne(options?: FindOptions): Promise<UsdtProtocolModel> {
    return this.usdtProtoRepository.findOne(options);
  }

  async findAll(options?: FindOptions): Promise<UsdtProtocolModel[]> {
    return this.usdtProtoRepository.findAll(options);
  }

  async findById(usdtId: number): Promise<UsdtProtocolModel> {
    return this.usdtProtoRepository.findByPk(usdtId);
  }

  public async findAllByQuery(query: UsdtProtoGetRequestDto) {
    const findOptions: FindOptions = {
      include: [],
      order: [['id', 'asc']],
    },
      where: {} = {};

    findOptions.where = where;

    return this.usdtProtoRepository.findAll(findOptions);
  }

  public async getDepositables(
    frozenRestrict: boolean
  ): Promise<DepositableUsdtProto[]> {
    const depositableUsdtProtos: DepositableUsdtProto[] = [];

    let sqlFrozenFlexible = ``;

    if (!frozenRestrict) {
      const frozenPeriod = this.configService.get<number>('FROZEN_PERIOD');
      const frozenPeriodBegin = moment()
        .subtract(frozenPeriod, 'minutes')
        .format();
      const frozenPeriodEnd = moment().add(frozenPeriod, 'minutes').format();
      sqlFrozenFlexible = `and ( not "ppc"."isFrozen" or "ppc"."frozenCheckedDate" not between '${frozenPeriodBegin}' and '${frozenPeriodEnd}' )`;
    } else {
      sqlFrozenFlexible = `and not "ppc"."isFrozen"`;
    }

    const sqlIsAvailable = `"pp"."isDepositSupport" and "ppc"."isActive" and "ppc"."isAvailable" ${sqlFrozenFlexible}`;
    const sql = `
      select 
          up.id, up."usdtProtoName" ,
          bool_or(${sqlIsAvailable}) "isAvailable",
          min(case when (${sqlIsAvailable}) then "ppc"."providerMinAmount" end) "minAmount",
          max(case when (${sqlIsAvailable}) then "ppc"."providerMaxAmount" end) "maxAmount"
        from "usdtProtocol" up 
        left join "paymentProviderUsdtProtocol" ppup on up.id  = ppup."usdtProtoId" and ppup."depositOrWithdrawable"=1
        left join "paymentProviders" pp on ppup."paymentProviderId" = pp.id 
        left join channel c on c."fromPaymentSystemId" = 5 and c."depositOrWithdrawable" = 1
        left join "paymentProviderChannel" ppc on ppup."paymentProviderId" = ppc."paymentProviderId" and c.id = ppc."channelId" 
        group by up."id"
	  `;

    const items = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    for (let i = 0; i < items.length; i++) {
      const item = <
        {
          id: number;
          usdtProtoName: string;
          isAvailable: boolean;
          minAmount: string;
          maxAmount: string;
        }
        >(<unknown>items[i]);

      const depositableUsdtProto = new DepositableUsdtProto();

      depositableUsdtProto.id = item.id;
      depositableUsdtProto.usdtProtoName = item.usdtProtoName;
      depositableUsdtProto.isAvailable = item.isAvailable;
      depositableUsdtProto.minAmount = numeral(item.minAmount).value();
      depositableUsdtProto.maxAmount = numeral(item.maxAmount).value();

      depositableUsdtProtos.push(depositableUsdtProto);
    }

    return depositableUsdtProtos;
  }
}
