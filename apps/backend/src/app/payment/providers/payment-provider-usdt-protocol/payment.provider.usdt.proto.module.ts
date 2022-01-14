import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentProviderUsdtProtocolModel } from '../../../models/payment.provider.usdt.protocol.model';
import { UsdtProtocolModel } from '../../../models/usdtProtocol';
import { PaymentProviderUsdtProtoController } from './payment.provider.usdt.proto.controller';
import { PaymentProviderUsdtProtoService } from './payment.provider.usdt.proto.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PaymentProviderUsdtProtocolModel,
      UsdtProtocolModel,
    ]),
  ],
  providers: [
    PaymentProviderUsdtProtoService,
    PaymentProviderUsdtProtocolModel,
  ],
  controllers: [PaymentProviderUsdtProtoController],
  exports: [PaymentProviderUsdtProtoService],
})
export class PaymentProviderUsdtProtoModule {}
