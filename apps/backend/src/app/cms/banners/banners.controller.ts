import { Controller, HttpStatus, Post, UploadedFile, UseInterceptors, Get, Param, Res, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

import { apiEndpointDecriptionEnum, apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { CreateBannerFileDto, BannerFileDto, BannersGetDto } from './banners.dto';
import { imageFileFilter, editFileName } from './banners.filter';
import { BannersService } from './banners.service';
import { diskStorage } from 'multer';

@ApiTags(apiTagsEnum.cmsEndpoints)
@Controller(apiPathsEnum.banners)
export class BannersController {
  constructor(
    private bannersService: BannersService
  ) {
  }

  @Post(apiPathsEnum.uploadHeroBanner)
  @ApiOperation({ description: apiEndpointDecriptionEnum.cmsHeroBannerUpload })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Banner Picture',
    type: BannerFileDto
  })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: imageFileFilter,
    storage: diskStorage({
      destination: './uploads/assets/banners/hero',
      filename: editFileName
    })
  }))

  async uploadHeroBanner(@Body() fileType: string, @UploadedFile() banner) {
    return this.bannersService.saveBanner(banner, fileType);
  }

  @Post(apiPathsEnum.createHeroBanner)
  @ApiOperation({ description: apiEndpointDecriptionEnum.cmsHeroBannerCreate })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: imageFileFilter,
    storage: diskStorage({
      destination: './uploads/assets/banners/hero',
      filename: editFileName
    })
  }))
  @ApiConsumes('multipart/form-data')
  async createHeroBanner(@UploadedFile() file, @Body()request: CreateBannerFileDto) {
    return this.bannersService.createBanner(request, file);
  }

  @Get('hero')
  getImage()  {
    return this.bannersService.getAll()
  }

}
