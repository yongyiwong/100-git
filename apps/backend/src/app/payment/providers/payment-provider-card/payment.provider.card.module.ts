import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BankModel } from '../../../models/bank.entity';
import { PaymentProviderCardModel } from '../../../models/payment.provider.card.model';
import { PaymentProviderSharedModule } from '../payment-provider-shared/payment.provider.shared.module';
import { PaymentProviderCardController } from './payment.provider.card.controller';
import { PaymentProviderCardService } from './payment.provider.card.service';

@Module({
  imports: [
    SequelizeModule.forFeature([PaymentProviderCardModel, BankModel]),
    PaymentProviderSharedModule,
  ],
  providers: [PaymentProviderCardService],
  controllers: [PaymentProviderCardController],
  exports: [PaymentProviderCardService],
})
export class PaymentProviderCardModule {}
