import { HttpException, HttpStatus } from '@nestjs/common';
export class DatabaseException extends HttpException {
  constructor() {
    super('DatabaseError', HttpStatus.BAD_REQUEST);
  }
}
export class NoRecordException extends HttpException {
  constructor() {
    super('No Record', HttpStatus.NOT_ACCEPTABLE);
  }
}
export class OrderExistException extends HttpException {
  constructor() {
    super('that order Id exists', HttpStatus.NOT_ACCEPTABLE);
  }
}
export class NoSupportedBankException extends HttpException {
  constructor() {
    super('No Supported bank', HttpStatus.NOT_ACCEPTABLE);
  }
}
export class NoProviderNameException extends HttpException {
  constructor() {
    super('No Provider name', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
export class NoProviderException extends HttpException {
  constructor() {
    super(
      'There is no available payment provider',
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
}
export class NoSupportedChannelException extends HttpException {
  constructor() {
    super('There is no supported channel', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
export class PaymentProviderException extends HttpException {
  constructor() {
    super('Bad data from provider', HttpStatus.BAD_GATEWAY);
  }
}
export class NotSupportedBank extends HttpException {
  constructor() {
    super('No supported bank code', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
export class NotSupportedPhoneNumber extends HttpException {
  constructor() {
    super('No supported phoneNumber', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
