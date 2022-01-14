import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OptionsModel } from '../models/options.model';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';

@Module({
  imports: [SequelizeModule.forFeature([OptionsModel])],
  providers: [OptionsService],
  controllers: [OptionsController],
  exports: [OptionsService],
})
export class OptionsModule {}
