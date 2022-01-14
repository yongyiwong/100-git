import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';

@Table({ tableName: 'bcOrders' })
export class BcOrdersModel extends Model<BcOrdersModel> {
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
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  orderId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  depositOrWithdrawable: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  processed: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: '',
  })
  logData: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  // ======================= RELATIONS ======================== //
}
