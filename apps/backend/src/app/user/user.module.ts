import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserModel } from './user.model';
import { UserService } from './user.service';


@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService, UserModel],
  exports: [UserService]
})
export class UserModule {}
