import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
//import { ChannelModel } from './channel.model';

@Table({ tableName: 'paymentSystem', timestamps: false })
export class PaymentSystemModel extends Model<PaymentSystemModel> {
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
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isBank: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  paymentSystemName: string;

  // ======================= RELATIONS ======================== //

  // @HasMany(() => ChannelModel)
  // channels: ChannelModel[];
}
