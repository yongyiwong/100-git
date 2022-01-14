import { OrderStatusEnum } from '@workspace/enums';
import {
  Model,
  Table,
  Column,
  DataType,
  BeforeCreate,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PaymentProviderChannelModel } from './payment.provider.channel.model';
import { PaymentProviderEntityModel } from './payment.provider.entity.model';

@Table({ tableName: 'pendingDeposit' })
export class DepositPendingOrderModel extends Model<DepositPendingOrderModel> {
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
    type: DataType.DECIMAL,
    allowNull: true,
  })
  usdtExchangeRate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  paymentProviderCardId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  last4Digit: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false,
  })
  providerOrderId: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
    unique: false,
  })
  channelId: number;

  @ForeignKey(() => PaymentProviderEntityModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  paymentProviderId: number;
  @BelongsTo(() => PaymentProviderEntityModel)
  paymentProviders: PaymentProviderEntityModel;

  @ForeignKey(() => PaymentProviderChannelModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  paymentProviderChannelId: number;
  @BelongsTo(() => PaymentProviderChannelModel)
  paymentProviderChannel: PaymentProviderChannelModel;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: OrderStatusEnum;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hash: string;

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
  public static async prepareCreate(deposit: DepositPendingOrderModel) {}
}
