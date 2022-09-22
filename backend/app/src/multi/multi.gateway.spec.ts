import { Test, TestingModule } from '@nestjs/testing';
import { MultiGateway } from './multi.gateway';

describe('MultiGateway', () => {
  let gateway: MultiGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultiGateway],
    }).compile();

    gateway = module.get<MultiGateway>(MultiGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
