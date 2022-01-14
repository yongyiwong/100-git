import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentProviderCardModel } from '../../../models/payment.provider.card.model';
import { PaymentProviderChannelModel } from '../../../models/payment.provider.channel.model';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { PaymentProviderCardModule } from '../payment-provider-card/payment.provider.card.module';
import { PaymentProviderChannelModule } from '../payment-provider-channel/payment.provider.channel.module';
import { PaymentProviderSharedService } from './payment.provider.shared.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PaymentProviderChannelModel,
      PaymentProviderCardModel,
    ]),
  ],
  providers: [PaymentProviderSharedService],
  controllers: [],
  exports: [PaymentProviderSharedService],
})
export class PaymentProviderSharedModule {}
