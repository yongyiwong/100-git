import { HttpException, HttpStatus } from '@nestjs/common';

export class NoKSportExeception extends HttpException {
  constructor() {
    super('Not Found KSport Item', HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class StreamUnavailableExeception extends HttpException {
  constructor() {
    super('Stream unavailable', HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class TencemtGetStreamStateExeception extends HttpException {
  constructor() {
    super('Tencent get stream state error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
