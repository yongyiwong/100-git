import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PaymentProviderCardItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class PaymentProviderCardDeleteRequestDto {
  @ApiProperty({
    type: [PaymentProviderCardItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => PaymentProviderCardItemDto)
  cards: PaymentProviderCardItemDto[];
}
