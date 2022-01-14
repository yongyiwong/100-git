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
import { ChannelModel } from './channel.model';

@Table({ tableName: 'paymentProviderChannel' })
export class PaymentProviderChannelModel extends Model<
  PaymentProviderChannelModel
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

  @ForeignKey(() => ChannelModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  channelId: number;

  @ForeignKey(() => PaymentProviderEntityModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  paymentProviderId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  providerChannelName: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  providerMinAmount: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  providerMaxAmount: number;

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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isFrozen: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  frozenCheckedDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isMinMaxAuto: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  testedAt: Date;

  // ======================= RELATIONS ======================== //

  @BelongsTo(() => ChannelModel, 'channelId')
  channel: ChannelModel;

  @BelongsTo(() => PaymentProviderEntityModel, 'paymentProviderId')
  paymentProvider: PaymentProviderEntityModel;

  @BeforeCreate
  public static async prepareCreate(deposit: PaymentProviderChannelModel) {}
}
