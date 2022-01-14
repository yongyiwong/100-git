import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BankModel } from '../../../models/bank.entity';
import { PaymentProviderBankModel } from '../../../models/payment.provider.bank.entity';
import { PaymentProviderBankController } from './payment.provider.bank.controller';
import { PaymentProviderBankService } from './payment.provider.bank.service';

@Module({
  imports: [SequelizeModule.forFeature([PaymentProviderBankModel, BankModel])],
  providers: [PaymentProviderBankService, PaymentProviderBankModel],
  controllers: [PaymentProviderBankController],
  exports: [PaymentProviderBankService],
})
export class PaymentProviderBankModule {}
