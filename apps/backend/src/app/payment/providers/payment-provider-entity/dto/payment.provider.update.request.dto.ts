import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class PaymentProviderUpdateRequestItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isDepositSupport: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isWithdrawalSupport: boolean;
}

export class PaymentProviderUpdateRequestDto {
  @ApiProperty({
    type: [PaymentProviderUpdateRequestItem],
  })
  @ValidateNested({ each: true })
  @Type(() => PaymentProviderUpdateRequestItem)
  paymentProviders: PaymentProviderUpdateRequestItem[];
}
