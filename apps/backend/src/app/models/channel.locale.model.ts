import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ChannelModel } from './channel.model';
import { LocaleModel } from './locale.model';

@Table({ tableName: 'channelLocale', timestamps: false })
export class ChannelLocaleModel extends Model<ChannelLocaleModel> {
  // ======================= COLUMNS ======================== //

  @Column({
    type: DataType.NUMBER,
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
