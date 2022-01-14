import { ApiProperty } from '@nestjs/swagger';
import { PaymentProviderChannelModel } from '../../../../models/payment.provider.channel.model';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentProviderChannelUpdateRequestItem } from './payment.provider.channel.update.request.dto';

export class UpdatePaymentProviderChannelDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  public static updateRequestFactory(
    item: PaymentProviderChannelModel,
    requestItem: PaymentProviderChannelUpdateRequestItem
  ): PaymentProviderChannelModel {
    if (requestItem.isActive !== undefined) {
      item.isActive = requestItem.isActive;
    }

    if (requestItem.providerMinAmount !== undefined) {
      item.providerMinAmount = requestItem.providerMinAmount;
    }

    if (requestItem.providerMaxAmount !== undefined) {
      item.providerMaxAmount = requestItem.providerMaxAmount;
    }

    return item;
  }
}
