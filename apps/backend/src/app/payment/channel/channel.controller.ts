import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ChannelService } from './channel.service';
import { ChannelGetRequestDto } from './dto/channel.get.request.dto';

@Controller(apiPathsEnum.channel)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get(apiPathsEnum.getChannels)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  gets(@Query() query: ChannelGetRequestDto) {
    return this.channelService.findAllByQuery(query);
  }
}
