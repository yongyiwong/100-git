import { SportsEnum } from '@workspace/enums';
import { Column, DataType, Table, Model, IsDate } from 'sequelize-typescript';

@Table({ tableName: 'bcToKSport', timestamps: false })
export class BCToKSportModel extends Model<BCToKSportModel> {
  @Column({
    type: DataType.CHAR,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sportType: SportsEnum;
  //////////////////////////////////////////////////////////////////////////
  // Unique Match BC Against KSport
  //////////////////////////////////////////////////////////////////////////

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'uniqueEventMatch',
  })
  bcEventId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'uniqueEventMatch',
  })
  kSportEventId: string;

  //////////////////////////////////////////////////////////////////////////
  // MatchScore  BC Against KSport
  //////////////////////////////////////////////////////////////////////////
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  matchScore: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  correct: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isManual: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isKilled: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  streamState: boolean;

  //////////////////////////////////////////////////////////////////////////
  // bc Construct Event Information
  //////////////////////////////////////////////////////////////////////////

  @IsDate
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  bcEventTime: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bcTeamId1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bcTeamId2: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bcTeamName1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bcTeamName2: string;

  //////////////////////////////////////////////////////////////////////////
  // KSport Event Information
  //////////////////////////////////////////////////////////////////////////

  @IsDate
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  kSportEventTime: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  kSportTeamId1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  kSportTeamId2: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  kSportTeamName1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  kSportTeamName2: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  kSportStreamId: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isStreamCn: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isStreamHd: boolean;
}
