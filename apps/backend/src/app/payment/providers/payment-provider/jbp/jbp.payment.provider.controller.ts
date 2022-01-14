import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  apiEndpointDecriptionEnum,
  apiPathsEnum,
  apiTagsEnum,
} from '@workspace/enums';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JBPDepositStatusResponseDto } from './dto/jbp.deposit.status.response.dto';
import { JBPWithdrawStatusResponseDto } from './dto/jbp.withdraw.status.response.dto';
import { JBPPaymentProviderService } from './jbp.payment.provider.service';
import { RequestIpAddress } from '../../../../decorators/request.ip.decorators';

@Controller(apiPathsEnum.payment)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class JBPPaymentProviderController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private jbpPaymentProviderService: JBPPaymentProviderService
  ) {}

  @Post(apiPathsEnum.jbpcallbackDeposit)
  @HttpCode(200)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.depositJBPCallback,
  })
  async depositCallback(
    @Body() depositStatusResponse: JBPDepositStatusResponseDto,
    @RequestIpAddress() ip: string
  ) {
    return this.jbpPaymentProviderService.depositCallback(
      depositStatusResponse,
      ip
    );
  }

  @Post(apiPathsEnum.jbpcallbackWithdraw)
  @HttpCode(200)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.withdrawJBPCallback,
  })
  async withdrawCallback(
    @Body() withdrawStatusResponse: JBPWithdrawStatusResponseDto,
    @RequestIpAddress() ip: string
  ) {
    return this.jbpPaymentProviderService.withdrawCallback(
      withdrawStatusResponse,
      ip
    );
  }
}
