import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { PaymentProviderBankModel } from './payment.provider.bank.entity';

@Table({ tableName: 'bank', timestamps: false })
export class BankModel extends Model<BankModel> {
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
  bankCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  bankName: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isAvailable: boolean;

  // ======================= RELATIONS ======================== //

  //@HasMany(() => PaymentProviderBankCodeModel)
  paymentProviderBankCodes: PaymentProviderBankModel[];
}
