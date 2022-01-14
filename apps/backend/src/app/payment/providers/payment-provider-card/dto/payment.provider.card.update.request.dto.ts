import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
  IsDecimal,
  IsInt,
} from 'class-validator';

export class PaymentProviderCardUpdateRequestItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  paymentProviderId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  bankId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bankAccountName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  bankAccountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  branch: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDecimal()
  maxDailyAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  minAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  maxAmount: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active: boolean;
}

export class PaymentProviderCardUpdateRequestDto {
  @ApiProperty({
    type: [PaymentProviderCardUpdateRequestItem],
  })
  @ValidateNested({ each: true })
  @Type(() => PaymentProviderCardUpdateRequestItem)
  paymentProviderCards: PaymentProviderCardUpdateRequestItem[];
}
