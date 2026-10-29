
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ObjetoEntity } from '../entities/objeto.entity.js';
import { CategoriaEntity } from '../../categorias/entities/categoria.entity.js';
import { LocalEntity } from '../../locais/entities/local.entity.js';
import { UsuarioEntity } from '../../usuarios/entities/usuario.entity.js';

type DadosCadastroObjeto = {
  nome: string;
  descricao: string;
  categoriaId: number;
  localId: number;
  usuarioId: number;
  dataEncontrado: Date;
};

@Injectable()
export class CadastroService {
  constructor(
    @InjectRepository(ObjetoEntity)
    private readonly objetosRepository: Repository<ObjetoEntity>,

    @InjectRepository(CategoriaEntity)
    private readonly categoriasRepository: Repository<CategoriaEntity>,

    @InjectRepository(LocalEntity)
    private readonly locaisRepository: Repository<LocalEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepository: Repository<UsuarioEntity>,
  ) {}

  async cadastrar(
    dados: DadosCadastroObjeto,
  ): Promise<ObjetoEntity> {
    const categoria = await this.categoriasRepository.findOneBy({
      id: dados.categoriaId,
    });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const local = await this.locaisRepository.findOneBy({
      id: dados.localId,
    });

    if (!local) {
      throw new NotFoundException('Local não encontrado');
    }

    const usuario = await this.usuariosRepository.findOneBy({
      id: dados.usuarioId,
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (usuario.tipo !== 'docente') {
      throw new BadRequestException(
        'Somente docentes podem cadastrar objetos',
      );
    }

    const objeto = this.objetosRepository.create({
      nome: dados.nome,
      descricao: dados.descricao,
      categoria,
      localEncontrado: local,
      usuario,
      dataEncontrado: dados.dataEncontrado,
      status: 'encontrado',
    });

    return this.objetosRepository.save(objeto);
  }

  async buscarPorId(id: number): Promise<ObjetoEntity> {
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
