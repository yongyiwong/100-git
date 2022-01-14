import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({ tableName: 'banners' })
export class BannersModel extends Model<BannersModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  banner: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  order: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  buttonText: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  buttonColor: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  positionX: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  positionY: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false
  })
  enabled: string;
}
