import {
  Controller,
  Body,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Put,
  Query,
  UseGuards,
  Request,
  Res,
  Header,
} from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('data')
  async getData() {
    return "hello"
  }
}
