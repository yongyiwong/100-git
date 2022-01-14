import { HttpModule, Module } from '@nestjs/common';
import { TencentService } from './tencent.service';
import { TencentController } from './tencent.controller';

@Module({
  controllers: [TencentController],
  providers: [TencentService],
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
  ],
  exports: [TencentService],
})
export class TecentModule {}
