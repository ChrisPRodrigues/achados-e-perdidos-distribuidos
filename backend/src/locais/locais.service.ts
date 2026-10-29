import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { LocalEntity } from './entities/local.entity.js';
import { CriarLocalDto } from './dto/criar-local.dto.js';
import { AtualizarLocalDto } from './dto/atualizar-local.dto.js';

@Injectable()
export class LocaisService {
  constructor(
    @InjectRepository(LocalEntity)
    private readonly locaisRepository: Repository<LocalEntity>,
  ) {}

  async listar(): Promise<LocalEntity[]> {
    return this.locaisRepository.find();
  }

  async buscarPorId(id: number): Promise<LocalEntity> {
    const local = await this.locaisRepository.findOne({
      where: { id },
    });

    if (!local) {
      throw new NotFoundException('Local não encontrado');
    }

    return local;
  }

  async adicionar(dados: CriarLocalDto): Promise<LocalEntity> {
    const nome = dados.nome.trim();

    const localExistente = await this.locaisRepository.findOne({
      where: { nome },
    });

    if (localExistente) {
      throw new ConflictException('Local já cadastrado');
    }

    const novoLocal = this.locaisRepository.create({
      nome,
      descricao: dados.descricao ?? null,
    });

    return this.locaisRepository.save(novoLocal);
  }

  async atualizar(
    id: number,
    dados: AtualizarLocalDto,
  ): Promise<LocalEntity> {
    const local = await this.buscarPorId(id);

    if (dados.nome !== undefined) {
      const nome = dados.nome.trim();

      const localExistente = await this.locaisRepository.findOne({
        where: { nome },
      });

      if (localExistente && localExistente.id !== id) {
        throw new ConflictException('Local já cadastrado');
      }

      local.nome = nome;
    }

    if (dados.descricao !== undefined) {
      local.descricao = dados.descricao;
    }

    return this.locaisRepository.save(local);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    try {
      await this.locaisRepository.delete(id);
    } catch (erro) {
      if (
        erro instanceof QueryFailedError &&
        (erro.driverError as { code?: string })?.code === '23503'
      ) {
        throw new ConflictException(
          'Não é possível excluir um local associado a objetos',
        );
      }

      throw erro;
    }
  }
}