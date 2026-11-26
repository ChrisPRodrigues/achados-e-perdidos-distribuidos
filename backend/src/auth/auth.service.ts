import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';

import { UsuarioEntity } from '../usuarios/entities/usuario.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepository: Repository<UsuarioEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.usuariosRepository.findOneBy({
      email: email.toLowerCase().trim(),
    });

    if (!usuario || !usuario.senha_hash) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const senhaValida = await compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    if (usuario.status === 'pendente') {
      throw new ForbiddenException(
        'Seu cadastro de docente ainda aguarda aprovação do administrador.',
      );
    }

    if (usuario.status !== 'ativo') {
      throw new ForbiddenException(
        'Esta conta ainda não está ativa. Procure o administrador.',
      );
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    };
  }
}