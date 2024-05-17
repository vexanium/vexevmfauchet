import { Test, TestingModule } from '@nestjs/testing';
import { HyperionStreamService } from './hyperion-stream.service';

describe('HyperionStreamService', () => {
  let service: HyperionStreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HyperionStreamService],
    }).compile();

    service = module.get<HyperionStreamService>(HyperionStreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
