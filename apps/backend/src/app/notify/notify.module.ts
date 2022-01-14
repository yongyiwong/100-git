import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';

@Module({
  imports: [SequelizeModule.forFeature([])],
  providers: [NotifyService],
  controllers: [NotifyController],
  exports: [NotifyService],
})
export class NotifyModule {}
