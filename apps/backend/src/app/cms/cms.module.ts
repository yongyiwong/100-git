import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { BannersModule } from './banners/banners.module';

@Module({
  controllers: [CmsController],
  providers: [CmsService],
  imports: [
    BannersModule,
    MulterModule.register({
      dest: './uploads'
    })
  ]
})
export class CmsModule {}
