import {
  Model,
  Table,
  Column,
  DataType,
  BeforeCreate,
} from 'sequelize-typescript';

@Table({ tableName: 'paymentProviders' })
export class PaymentProviderEntityModel extends Model<
  PaymentProviderEntityModel
> {
  @Column({
    type: DataType.NUMBER,
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
  providerName: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isDepositSupport: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isWithdrawalSupport: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isOnlyCardSupport: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  needsDepositPhoneNumber: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  needsWithdrawPhoneNumber: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  needsDepositBankCode: boolean;

  @BeforeCreate
  public static async prepareCreate(deposit: PaymentProviderEntityModel) {}
}
