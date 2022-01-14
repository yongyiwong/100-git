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
import { DepositPendingOrderModel } from '../../../models/deposit.pending.order.model';
export const ORDER_NUMBER_PREFIX = 'ORDER';

export class DepositOrderCreateDto {
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
  @IsOptional()
  @IsString()
  orderId: string;

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
  @IsOptional()
  @IsString()
  hash: string;

  static pendingDepositFactory(
    pendingOrder: DepositPendingOrderModel
  ): DepositOrderCreateDto {
    const orderCreate = new DepositOrderCreateDto();

    orderCreate.orderId = pendingOrder.orderId;
    orderCreate.userId = pendingOrder.userId;
    orderCreate.amount = pendingOrder.amount;
    orderCreate.usdtExchangeRate = pendingOrder.usdtExchangeRate;
    orderCreate.status = pendingOrder.status;
    orderCreate.providerOrderId = pendingOrder.providerOrderId;
    orderCreate.channelId = pendingOrder.channelId;
    orderCreate.date = pendingOrder.date;
    orderCreate.paymentProviderId = pendingOrder.paymentProviderId;
    orderCreate.paymentProviderChannelId =
      pendingOrder.paymentProviderChannelId;
    orderCreate.userName = pendingOrder.userName;
    orderCreate.last4Digit = pendingOrder.last4Digit;
    orderCreate.paymentProviderCardId = pendingOrder.paymentProviderCardId;

    return orderCreate;
  }
}

export class DepositOrderUpdateDto {
  @ApiProperty()
  @IsEnum(OrderStatusEnum)
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  providerOrderId: string;
}
