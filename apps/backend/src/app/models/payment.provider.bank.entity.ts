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

@Table({ tableName: 'paymentProviderBank', timestamps: false })
export class PaymentProviderBankModel extends Model<PaymentProviderBankModel> {
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
  paymentProviderBankCode: string;

  @Column({
    type: DataType.STRING,
  })
  paymentProviderBankName: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isAvailable: boolean;

  // ======================= RELATIONS ======================== //

  @BelongsTo(() => BankModel)
  bank: BankModel;

  @BelongsTo(() => PaymentProviderEntityModel, 'paymentProviderId')
  paymentProvider: PaymentProviderEntityModel;
}
