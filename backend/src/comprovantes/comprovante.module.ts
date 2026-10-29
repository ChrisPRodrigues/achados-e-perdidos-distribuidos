import { Module } from '@nestjs/common';
import { ComprovanteController } from './comprovante.controller.js';
import { ComprovanteRepository } from './comprovante.repository.js';
import { ComprovanteService } from './comprovante.service.js';

@Module({
  controllers: [ComprovanteController],
  providers: [
    ComprovanteService,
    ComprovanteRepository,
  ],
})
export class ComprovanteModule {}