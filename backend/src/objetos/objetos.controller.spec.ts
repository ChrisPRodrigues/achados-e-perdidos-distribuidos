
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ObjetosController } from './objetos.controller.js';
import { ObjetoEntity } from './entities/objeto.entity.js';

describe('ObjetosController', () => {
  let controller: ObjetosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjetosController],
      providers: [
        {
          provide: getRepositoryToken(ObjetoEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ObjetosController>(ObjetosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
