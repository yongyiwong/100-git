import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNotEmpty,
  Length,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  OrderStatusEnum,
  DepositChannelEnum,
  PaymentProviderEnum,
} from '@workspace/enums';
export const ORDER_NUMBER_PREFIX = 'ORDER';

export class DepositPendingOrderCreateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDecimal()
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDecimal()
  usdtExchangeRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  paymentProviderCardId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  last4Digit: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  providerOrderId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  channelId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  paymentProviderId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  paymentProviderChannelId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  hash: string;
}

export class DepositPendingOrderUpdateDto {
  @ApiProperty()
  @IsEnum(OrderStatusEnum)
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  providerId: string;
}
