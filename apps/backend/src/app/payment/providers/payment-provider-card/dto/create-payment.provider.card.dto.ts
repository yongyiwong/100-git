import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentProviderCardModel } from '../../../../models/payment.provider.card.model';
import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentProviderCardCreateRequestItem } from './payment.provider.card.create.request.dto';

export class CreatePaymentProviderCardDto {
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
  @IsNumber()
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

  public static createRequestFactory(
    requestItem: PaymentProviderCardCreateRequestItem
  ): CreatePaymentProviderCardDto {
    const item = new CreatePaymentProviderCardDto();

    item.paymentProviderId = requestItem.paymentProviderId;
    item.bankId = requestItem.bankId;
    item.bankAccountName = requestItem.bankAccountName;
    item.bankAccountNumber = requestItem.bankAccountNumber;

    if (requestItem.branch) {
      item.branch = requestItem.branch;
    }

    item.province = requestItem.province;
    item.city = requestItem.city;

    if (requestItem.active) {
      item.active = requestItem.active;
    }

    if (requestItem.maxDailyAmount) {
      item.maxDailyAmount = requestItem.maxDailyAmount;
    }

    item.minAmount = requestItem.minAmount;
    item.maxAmount = requestItem.maxAmount;

    return item;
  }
}
