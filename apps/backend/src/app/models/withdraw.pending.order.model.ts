import {
  Model,
  Table,
  Column,
  DataType,
  BeforeCreate,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PaymentProviderEntityModel } from './payment.provider.entity.model';

@Table({ tableName: 'pendingWithdraw' })
export class WithdrawPendingOrderModel extends Model<
  WithdrawPendingOrderModel
> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  orderId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  clientOrderId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false,
  })
  providerOrderId: string;

  @ForeignKey(() => PaymentProviderEntityModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  paymentProviderId: number;
  @BelongsTo(() => PaymentProviderEntityModel)
  paymentProviders: PaymentProviderEntityModel;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashcode: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  bankId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bankAccountName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bankAccountNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  province: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  branch: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  countryCallingCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  errorCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  errorMessage: string;

  @BeforeCreate
  public static async prepareCreate(
    withdrawPending: WithdrawPendingOrderModel
  ) {}
}
