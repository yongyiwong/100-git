import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';

@Table({ tableName: 'options', timestamps: false })
export class OptionsModel extends Model<OptionsModel> {
  // ======================= COLUMNS ======================== //
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
    defaultValue: '',
  })
  optName: string;

  @Column({
    type: DataType.BLOB,
    allowNull: false,
    defaultValue: '',
  })
  optValue: Buffer;
}
