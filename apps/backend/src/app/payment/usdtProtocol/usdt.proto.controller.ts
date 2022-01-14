import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UsdtProtoGetRequestDto } from './dto/usdt.proto.get.request.dto';
import { UsdtProtoService } from './usdt.proto.service';

@Controller(apiPathsEnum.usdtProto)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class UsdtProtoController {
  constructor(private usdtProtoService: UsdtProtoService) {}

  @Get(apiPathsEnum.getUsdtProtos)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  gets(@Query() query: UsdtProtoGetRequestDto) {
    return this.usdtProtoService.findAllByQuery(query);
  }
}
