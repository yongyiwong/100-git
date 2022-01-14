import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionsUpdateRequestDto } from './dto/options.update.request.dto';
import { OptionsService } from './options.service';

@Controller(apiPathsEnum.options)
@ApiTags(apiTagsEnum.optionsEndpoints)
export class OptionsController {
  constructor(private optionsService: OptionsService) {}

  @Get(apiPathsEnum.getOptionsGeneral)
  async getsGeneral() {
    return this.optionsService.findAllGeneral();
  }

  @Post(apiPathsEnum.updateOptionsGeneral)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateGeneral(@Body() updateRequestDto: OptionsUpdateRequestDto) {
    return this.optionsService.updateByRequest(updateRequestDto);
  }
}
