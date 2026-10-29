
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
    };
  }

  @Get()
  async listar(): Promise<UsuarioRespostaDto[]> {
    const usuarios = await this.usuariosService.listar();

    return usuarios.map((usuario) => this.paraResposta(usuario));
  }

  @Post()
  async cadastrar(
    @Body() usuario: CriarUsuarioDto,
  ): Promise<UsuarioRespostaDto> {
    const novoUsuario = await this.usuariosService.cadastrar(usuario);

    return this.paraResposta(novoUsuario);
  }

  @Get(':id')
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UsuarioRespostaDto> {
    const usuario = await this.usuariosService.buscarPorId(id);

    return this.paraResposta(usuario);
  }

  @Patch(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarUsuarioDto,
  ): Promise<UsuarioRespostaDto> {
    const usuarioAtualizado = await this.usuariosService.atualizar(id, dados);

    return this.paraResposta(usuarioAtualizado);
  }

  @Delete(':id')
  async remover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ mensagem: string }> {
    const resultado = await this.usuariosService.remover(id);

    return resultado;
  }
}