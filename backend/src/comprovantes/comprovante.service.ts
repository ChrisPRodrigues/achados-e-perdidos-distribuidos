import { Injectable, NotFoundException } from '@nestjs/common';
import type { Comprovante } from './comprovante.interface.js';
import { ComprovanteRepository } from './comprovante.repository.js';

@Injectable()
export class ComprovanteService {
  constructor(
    private readonly comprovanteRepository: ComprovanteRepository,
  ) {}

  listar(): Comprovante[] {
    return this.comprovanteRepository.listar();
  }

  buscarPorId(id: number): Comprovante {
    const comprovante = this.comprovanteRepository.buscarPorId(id);

    if (!comprovante) {
      throw new NotFoundException('Comprovante não encontrado.');
    }

    return comprovante;
  }

  adicionar(dados: Omit<Comprovante, 'id'>): Comprovante {
    return this.comprovanteRepository.adicionar(dados);
  }

  atualizar(
    id: number,
    dados: Partial<Omit<Comprovante, 'id'>>,
  ): Comprovante {
    const comprovante = this.comprovanteRepository.atualizar(id, dados);

    if (!comprovante) {
      throw new NotFoundException('Comprovante não encontrado.');
    }

    return comprovante;
  }

  remover(id: number): void {
    const removido = this.comprovanteRepository.remover(id);

    if (!removido) {
      throw new NotFoundException('Comprovante não encontrado.');
    }
  }
}