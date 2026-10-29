
import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ObjetoEntity } from '../entities/objeto.entity.js';
import { CategoriaEntity } from '../../categorias/entities/categoria.entity.js';
import { LocalEntity } from '../../locais/entities/local.entity.js';
import { DevolucaoService } from '../../devolucoes/devolucao.service.js';

type DadosAtualizacaoObjeto = {
  nome?: string;
  descricao?: string;
  categoriaId?: number;
  localId?: number;
  dataEncontrado?: Date;
};

@Injectable()
export class GerenciamentoService {
  constructor(
    @InjectRepository(ObjetoEntity)
    private readonly objetosRepository: Repository<ObjetoEntity>,

    @InjectRepository(CategoriaEntity)
    private readonly categoriasRepository: Repository<CategoriaEntity>,

    @InjectRepository(LocalEntity)
    private readonly locaisRepository: Repository<LocalEntity>,

    private readonly devolucoesService: DevolucaoService,
  ) {}

  async atualizar(
    id: number,
    dados: DadosAtualizacaoObjeto,
  ): Promise<ObjetoEntity> {
    const objeto = await this.buscarObjeto(id);

    if (dados.nome !== undefined) {
      objeto.nome = dados.nome;
    }

    if (dados.descricao !== undefined) {
      objeto.descricao = dados.descricao;
    }

    if (dados.dataEncontrado !== undefined) {
      objeto.dataEncontrado = dados.dataEncontrado;
    }

    if (dados.categoriaId !== undefined) {
      const categoria = await this.categoriasRepository.findOneBy({
        id: dados.categoriaId,
      });

      if (!categoria) {
        throw new NotFoundException('Categoria não encontrada');
      }

      objeto.categoria = categoria;
    }

    if (dados.localId !== undefined) {
      const local = await this.locaisRepository.findOneBy({
        id: dados.localId,
      });

      if (!local) {
        throw new NotFoundException('Local não encontrado');
      }

      objeto.localEncontrado = local;
    }

    await this.objetosRepository.save(objeto);

    return this.buscarObjeto(id);
  }


async devolver(
  id: number,
  usuarioId: number,
  observacao?: string,
): Promise<ObjetoEntity> {
  await this.devolucoesService.adicionar({
    objetoId: id,
    usuarioId,
    observacao,
  });

  return this.buscarObjeto(id);
}

  private async buscarObjeto(id: number): Promise<ObjetoEntity> {
    const objeto = await this.objetosRepository.findOne({
      where: { id },
      relations: {
        categoria: true,
        localEncontrado: true,
        usuario: true,
      },
    });

    if (!objeto) {
      throw new NotFoundException('Objeto não encontrado');
    }

    return objeto;
  }
}
