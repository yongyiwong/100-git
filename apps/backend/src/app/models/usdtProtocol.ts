import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { PaymentProviderUsdtProtocolModel } from './payment.provider.usdt.protocol.model';

@Table({ tableName: 'usdtProtocol', timestamps: false })
export class UsdtProtocolModel extends Model<UsdtProtocolModel> {
  // ======================= COLUMNS ======================== //

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  usdtProtoName: string;

  // ======================= RELATIONS ======================== //

  //@HasMany(() => PaymentProviderUsdtProtocolCodeModel)
  paymentProviderUsdtProtocols: PaymentProviderUsdtProtocolModel[];
}
