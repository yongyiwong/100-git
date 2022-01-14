import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import {
  BankCodeEnum,
  PaymentSystemEnum,
  UsdtProtocolEnum,
} from '@workspace/enums';
import { Transform } from 'class-transformer';

export class PaymentDepositRequestDto {
  @ApiProperty()
  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    enum: PaymentSystemEnum,
  })
  @IsEnum(PaymentSystemEnum)
  @IsNotEmpty()
  paymentSystem: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    enum: BankCodeEnum,
  })
  @IsOptional()
  @IsEnum(BankCodeEnum)
  bankCode: string;

  @ApiPropertyOptional({
    enum: UsdtProtocolEnum,
  })
  @IsOptional()
  @IsEnum(UsdtProtocolEnum)
  usdtProto: string;

  @ApiPropertyOptional({})
  @IsOptional()
  userName: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  phoneNumber: string;
}
