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
import { CurrencyEnum } from '@workspace/enums';

export class PaymentManualWithdrawRequestDto {
  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  //@Transform((params) => Number(params.value))
  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsInt()
  @IsNotEmpty()
  paymentProviderId: number;

  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsInt()
  @IsNotEmpty()
  bankId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankAccountName: string;

  @ApiProperty()
  @IsNumberString()
  bankAccountNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  branch: string;

  @ApiProperty({
    enum: CurrencyEnum,
  })
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  currency: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryCallingCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber: string;
}
