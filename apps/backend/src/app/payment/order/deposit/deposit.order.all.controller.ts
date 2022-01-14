import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { DepositOrderAllService } from './deposit.order.all.service';

@Controller(apiPathsEnum.depositAllOrders)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class DepositOrderAllController {
  constructor(private depositOrderAllService: DepositOrderAllService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(apiPathsEnum.getDepositAllOrders)
  async gets() {
    return this.depositOrderAllService.findAll();
  }
}
