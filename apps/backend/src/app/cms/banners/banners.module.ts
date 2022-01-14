import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BannersController } from './banners.controller';
import { BannersModel } from './banners.model';
import { BannersService } from './banners.service';


@Module({
  imports: [SequelizeModule.forFeature([BannersModel])],
  controllers: [BannersController],
  providers: [BannersService]
})
export class BannersModule {}
