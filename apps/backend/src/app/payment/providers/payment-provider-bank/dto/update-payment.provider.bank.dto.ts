import { ApiProperty } from '@nestjs/swagger';
import { PaymentProviderBankModel } from '../../../../models/payment.provider.bank.entity';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentProviderBankUpdateRequestItem } from './payment.provider.bank.update.request.dto';

export class UpdatePaymentProviderBankDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  public static updateRequestFactory(
    item: PaymentProviderBankModel,
    requestItem: PaymentProviderBankUpdateRequestItem
  ): PaymentProviderBankModel {
    if (requestItem.isActive !== undefined) {
      item.isActive = requestItem.isActive;
    }

    return item;
  }
}
