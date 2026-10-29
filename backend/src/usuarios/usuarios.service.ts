
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { UsuarioEntity } from './entities/usuario.entity.js';

type TipoUsuario = 'aluno' | 'docente';

type DadosUsuario = {
  nome: string;
  email: string;
  tipo: TipoUsuario;
};

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepository: Repository<UsuarioEntity>,
  ) {}

  listar(): Promise<UsuarioEntity[]> {
    return this.usuariosRepository.find();
  }

  async cadastrar(dados: DadosUsuario): Promise<UsuarioEntity> {
    const emailExistente = await this.usuariosRepository.findOneBy({
      email: dados.email,
    });

    if (emailExistente) {
      throw new ConflictException('Já existe um usuário com esse e-mail');
    }

    const novoUsuario = this.usuariosRepository.create(dados);
    return this.usuariosRepository.save(novoUsuario);
  }

  async buscarPorId(id: number): Promise<UsuarioEntity> {
    const usuario = await this.usuariosRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async atualizar(
    id: number,
    dados: Partial<DadosUsuario>,
  ): Promise<UsuarioEntity> {
    const usuario = await this.buscarPorId(id);

    if (dados.email && dados.email !== usuario.email) {
      const emailExistente = await this.usuariosRepository.findOneBy({
        email: dados.email,
      });

      if (emailExistente) {
        throw new ConflictException('Já existe um usuário com esse e-mail');
      }
    }

    Object.assign(usuario, dados);
    return this.usuariosRepository.save(usuario);
  }

  async remover(id: number): Promise<{ mensagem: string }> {
    const usuario = await this.buscarPorId(id);

    try {
      await this.usuariosRepository.remove(usuario);
    } catch (erro) {
      if (
        erro instanceof QueryFailedError &&
        (erro.driverError as { code?: string }).code === '23503'
      ) {
        throw new ConflictException(
          'Não é possível excluir este usuário porque existem objetos ou devoluções vinculados a ele.',
        );
      }

      throw erro;
    }

    return { mensagem: 'Usuário removido com sucesso' };
  }
}
