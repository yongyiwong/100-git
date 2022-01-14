import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentManualDepositRequestDto {
  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsNumber()
  @IsNotEmpty()
  paymentProviderId: number;

  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsNumber()
  @IsNotEmpty()
  paymentProviderChannelId: number;

  @ApiProperty()
  //@Transform((params) => Number(params.value))
  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  amount: string;
}
