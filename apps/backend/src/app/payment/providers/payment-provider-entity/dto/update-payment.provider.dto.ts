import { ApiProperty } from '@nestjs/swagger';
import { PaymentProviderEntityModel } from '../../../../models/payment.provider.entity.model';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentProviderUpdateRequestItem } from './payment.provider.update.request.dto';

export class UpdatePaymentProviderDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isDepositSupport: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isWithdrawalSupport: boolean;

  public static updateRequestFactory(
    item: PaymentProviderEntityModel,
    requestItem: PaymentProviderUpdateRequestItem
  ): PaymentProviderEntityModel {
    if (requestItem.isDepositSupport !== undefined) {
      item.isDepositSupport = requestItem.isDepositSupport;
    }

    if (requestItem.isWithdrawalSupport !== undefined) {
      item.isWithdrawalSupport = requestItem.isWithdrawalSupport;
    }

    return item;
  }
}
