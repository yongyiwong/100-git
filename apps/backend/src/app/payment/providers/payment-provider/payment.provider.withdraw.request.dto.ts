import { IsOptional, IsString } from 'class-validator';
import * as numeral from 'numeral';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import { PaymentWithdrawRequestDto } from '../../dto/payment.withdraw.request.dto';

export class PaymentProviderWithdrawRequestDto extends PaymentWithdrawRequestDto {
  @IsOptional()
  @IsString()
  ip: string;

  headers: {};

  countryCallingCode: string;
  phoneNumberRaw: string;

  static responseFactory(
    withdrawRequestDto: PaymentWithdrawRequestDto,
    ip: string,
    headers: {}
  ) {
    const withdrawRequestPaymentProvider = new PaymentProviderWithdrawRequestDto();

    withdrawRequestPaymentProvider.phoneNumberRaw =
      withdrawRequestDto.phoneNumber;
    if (withdrawRequestDto.phoneNumber) {
      try {
        let phoneNumber = parsePhoneNumber(
          withdrawRequestDto.phoneNumber,
          'CN'
        );

        if (
          !phoneNumber.isValid() &&
          withdrawRequestDto.phoneNumber.substring(0, 1) !== '+'
        ) {
          withdrawRequestDto.phoneNumber = `+${withdrawRequestDto.phoneNumber}`;
          phoneNumber = parsePhoneNumber(withdrawRequestDto.phoneNumber, 'CN');
        }

        if (phoneNumber.isValid()) {
          withdrawRequestPaymentProvider.countryCallingCode = <string>(
            phoneNumber.countryCallingCode
          );
          withdrawRequestPaymentProvider.phoneNumber = phoneNumber
            .format('NATIONAL', {
              humanReadable: false,
              nationalPrefix: false,
              v2: false,
            })
            .replace(/\D/g, '');
        }
      } catch (error) {}
    }

    withdrawRequestPaymentProvider.amount = numeral(
      withdrawRequestDto.amount
    ).value();
    withdrawRequestPaymentProvider.bankAccountName =
      withdrawRequestDto.bankAccountName;
    withdrawRequestPaymentProvider.bankAccountNumber =
      withdrawRequestDto.bankAccountNumber;
    withdrawRequestPaymentProvider.bankCode = withdrawRequestDto.bankCode;
    withdrawRequestPaymentProvider.branch = withdrawRequestDto.branch;
    withdrawRequestPaymentProvider.city = withdrawRequestDto.city;
    withdrawRequestPaymentProvider.currency = withdrawRequestDto.currency;
    withdrawRequestPaymentProvider.hashcode = withdrawRequestDto.hashcode;
    withdrawRequestPaymentProvider.orderId = withdrawRequestDto.orderId;
    withdrawRequestPaymentProvider.province = withdrawRequestDto.province;
    withdrawRequestPaymentProvider.token = withdrawRequestDto.token;
    withdrawRequestPaymentProvider.userId = withdrawRequestDto.userId;
    withdrawRequestPaymentProvider.userName = withdrawRequestDto.userName;
    //withdrawRequestPaymentProvider.phoneNumber = withdrawRequestDto.phoneNumber;
    withdrawRequestPaymentProvider.ip = ip;
    withdrawRequestPaymentProvider.headers = headers;

    return withdrawRequestPaymentProvider;
  }
}
