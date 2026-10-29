import { Module } from '@nestjs/common';
import { HistoricoController } from './historico.controller.js';
import { HistoricoRepository } from './historico.repository.js';
import { HistoricoService } from './historico.service.js';

@Module({
  controllers: [HistoricoController],
  providers: [
    HistoricoService,
    HistoricoRepository,
  ],
})
export class HistoricoModule {}