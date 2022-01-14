import { Test, TestingModule } from '@nestjs/testing';
import { StreamingMatchConsumerService } from './streaming-match.consumer.service';

describe('StreamingMatchConsumerService', () => {
  let service: StreamingMatchConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamingMatchConsumerService],
    }).compile();

    service = module.get<StreamingMatchConsumerService>(StreamingMatchConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
