import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  apiEndpointDecriptionEnum,
  apiPathsEnum,
  apiTagsEnum,
} from '@workspace/enums';
import { D1FPaymentProviderService } from './d1f.payment.provider.service';
import { D1FDepositStatusResponseDto } from './dto/d1f.deposit.status.response.dto';
import { RequestIpAddress } from '../../../../decorators/request.ip.decorators';
import { D1FWithdrawStatusResponseDto } from './dto/d1f.withdraw.status.response';

@Controller(apiPathsEnum.payment)
export class D1FPaymentProviderController {
  constructor(private d1fPaymentProviderService: D1FPaymentProviderService) {}

  @Post(apiPathsEnum.d1fcallbackDeposit)
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiTags(apiTagsEnum.paymentEndpoints)
  @ApiOperation({ description: apiEndpointDecriptionEnum.depositD1FCallback })
  depositCallback(
    @Body() paymentStatusResponse: D1FDepositStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.d1fPaymentProviderService.depositCallback(
      paymentStatusResponse,
      ip
    );
  }

  @Post(apiPathsEnum.d1fcallbackWithdraw)
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiTags(apiTagsEnum.paymentEndpoints)
  @ApiOperation({ description: apiEndpointDecriptionEnum.withdrawD1FCallback })
  withdrawCallback(
    @Body() paymentStatusResponse: D1FWithdrawStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.d1fPaymentProviderService.withdrawCallback(
      paymentStatusResponse,
      ip
    );
  }
}
