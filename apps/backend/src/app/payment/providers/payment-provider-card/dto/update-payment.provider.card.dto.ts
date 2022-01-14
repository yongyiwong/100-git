import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentProviderCardModel } from '../../../../models/payment.provider.card.model';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsDecimal,
  IsInt,
} from 'class-validator';
import { PaymentProviderCardUpdateRequestItem } from './payment.provider.card.update.request.dto';

export class UpdatePaymentProviderCardDto {
  @ApiProperty()
  @IsNotEmpty()
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
  branch: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxDailyAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  noUsed: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxAmount: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active: boolean;

  public static updateRequestFactory(
    item: PaymentProviderCardModel,
    requestItem: PaymentProviderCardUpdateRequestItem
  ): PaymentProviderCardModel {
    if (requestItem.paymentProviderId !== undefined) {
      item.paymentProviderId = requestItem.paymentProviderId;
    }

    if (requestItem.bankId !== undefined) {
      item.bankId = requestItem.bankId;
    }

    if (requestItem.bankAccountName !== undefined) {
      item.bankAccountName = requestItem.bankAccountName;
    }

    if (requestItem.bankAccountNumber !== undefined) {
      item.bankAccountNumber = requestItem.bankAccountNumber;
    }

    if (requestItem.branch !== undefined) {
      item.branch = requestItem.branch;
    }

    if (requestItem.province !== undefined) {
      item.province = requestItem.province;
    }

    if (requestItem.city !== undefined) {
      item.city = requestItem.city;
    }

    if (requestItem.maxDailyAmount !== undefined) {
      item.maxDailyAmount = requestItem.maxDailyAmount;
    }

    if (requestItem.minAmount !== undefined) {
      item.minAmount = requestItem.minAmount;
    }

    if (requestItem.maxAmount !== undefined) {
      item.maxAmount = requestItem.maxAmount;
    }

    if (requestItem.active !== undefined) {
      item.active = requestItem.active;
    }

    return item;
  }
}
