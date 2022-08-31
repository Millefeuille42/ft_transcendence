import { Test, TestingModule } from '@nestjs/testing';
import { TmpDbService } from './tmp_db.service';

describe('TmpDbService', () => {
  let service: TmpDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TmpDbService],
    }).compile();

    service = module.get<TmpDbService>(TmpDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
