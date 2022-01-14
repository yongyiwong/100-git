import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotifyGetRequestDto } from './dto/notify.get.request.dto';
import { NotifyService } from './notify.service';

@Controller(apiPathsEnum.notify)
@ApiTags(apiTagsEnum.notifyEndpoints)
export class NotifyController {
  constructor(private notifyService: NotifyService) {}

  @Post(apiPathsEnum.getNotify)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async gets(@Body() request: NotifyGetRequestDto) {
    return this.notifyService.gets(request);
  }
}
