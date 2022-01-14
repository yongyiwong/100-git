import {
  Column,
  DataType,
  Table,
  Model,
  IsDate,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { BankModel } from './bank.entity';
import { PaymentProviderEntityModel } from './payment.provider.entity.model';
import { UsdtProtocolModel } from './usdtProtocol';

@Table({ tableName: 'paymentProviderUsdtProtocol', timestamps: false })
export class PaymentProviderUsdtProtocolModel extends Model<
  PaymentProviderUsdtProtocolModel
> {
  // ======================= COLUMNS ======================== //

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @ForeignKey(() => PaymentProviderEntityModel)
  @Column({
    type: DataType.NUMBER,
  })
  paymentProviderId: number;

  @ForeignKey(() => UsdtProtocolModel)
  @Column({
    type: DataType.INTEGER,
  })
  usdtProtoId: number;

  @Column({
    type: DataType.STRING,
  })
  providerUsdtProtoName: string;

  @Column({
    type: DataType.STRING,
  })
  providerUsdtProtoCurrency: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isAvailable: boolean;

  // ======================= RELATIONS ======================== //

  @BelongsTo(() => UsdtProtocolModel)
  usdtProtocol: UsdtProtocolModel;

  @BelongsTo(() => PaymentProviderEntityModel, 'paymentProviderId')
  paymentProvider: PaymentProviderEntityModel;
}
