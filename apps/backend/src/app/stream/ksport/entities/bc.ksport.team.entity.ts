import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({ tableName: 'bcToKSportTeam' })
export class BCToKSportTeamModel extends Model<BCToKSportTeamModel> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'uniqueTeamId',
  })
  bcTeamId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bcTeamName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'uniqueTeamId',
  })
  kSportTeamId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  kSportTeamName: string;
}
