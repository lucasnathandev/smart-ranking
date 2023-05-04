import { Test, TestingModule } from '@nestjs/testing';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';

describe('DesafiosController', () => {
  let controller: DesafiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesafiosController],
      providers: [DesafiosService],
    }).compile();

    controller = module.get<DesafiosController>(DesafiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
