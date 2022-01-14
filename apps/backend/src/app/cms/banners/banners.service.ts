import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBannerFileDto } from './banners.dto';
import { BannersModel } from './banners.model';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(BannersModel) private bannerRepository: typeof BannersModel
  ) {
  }
  async getAll() {
    return this.bannerRepository.findAll({
      where: {
        type: 'hero'
      }
    });
  }

  saveBanner(banner, fileName) {
    try {
      const response = {
        originalname: banner.originalname,
        path: banner.path
      };

      return {
        status: HttpStatus.OK,
        message: 'Banner uploaded successfully!',
        data: response
      };
    } catch (error) {
      return error;
    }
  }

  async createBanner(request: CreateBannerFileDto, banner) {
    try {
      const checkForBanner = await this.bannerRepository.findOne({
        where: {
          title: request.title
        }
      });
      if (checkForBanner) {
        return new HttpException('Banner Already Exists!', HttpStatus.CONFLICT);
      }

      return await this.bannerRepository.create({
        type: request.type,
        banner: request.banner,
        title: request.title,
        order: request.order,
        url: banner.path,
        buttonText: request.buttonText,
        buttonColor: request.buttonColor,
        positionX: request.positionX,
        positionY: request.positionY,
        enabled: request.enabled
      });

    } catch (error) {
      return error.message;
    }
  }
}
