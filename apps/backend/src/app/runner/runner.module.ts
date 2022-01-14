import { Module } from '@nestjs/common';
import { CmsQueueModule } from './cms-queue/cms-queue.module';

@Module({
  imports: [CmsQueueModule],
})
export class RunnerModule {}
