import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentSystemLocaleModel } from '../../models/payment.system.locale.model';
import { PaymentSystemModel } from '../../models/payment.system.model';
import { PaymentSystemService } from './payment.system.service';

@Module({
  imports: [
    SequelizeModule.forFeature([PaymentSystemModel, PaymentSystemLocaleModel]),
  ],
  providers: [PaymentSystemService, PaymentSystemModel],
  controllers: [],
  exports: [PaymentSystemService],
})
export class PaymentSystemModule {}
