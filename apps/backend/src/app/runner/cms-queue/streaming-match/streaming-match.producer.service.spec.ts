import { Test, TestingModule } from '@nestjs/testing';
import { StreamingMatchProducerService } from './streaming-match.producer.service';

describe('StreamingMatchService', () => {
  let service: StreamingMatchProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamingMatchProducerService],
    }).compile();

    service = module.get<StreamingMatchProducerService>(StreamingMatchProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
