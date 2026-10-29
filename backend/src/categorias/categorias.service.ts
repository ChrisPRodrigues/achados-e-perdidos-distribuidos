import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { CategoriaEntity } from './entities/categoria.entity.js';
import { CriarCategoriaDto } from './dto/criar-categoria.dto.js';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto.js';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly categoriasRepository: Repository<CategoriaEntity>,
  ) {}

  async criar(dados: CriarCategoriaDto): Promise<CategoriaEntity> {
    const nome = dados.nome.trim();

    const categoriaExistente = await this.categoriasRepository.findOne({
      where: { nome },
    });

    if (categoriaExistente) {
      throw new ConflictException('Categoria já cadastrada');
    }

    const novaCategoria = this.categoriasRepository.create({
      nome,
      descricao: dados.descricao ?? null,
    });

    return this.categoriasRepository.save(novaCategoria);
  }

  async listar(): Promise<CategoriaEntity[]> {
    return this.categoriasRepository.find();
  }

  async buscarPorId(id: number): Promise<CategoriaEntity> {
    const categoria = await this.categoriasRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return categoria;
  }

  async atualizar(
    id: number,
    dados: AtualizarCategoriaDto,
  ): Promise<CategoriaEntity> {
    const categoria = await this.buscarPorId(id);

    if (dados.nome !== undefined) {
      const nome = dados.nome.trim();

      const categoriaExistente = await this.categoriasRepository.findOne({
        where: { nome },
      });

      if (categoriaExistente && categoriaExistente.id !== id) {
        throw new ConflictException('Categoria já cadastrada');
      }

      categoria.nome = nome;
    }

    if (dados.descricao !== undefined) {
      categoria.descricao = dados.descricao;
    }

    return this.categoriasRepository.save(categoria);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    try {
      await this.categoriasRepository.delete(id);
    } catch (erro) {
      if (
        erro instanceof QueryFailedError &&
        (erro.driverError as { code?: string })?.code === '23503'
      ) {
        throw new ConflictException(
          'Não é possível excluir uma categoria associada a objetos',
        );
      }

      throw erro;
    }
  }
}