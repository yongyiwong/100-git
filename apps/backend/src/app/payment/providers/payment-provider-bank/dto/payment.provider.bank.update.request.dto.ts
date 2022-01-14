import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class PaymentProviderBankUpdateRequestItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

export class PaymentProviderBankUpdateRequestDto {
  @ApiProperty({
    type: [PaymentProviderBankUpdateRequestItem],
  })
  @ValidateNested({ each: true })
  @Type(() => PaymentProviderBankUpdateRequestItem)
  paymentProviderBanks: PaymentProviderBankUpdateRequestItem[];
}
