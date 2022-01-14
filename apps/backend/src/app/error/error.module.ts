import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ErrorService } from './error.service';

@Module({
  imports: [SequelizeModule.forFeature([])],
  controllers: [],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule {}
