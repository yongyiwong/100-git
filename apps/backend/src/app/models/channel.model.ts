import {
  Model,
  Table,
  Column,
  DataType,
  BeforeCreate,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { PaymentProviderChannelModel } from './payment.provider.channel.model';
import { PaymentSystemModel } from './payment.system.model';

@Table({ tableName: 'channel' })
export class ChannelModel extends Model<ChannelModel> {
  // ======================= COLUMNS ======================== //

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
  channelName: string;

  @ForeignKey(() => PaymentSystemModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  fromPaymentSystemId: number;

  @ForeignKey(() => PaymentSystemModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  toPaymentSystemId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  depositOrWithdrawable: number;

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

  // ======================= RELATIONS ======================== //

  @BelongsTo(() => PaymentSystemModel, 'fromPaymentSystemId')
  fromPaymentSystem: PaymentSystemModel;

  @BelongsTo(() => PaymentSystemModel, 'toPaymentSystemId')
  toPaymentSystem: PaymentSystemModel;

  // @HasMany(() => PaymentProviderChannelModel)
  // paymentProviderChannels: PaymentProviderChannelModel[];

  @BeforeCreate
  public static async prepareCreate(deposit: ChannelModel) {}
}
