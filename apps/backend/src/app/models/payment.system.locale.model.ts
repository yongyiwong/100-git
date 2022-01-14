import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PaymentSystemModel } from './payment.system.model';
import { LocaleModel } from './locale.model';

@Table({ tableName: 'paymentSystemLocale', timestamps: false })
export class PaymentSystemLocaleModel extends Model<PaymentSystemLocaleModel> {
  // ======================= COLUMNS ======================== //

  @Column({
    type: DataType.NUMBER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @ForeignKey(() => PaymentSystemModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  paymentSystemId: number;

  @ForeignKey(() => LocaleModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  localeId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  label: string;

  // ======================= RELATIONS ======================== //

  @BelongsTo(() => LocaleModel)
  locale: LocaleModel;
}
