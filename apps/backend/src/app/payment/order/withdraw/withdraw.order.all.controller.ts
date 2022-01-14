import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { GetWithdrawOrderAllRequestDto } from './dto/get.withdraw.order.all.request.dto';
import { WithdrawOrderAllService } from './withdraw.order.all.service';

@Controller(apiPathsEnum.withdrawAllOrders)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class WithdrawOrderAllController {
  constructor(private withdrawOrderAllService: WithdrawOrderAllService) { }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @Post(apiPathsEnum.getWithdrawAllOrders)
  async gets(@Body() request: GetWithdrawOrderAllRequestDto) {
    return this.withdrawOrderAllService.findAll(request);
  }
}
