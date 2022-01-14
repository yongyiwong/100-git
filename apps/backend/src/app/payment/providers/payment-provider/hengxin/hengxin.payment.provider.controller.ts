import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  apiEndpointDecriptionEnum,
  apiPathsEnum,
  apiTagsEnum,
} from '@workspace/enums';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HengXinDepositStatusResponseDto } from './dto/hengxin.deposit.status.response.dto';
import { HengXinWithdrawStatusResponseDto } from './dto/hengxin.withdraw.status.response.dto';
import { HengXinPaymentProviderService } from './hengxin.payment.provider.service';
import { RequestIpAddress } from '../../../../decorators/request.ip.decorators';

@Controller(apiPathsEnum.payment)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class HengXinPaymentProviderController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private hengxinPaymentProviderService: HengXinPaymentProviderService
  ) {}

  @Post(apiPathsEnum.hengxincallbackDeposit)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.depositHengXinCallback,
  })
  async depositCallback(
    @Body() depositStatusResponse: HengXinDepositStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.hengxinPaymentProviderService.depositCallback(
      depositStatusResponse,
      ip
    );
  }

  @Post(apiPathsEnum.hengxincallbackWithdraw)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.withdrawHengXinCallback,
  })
  async withdrawCallback(
    @Body() withdrawStatusResponse: HengXinWithdrawStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.hengxinPaymentProviderService.withdrawCallback(
      withdrawStatusResponse,
      ip
    );
  }
}
