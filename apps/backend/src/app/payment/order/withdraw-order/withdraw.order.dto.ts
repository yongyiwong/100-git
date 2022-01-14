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
  IsNumberString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CurrencyEnum, OrderStatusEnum } from '@workspace/enums';
import { WithdrawPendingOrderModel } from '../../../models/withdraw.pending.order.model';
export const ORDER_NUMBER_PREFIX = 'ORDER';

export class WithdrawOrderCreateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsUUID('4')
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientOrderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDecimal()
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  providerOrderId: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  paymentProviderId: number;

  @ApiProperty()
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  currency: string;

  @ApiProperty()
  @IsNumberString()
  @MinLength(32)
  @MaxLength(32)
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: string;

  static pendingWithdrawFactory(
    pendingOrder: WithdrawPendingOrderModel
  ): WithdrawOrderCreateDto {
    const orderCreate = new WithdrawOrderCreateDto();

    orderCreate.orderId = pendingOrder.orderId;
    orderCreate.userId = pendingOrder.userId;
    orderCreate.clientOrderId = pendingOrder.clientOrderId;
    orderCreate.amount = pendingOrder.amount;
    orderCreate.status = pendingOrder.status;
    orderCreate.providerOrderId = pendingOrder.providerOrderId;
    orderCreate.date = pendingOrder.date;
    orderCreate.paymentProviderId = pendingOrder.paymentProviderId;
    orderCreate.currency = pendingOrder.currency;
    orderCreate.hashcode = pendingOrder.hashcode;

    orderCreate.bankId = pendingOrder.bankId;
    orderCreate.bankAccountName = pendingOrder.bankAccountName;
    orderCreate.bankAccountNumber = pendingOrder.bankAccountNumber;
    orderCreate.province = pendingOrder.province;
    orderCreate.city = pendingOrder.city;
    orderCreate.branch = pendingOrder.branch;
    orderCreate.userName = pendingOrder.userName;
    orderCreate.countryCallingCode = pendingOrder.countryCallingCode;
    orderCreate.phoneNumber = pendingOrder.phoneNumber;

    return orderCreate;
  }
}

export class WithdrawOrderUpdateDto {
  @ApiProperty()
  @IsEnum(OrderStatusEnum)
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  providerId: string;
}
