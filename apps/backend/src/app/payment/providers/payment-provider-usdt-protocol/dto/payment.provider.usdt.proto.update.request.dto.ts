import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class PaymentProviderUsdtProtoUpdateRequestItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

export class PaymentProviderUsdtProtoUpdateRequestDto {
  @ApiProperty({
    type: [PaymentProviderUsdtProtoUpdateRequestItem],
  })
  @ValidateNested({ each: true })
  @Type(() => PaymentProviderUsdtProtoUpdateRequestItem)
  paymentProviderUsdtProtos: PaymentProviderUsdtProtoUpdateRequestItem[];
}
