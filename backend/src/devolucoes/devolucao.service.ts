
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DevolucaoEntity } from './entities/devolucao.entity.js';
import { ObjetoEntity } from '../objetos/entities/objeto.entity.js';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity.js';
import type { Devolucao } from './devolucao.interface.js';

@Injectable()
export class DevolucaoService {
  constructor(
    @InjectRepository(DevolucaoEntity)
    private readonly devolucoes: Repository<DevolucaoEntity>
  ) {}

  async listar(): Promise<Devolucao[]> {
    const registros = await this.devolucoes.find({
      relations: { objeto: true, usuario: true },
      order: { id: 'ASC' },
    });

    return registros.map((item) => this.converter(item));
  }

  async buscarPorId(id: number): Promise<Devolucao> {
    const registro = await this.devolucoes.findOne({
      where: { id },
      relations: { objeto: true, usuario: true },
    });

    if (!registro) {
      throw new NotFoundException('Devolução não encontrada');
    }

    return this.converter(registro);
  }


async adicionar(
  dados: Omit<Devolucao, 'id' | 'dataDevolucao'>,
): Promise<Devolucao> {
  const registroId = await this.devolucoes.manager.transaction(
    async (manager) => {
      // Busca e bloqueia o objeto durante a transação
      const objeto = await manager
        .getRepository(ObjetoEntity)
        .createQueryBuilder('objeto')
        .setLock('pessimistic_write')
        .where('objeto.id = :id', { id: dados.objetoId })
        .getOne();

      if (!objeto) {
        throw new NotFoundException('Objeto não encontrado');
      }

      if (objeto.status === 'devolvido') {
        throw new ConflictException(
          'Este objeto já foi devolvido',
        );
      }

      // Verifica se já existe devolução registrada
      const devolucaoExistente = await manager
        .getRepository(DevolucaoEntity)
        .findOne({
          where: { objeto: { id: objeto.id } },
        });

      if (devolucaoExistente) {
        throw new ConflictException(
          'Este objeto já possui uma devolução registrada',
        );
      }

      // Verifica se o usuário existe
      const usuario = await manager
        .getRepository(UsuarioEntity)
        .findOneBy({ id: dados.usuarioId });

      if (!usuario) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Somente docentes podem registrar devoluções
      if (usuario.tipo !== 'docente') {
        throw new BadRequestException(
          'Somente docentes podem registrar devoluções',
        );
      }

      // Atualiza o status do objeto
      objeto.status = 'devolvido';
      await manager.save(ObjetoEntity, objeto);

      // Registra a devolução
      const devolucao = manager.create(DevolucaoEntity, {
        objeto,
        usuario,
        observacao: dados.observacao ?? null,
      });

      const salvo = await manager.save(
        DevolucaoEntity,
        devolucao,
      );

      return salvo.id;
    },
  );

  return this.buscarPorId(registroId);
}


async atualizar(
  id: number,
  dados: { observacao?: string },
): Promise<Devolucao> {
  const registro = await this.devolucoes.findOne({
    where: { id },
    relations: {
      objeto: true,
      usuario: true,
    },
  });

  if (!registro) {
    throw new NotFoundException(
      'Devolução não encontrada',
    );
  }

  if (dados.observacao !== undefined) {
    registro.observacao = dados.observacao;
  }

  await this.devolucoes.save(registro);

  return this.buscarPorId(id);
}


async remover(id: number): Promise<void> {
  await this.devolucoes.manager.transaction(
    async (manager) => {
      const devolucoesRepository =
        manager.getRepository(DevolucaoEntity);

      // Busca a devolução e seu objeto
      const devolucao = await devolucoesRepository.findOne({
        where: { id },
        relations: { objeto: true },
      });

      if (!devolucao) {
        throw new NotFoundException(
          'Devolução não encontrada',
        );
      }

      // Bloqueia o objeto durante a transação
      const objeto = await manager
        .getRepository(ObjetoEntity)
        .createQueryBuilder('objeto')
        .setLock('pessimistic_write')
        .where('objeto.id = :id', {
          id: devolucao.objeto.id,
        })
        .getOne();

      if (!objeto) {
        throw new NotFoundException(
          'Objeto não encontrado',
        );
      }

      // Confirma que a devolução ainda existe
      const registroAtual = await devolucoesRepository.findOneBy({
        id,
      });

      if (!registroAtual) {
        throw new NotFoundException(
          'Devolução não encontrada',
        );
      }

      // Exclui a devolução
      await devolucoesRepository.remove(registroAtual);

      // Restaura o status do objeto
      objeto.status = 'encontrado';

      await manager.save(ObjetoEntity, objeto);
    },
  );
}

  private converter(registro: DevolucaoEntity): Devolucao {
    return {
      id: registro.id,
      objetoId: registro.objeto.id,
      usuarioId: registro.usuario.id,
      dataDevolucao: registro.dataDevolucao,
      observacao: registro.observacao ?? undefined,
    };
  }
}
