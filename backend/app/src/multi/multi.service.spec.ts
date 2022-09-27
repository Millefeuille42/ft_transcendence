import { Test, TestingModule } from '@nestjs/testing';
import { MultiService } from './multi.service';

describe('MultiService', () => {
  let service: MultiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultiService],
    }).compile();

    service = module.get<MultiService>(MultiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
