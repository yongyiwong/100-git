import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { PaymentProviderCardModule } from '../payment-provider-card/payment.provider.card.module';
import { PaymentProviderChannelModule } from '../payment-provider-channel/payment.provider.channel.module';
import { PaymentProviderEntityController } from './payment.provider.entity.controller';
import { PaymentProviderEntityService } from './Payment.provider.entity.service';

@Module({
  imports: [
    SequelizeModule.forFeature([PaymentProviderEntityModel]),
    PaymentProviderCardModule,
    PaymentProviderChannelModule,
  ],
  providers: [PaymentProviderEntityService, PaymentProviderEntityModel],
  controllers: [PaymentProviderEntityController],
  exports: [PaymentProviderEntityService],
})
export class PaymentProviderEntityModule {}
