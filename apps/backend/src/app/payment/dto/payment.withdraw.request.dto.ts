import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumberString,
  IsOptional,
  MaxLength,
  MinLength,
  IsInt,
  IsNumber,
  IsDecimal,
} from 'class-validator';
import { BankCodeEnum, CurrencyEnum } from '@workspace/enums';
import { Transform } from 'class-transformer';

export class PaymentWithdrawRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    enum: BankCodeEnum,
  })
  @IsEnum(BankCodeEnum)
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankAccountName: string;

  @ApiProperty()
  @IsNumberString()
  @MinLength(13)
  @MaxLength(20)
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
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @MinLength(32)
  @MaxLength(32)
  hashcode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  static checkToken(token: string) {
    return token === process.env.WITHDRAWAL_TOKEN;
  }
}

export class PaymentWithdrawQueryRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @Transform((params) => (Number.isNaN(+params.value) ? 0 : +params.value))
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  currency: string;
}
