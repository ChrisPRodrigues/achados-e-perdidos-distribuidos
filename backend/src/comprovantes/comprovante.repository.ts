import { Injectable } from '@nestjs/common';
import type { Comprovante } from './comprovante.interface.js';

@Injectable()
export class ComprovanteRepository {
  private comprovantes: Comprovante[] = [];

  private proximoId = 1;

  listar(): Comprovante[] {
    return this.comprovantes;
  }

  buscarPorId(id: number): Comprovante | undefined {
    return this.comprovantes.find(
      (comprovante) => comprovante.id === id,
    );
  }

  adicionar(comprovante: Omit<Comprovante, 'id'>): Comprovante {
    const novoComprovante: Comprovante = {
      id: this.proximoId++,
      ...comprovante,
    };

    this.comprovantes.push(novoComprovante);

    return novoComprovante;
  }

  atualizar(
    id: number,
    dados: Partial<Omit<Comprovante, 'id'>>,
  ): Comprovante | undefined {
    const comprovante = this.buscarPorId(id);

    if (!comprovante) {
      return undefined;
    }

    Object.assign(comprovante, dados);

    return comprovante;
  }

  remover(id: number): boolean {
    const indice = this.comprovantes.findIndex(
      (comprovante) => comprovante.id === id,
    );

    if (indice === -1) {
      return false;
    }

    this.comprovantes.splice(indice, 1);

    return true;
  }
}