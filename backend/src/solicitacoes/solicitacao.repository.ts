import { Injectable } from '@nestjs/common';
import type { Solicitacao } from './models/solicitacao/solicitacao.interface.js';

@Injectable()
export class SolicitacaoRepository {
  private solicitacoes: Solicitacao[] = [];

  private proximoId = 1;

  listar(): Solicitacao[] {
    return this.solicitacoes;
  }

  buscarPorId(id: number): Solicitacao | undefined {
    return this.solicitacoes.find(
      (solicitacao) => solicitacao.id === id,
    );
  }

  adicionar(solicitacao: Omit<Solicitacao, 'id'>): Solicitacao {
    const novaSolicitacao: Solicitacao = {
      id: this.proximoId++,
      ...solicitacao,
    };

    this.solicitacoes.push(novaSolicitacao);

    return novaSolicitacao;
  }

  atualizar(
    id: number,
    dados: Partial<Solicitacao>,
  ): Solicitacao | undefined {
    const solicitacao = this.buscarPorId(id);

    if (!solicitacao) {
      return undefined;
    }

    Object.assign(solicitacao, dados);

    return solicitacao;
  }

  remover(id: number): boolean {
    const indice = this.solicitacoes.findIndex(
      (solicitacao) => solicitacao.id === id,
    );

    if (indice === -1) {
      return false;
    }

    this.solicitacoes.splice(indice, 1);

    return true;
  }
}