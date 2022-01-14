import {
  Model,
  Table,
  Column,
  DataType,
  BeforeCreate,
} from 'sequelize-typescript';
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');

@Table({ tableName: 'user' })
export class UserModel extends Model<UserModel> {
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
    unique: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  twoFactorAuthenticationSecret: string;

  // @BeforeValidate
  // static mockId(user: UserModel) {
  //   if (user.id === undefined && user.password) {
  //
  //    }
  //  }
  @BeforeCreate
  public static async prepareCreate(user: UserModel) {
    user.id = uuid();
    user.password = await bcrypt.hash(user.password, 10);
  }
}
