
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SolicitacaoEntity } from './entities/solicitacao.entity.js';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity.js';
import { ObjetoEntity } from '../objetos/entities/objeto.entity.js';
import type { Solicitacao } from './models/solicitacao/solicitacao.interface.js';

type DadosSolicitacao = Omit<Solicitacao, 'id' | 'createdAt' | 'comprovacao'> & {
  comprovacao?: string | null;
};

@Injectable()
export class SolicitacaoService {
  constructor(
    @InjectRepository(SolicitacaoEntity)
    private readonly solicitacoesRepository: Repository<SolicitacaoEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepository: Repository<UsuarioEntity>,

    @InjectRepository(ObjetoEntity)
    private readonly objetosRepository: Repository<ObjetoEntity>,
  ) {}

  private paraSolicitacao(entidade: SolicitacaoEntity): Solicitacao {
    return {
      id: entidade.id,
      usuarioId: entidade.usuario.id,
      objetoId: entidade.objeto.id,
      comprovacao: entidade.comprovacao ?? null,
      status: entidade.status,
      createdAt: entidade.createdAt,
    };
  }

  private async verificarSolicitacaoPendente(
    usuarioId: number,
    objetoId: number,
    ignorarId?: number,
  ): Promise<void> {
    const consulta = this.solicitacoesRepository
      .createQueryBuilder('solicitacao')
      .innerJoin('solicitacao.usuario', 'usuario')
      .innerJoin('solicitacao.objeto', 'objeto')
      .where('usuario.id = :usuarioId', { usuarioId })
      .andWhere('objeto.id = :objetoId', { objetoId })
      .andWhere('solicitacao.status = :status', {
        status: 'pendente',
      });

    if (ignorarId !== undefined) {
      consulta.andWhere('solicitacao.id != :ignorarId', {
        ignorarId,
      });
    }

    const existente = await consulta.getOne();

    if (existente) {
      throw new ConflictException(
        'Você já possui uma solicitação pendente para este objeto.',
      );
    }
  }

  private async buscarUsuario(id: number): Promise<UsuarioEntity> {
    const usuario = await this.usuariosRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  private async buscarObjeto(id: number): Promise<ObjetoEntity> {
    const objeto = await this.objetosRepository.findOneBy({ id });

    if (!objeto) {
      throw new NotFoundException('Objeto não encontrado');
    }

    return objeto;
  }

  async listar(): Promise<Solicitacao[]> {
    const solicitacoes = await this.solicitacoesRepository.find({
      relations: {
        usuario: true,
        objeto: true,
      },
    });

    return solicitacoes.map((solicitacao) =>
      this.paraSolicitacao(solicitacao),
    );
  }

  async cadastrar(dados: DadosSolicitacao): Promise<Solicitacao> {
    const usuario = await this.buscarUsuario(dados.usuarioId);
    const objeto = await this.buscarObjeto(dados.objetoId);

    if (dados.status === 'pendente') {
      await this.verificarSolicitacaoPendente(
        dados.usuarioId,
        dados.objetoId,
      );
    }

    const solicitacao = this.solicitacoesRepository.create({
      usuario,
      objeto,
      comprovacao: dados.comprovacao ?? null,
      status: dados.status,
    });

    const salva = await this.solicitacoesRepository.save(solicitacao);

    return this.paraSolicitacao(salva);
  }

  async buscarPorId(id: number): Promise<Solicitacao | undefined> {
    const solicitacao = await this.solicitacoesRepository.findOne({
      where: { id },
      relations: {
        usuario: true,
        objeto: true,
      },
    });

    return solicitacao
      ? this.paraSolicitacao(solicitacao)
      : undefined;
  }

  async atualizar(
    id: number,
    dados: Partial<DadosSolicitacao>,
  ): Promise<Solicitacao | undefined> {
    const solicitacao = await this.solicitacoesRepository.findOne({
      where: { id },
      relations: {
        usuario: true,
        objeto: true,
      },
    });

    if (!solicitacao) {
      return undefined;
    }

    if (dados.usuarioId !== undefined) {
      solicitacao.usuario = await this.buscarUsuario(dados.usuarioId);
    }

    if (dados.objetoId !== undefined) {
      solicitacao.objeto = await this.buscarObjeto(dados.objetoId);
    }

    if (dados.comprovacao !== undefined) {
      solicitacao.comprovacao = dados.comprovacao;
    }

    if (dados.status !== undefined) {
      solicitacao.status = dados.status;
    }

    if (solicitacao.status === 'pendente') {
      await this.verificarSolicitacaoPendente(
        solicitacao.usuario.id,
        solicitacao.objeto.id,
        solicitacao.id,
      );
    }

    const atualizada = await this.solicitacoesRepository.save(solicitacao);

    return this.paraSolicitacao(atualizada);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await this.solicitacoesRepository.delete(id);

    return (resultado.affected ?? 0) > 0;
  }
}
