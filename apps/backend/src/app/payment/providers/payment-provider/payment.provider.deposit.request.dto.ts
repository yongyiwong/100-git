import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import * as numeral from 'numeral';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import { PaymentDepositRequestDto } from '../../dto/payment.deposit.request.dto';

export class PaymentProviderDepositRequestDto extends PaymentDepositRequestDto {
  @IsOptional()
  @IsString()
  ip: string;

  headers: {};

  countryCallingCode: string;

  static responseFactory(
    depositRequestDto: PaymentDepositRequestDto,
    ip: string,
    headers: {}
  ) {
    const paymentProviderDepositRequestDto = new PaymentProviderDepositRequestDto();

    if (depositRequestDto.phoneNumber) {
      try {
        let phoneNumber = parsePhoneNumber(depositRequestDto.phoneNumber, 'CN');

        if (
          !phoneNumber.isValid() &&
          depositRequestDto.phoneNumber.substring(0, 1) !== '+'
        ) {
          depositRequestDto.phoneNumber = `+${depositRequestDto.phoneNumber}`;
          phoneNumber = parsePhoneNumber(depositRequestDto.phoneNumber, 'CN');
        }

        if (phoneNumber.isValid()) {
          paymentProviderDepositRequestDto.countryCallingCode = <string>(
            phoneNumber.countryCallingCode
          );
          paymentProviderDepositRequestDto.phoneNumber = phoneNumber
            .format('NATIONAL', {
              humanReadable: false,
              nationalPrefix: false,
              v2: false,
            })
            .replace(/\D/g, '');
        }
      } catch (error) {}
    }

    paymentProviderDepositRequestDto.amount = numeral(
      depositRequestDto.amount
    ).value();
    paymentProviderDepositRequestDto.paymentSystem =
      depositRequestDto.paymentSystem;
    paymentProviderDepositRequestDto.userId = depositRequestDto.userId;
    paymentProviderDepositRequestDto.ip = ip;
    paymentProviderDepositRequestDto.bankCode = depositRequestDto.bankCode;
    paymentProviderDepositRequestDto.usdtProto = depositRequestDto.usdtProto;
    paymentProviderDepositRequestDto.headers = headers;
    paymentProviderDepositRequestDto.userName = depositRequestDto.userName;
    //paymentProviderDepositRequestDto.phoneNumber = depositRequestDto.phoneNumber;

    return paymentProviderDepositRequestDto;
  }
}
