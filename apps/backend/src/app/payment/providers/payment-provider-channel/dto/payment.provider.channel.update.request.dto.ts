import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentProviderChannelUpdateRequestItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsOptional()
  @Transform((params) => Number(params.value))
  @IsNumber()
  providerMinAmount: number;

  @ApiProperty()
  @IsOptional()
  @Transform((params) => Number(params.value))
  @IsNumber()
  providerMaxAmount: number;
}

export class PaymentProviderChannelUpdateRequestDto {
  @ApiProperty({
    type: [PaymentProviderChannelUpdateRequestItem],
  })
  @ValidateNested({ each: true })
  @Type(() => PaymentProviderChannelUpdateRequestItem)
  paymentProviderChannels: PaymentProviderChannelUpdateRequestItem[];
}
