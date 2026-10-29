import { Injectable } from '@nestjs/common';
import type { Devolucao } from './devolucao.interface.js';

@Injectable()
export class DevolucaoRepository {
  private devolucoes: Devolucao[] = [];

  private proximoId = 1;

  listar(): Devolucao[] {
    return this.devolucoes;
  }

  buscarPorId(id: number): Devolucao | undefined {
    return this.devolucoes.find(
      (devolucao) => devolucao.id === id,
    );
  }

  adicionar(devolucao: Omit<Devolucao, 'id'>): Devolucao {
    const novaDevolucao: Devolucao = {
      id: this.proximoId++,
      ...devolucao,
    };

    this.devolucoes.push(novaDevolucao);

    return novaDevolucao;
  }

  atualizar(
    id: number,
    dados: Partial<Omit<Devolucao, 'id'>>,
  ): Devolucao | undefined {
    const devolucao = this.buscarPorId(id);

    if (!devolucao) {
      return undefined;
    }

    Object.assign(devolucao, dados);

    return devolucao;
  }

  remover(id: number): boolean {
    const indice = this.devolucoes.findIndex(
      (devolucao) => devolucao.id === id,
    );

    if (indice === -1) {
      return false;
    }

    this.devolucoes.splice(indice, 1);

    return true;
  }
}