import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
//import { Test2Model } from './test2.entity';

@Table({ tableName: 'test', timestamps: true })
export class TestModel extends Model<TestModel> {
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
  })
  a: string;

  // @HasMany(() => Test2Model)
  // test2s: Test2Model[];
}
