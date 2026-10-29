import { Test, TestingModule } from '@nestjs/testing';
import { ProcessamentoParaleloService } from './processamento-paralelo.service.js';

describe('ProcessamentoParaleloService', () => {
  let service: ProcessamentoParaleloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessamentoParaleloService],
    }).compile();

    service = module.get<ProcessamentoParaleloService>(ProcessamentoParaleloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
