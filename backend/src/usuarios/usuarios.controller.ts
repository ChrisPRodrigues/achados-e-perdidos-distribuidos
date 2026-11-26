
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { UsuariosService } from './usuarios.service.js';
import { UsuarioEntity } from './entities/usuario.entity.js';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto.js';
import { UsuarioRespostaDto } from './dto/usuario-resposta.dto.js';
import { Public } from '../auth/public.decorator.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  private paraResposta(
    usuario: UsuarioEntity,
  ): UsuarioRespostaDto {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      status: usuario.status,
    };
  }

  @Roles('admin')
  @Get()
  async listar(): Promise<UsuarioRespostaDto[]> {
    const usuarios = await this.usuariosService.listar();
    return usuarios.map((usuario) => this.paraResposta(usuario));
  }

  @Public()
  @Post()
  async cadastrar(
    @Body() usuario: CriarUsuarioDto,
  ): Promise<UsuarioRespostaDto> {
    const novoUsuario = await this.usuariosService.cadastrar(usuario);
    return this.paraResposta(novoUsuario);
  }

  @Roles('admin')
  @Get(':id')
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UsuarioRespostaDto> {
    const usuario = await this.usuariosService.buscarPorId(id);
    return this.paraResposta(usuario);
  }

  @Roles('admin')
  @Patch(':id/status')
  async atualizarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ): Promise<UsuarioRespostaDto> {
    const usuario = await this.usuariosService.atualizarStatus(id, status);
    return this.paraResposta(usuario);
  }

  @Roles('admin')
  @Patch(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarUsuarioDto,
  ): Promise<UsuarioRespostaDto> {
    const usuarioAtualizado = await this.usuariosService.atualizar(id, dados);
    return this.paraResposta(usuarioAtualizado);
  }

  @Roles('admin')
  @Delete(':id')
  async remover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ mensagem: string }> {
    return this.usuariosService.remover(id);
  }
}
