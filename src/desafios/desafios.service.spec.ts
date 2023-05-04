import { Test, TestingModule } from '@nestjs/testing';
import { DesafiosService } from './desafios.service';

describe('DesafiosService', () => {
  let service: DesafiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesafiosService],
    }).compile();

    service = module.get<DesafiosService>(DesafiosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
