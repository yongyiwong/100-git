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

export class PaymentMakeDepositSuccessRequestDto {
  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  //@Transform((params) => Number(params.value))
  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  amount: string;
}
