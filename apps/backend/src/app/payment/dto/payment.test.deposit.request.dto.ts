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
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';

export class PaymentTestDepositRequestDto {
  // @ApiProperty()
  // @Transform((params) => Number(params.value))
  // @IsInt()
  // @IsNotEmpty()
  // userId: number;

  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsNumber()
  @IsNotEmpty()
  paymentProviderChannelId: number;

  @ApiProperty()
  //@Transform((params) => Number(params.value))
  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  amount: string;

  @ApiPropertyOptional({})
  @IsOptional()
  userName: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @Transform((params) => Number(params.value))
  @IsInt()
  bankId: number;

  countryCallingCode: string;

  fixPhoneNumber() {
    if (!this.phoneNumber) {
      return;
    }

    try {
      let phoneNumber = parsePhoneNumber(this.phoneNumber, 'CN');

      if (!phoneNumber.isValid() && this.phoneNumber.substring(0, 1) !== '+') {
        this.phoneNumber = `+${this.phoneNumber}`;
        phoneNumber = parsePhoneNumber(this.phoneNumber, 'CN');
      }

      if (phoneNumber.isValid()) {
        this.countryCallingCode = <string>phoneNumber.countryCallingCode;
        this.phoneNumber = phoneNumber
          .format('NATIONAL', {
            humanReadable: false,
            nationalPrefix: false,
            v2: false,
          })
          .replace(/\D/g, '');
      }
    } catch (error) {}
  }
}
