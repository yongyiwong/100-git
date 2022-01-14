import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChannelModel } from '../../models/channel.model';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [SequelizeModule.forFeature([ChannelModel])],
  providers: [ChannelService, ChannelModel],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChannelModule {}
