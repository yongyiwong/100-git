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

export class PaymentMakeWithdrawSuccessRequestDto {
  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsInt()
  @IsNotEmpty()
  orderId: number;
}
