import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { BankService } from './bank.service';
import { BankGetRequestDto } from './dto/bank.get.request.dto';

@Controller(apiPathsEnum.bank)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class BankController {
  constructor(private bankService: BankService) {}

  @Get(apiPathsEnum.getBanks)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  gets(@Query() query: BankGetRequestDto) {
    return this.bankService.findAllByQuery(query);
  }
}
