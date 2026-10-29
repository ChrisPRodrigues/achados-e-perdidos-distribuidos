

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SolicitacaoEntity } from './entities/solicitacao.entity.js';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity.js';
import { ObjetoEntity } from '../objetos/entities/objeto.entity.js';
import type { Solicitacao } from './models/solicitacao/solicitacao.interface.js';

type DadosSolicitacao = Omit<Solicitacao, 'id'>;

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
      status: entidade.status,
    };
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

    const solicitacao = this.solicitacoesRepository.create({
      usuario,
      objeto,
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

    if (dados.status !== undefined) {
      solicitacao.status = dados.status;
    }

    const atualizada = await this.solicitacoesRepository.save(solicitacao);

    return this.paraSolicitacao(atualizada);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await this.solicitacoesRepository.delete(id);

    return (resultado.affected ?? 0) > 0;
  }
}
