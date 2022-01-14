import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BankModel } from '../../models/bank.entity';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';

@Module({
  imports: [SequelizeModule.forFeature([BankModel])],
  providers: [BankService, BankModel],
  controllers: [BankController],
  exports: [BankService],
})
export class BankModule {}
