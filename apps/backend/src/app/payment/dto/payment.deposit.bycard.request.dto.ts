import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentDepositByCardRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  data1: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  data2: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  // @ApiProperty()
  // @IsNumberString()
  // @IsNotEmpty()
  // last4Digit: string;
}
