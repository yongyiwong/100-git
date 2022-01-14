import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CurrencyEnum, OrderStatusEnum } from '@workspace/enums';
export const ORDER_NUMBER_PREFIX = 'ORDER';

export class WithdrawPendingOrderCreateDto {
  @IsNotEmpty()
  @IsDecimal()
  amount: number;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  clientOrderId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsOptional()
  providerOrderId: string;

  @IsNumber()
  @IsOptional()
  paymentProviderId: number;

  @IsNotEmpty()
  @IsEnum(CurrencyEnum)
  currency: string;

  @IsNotEmpty()
  @IsString()
  hashcode: string;

  @IsNotEmpty()
  @IsNumber()
  bankId: number;

  @IsNotEmpty()
  @IsString()
  bankAccountName: string;

  @IsNotEmpty()
  @IsString()
  bankAccountNumber: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  branch: string;

  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  countryCallingCode: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: string;
}

export class WithdrawPendingOrderUpdateDto {
  @ApiProperty()
  @IsEnum(OrderStatusEnum)
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  providerId: string;
}
