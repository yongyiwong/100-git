import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'locale', timestamps: false })
export class LocaleModel extends Model<LocaleModel> {
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
  localeName: string;
}
