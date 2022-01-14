import { ApiProperty } from '@nestjs/swagger';
import { PaymentProviderUsdtProtocolModel } from '../../../../models/payment.provider.usdt.protocol.model';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentProviderUsdtProtoUpdateRequestItem } from './payment.provider.usdt.proto.update.request.dto';

export class UpdatePaymentProviderUsdtProtoDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  public static updateRequestFactory(
    item: PaymentProviderUsdtProtocolModel,
    requestItem: PaymentProviderUsdtProtoUpdateRequestItem
  ): PaymentProviderUsdtProtocolModel {
    return item;
  }
}
