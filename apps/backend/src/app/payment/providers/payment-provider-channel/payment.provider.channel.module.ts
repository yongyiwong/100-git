import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChannelLocaleModel } from '../../../models/channel.locale.model';
import { ChannelModel } from '../../../models/channel.model';
import { LocaleModel } from '../../../models/locale.model';
import { PaymentProviderChannelModel } from '../../../models/payment.provider.channel.model';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { PaymentProviderChannelController } from './payment.provider.channel.controller';
import { PaymentProviderChannelService } from './payment.provider.channel.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PaymentProviderChannelModel,
      ChannelModel,
      PaymentProviderEntityModel,
      LocaleModel,
      ChannelLocaleModel,
    ]),
  ],
  providers: [PaymentProviderChannelService, PaymentProviderChannelModel],
  controllers: [PaymentProviderChannelController],
  exports: [PaymentProviderChannelService],
})
export class PaymentProviderChannelModule {}
