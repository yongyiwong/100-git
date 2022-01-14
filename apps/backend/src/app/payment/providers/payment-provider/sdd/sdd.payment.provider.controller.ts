import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  apiEndpointDecriptionEnum,
  apiPathsEnum,
  apiTagsEnum,
} from '@workspace/enums';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SDDDepositStatusResponseDto } from './dto/sdd.deposit.status.response.dto';
import { SDDWithdrawStatusResponseDto } from './dto/sdd.withdraw.status.response.dto';
import { SDDPaymentProviderService } from './sdd.payment.provider.service';
import { RequestIpAddress } from '../../../../decorators/request.ip.decorators';

@Controller(apiPathsEnum.payment)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class SDDPaymentProviderController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private sddPaymentProviderService: SDDPaymentProviderService
  ) {}

  @Post(apiPathsEnum.sddcallbackDeposit)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.depositSDDCallback,
  })
  async depositCallback(
    @Body() depositStatusResponse: SDDDepositStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.sddPaymentProviderService.depositCallback(
      depositStatusResponse,
      ip
    );
  }

  @Post(apiPathsEnum.sddcallbackWithdraw)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.withdrawSDDCallback,
  })
  async withdrawCallback(
    @Body() withdrawStatusResponse: SDDWithdrawStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.sddPaymentProviderService.withdrawCallback(
      withdrawStatusResponse,
      ip
    );
  }
}
