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

@Table({ tableName: 'paymentProviderCard', timestamps: false })
export class PaymentProviderCardModel extends Model<PaymentProviderCardModel> {
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

  @ForeignKey(() => BankModel)
  @Column({
    type: DataType.INTEGER,
  })
  bankId: number;

  @Column({
    type: DataType.STRING,
  })
  bankAccountName: string;

  @Column({
    type: DataType.STRING,
  })
  bankAccountNumber: string;

  @Column({
    type: DataType.STRING,
  })
  province: string;

  @Column({
    type: DataType.STRING,
  })
  city: string;

  @Column({
    type: DataType.STRING,
  })
  branch: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  maxDailyAmount: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  minAmount: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  maxAmount: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  active: boolean;

  // ======================= RELATIONS ======================== //

  @BelongsTo(() => BankModel)
  bank: BankModel;

  @BelongsTo(() => PaymentProviderEntityModel, 'paymentProviderId')
  paymentProvider: PaymentProviderEntityModel;
}
