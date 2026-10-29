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

import { CategoriasService } from './categorias.service.js';
import { CriarCategoriaDto } from './dto/criar-categoria.dto.js';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto.js';
import { CategoriaEntity } from './entities/categoria.entity.js';
import { CategoriaRespostaDto } from './dto/categoria-resposta.dto.js';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) { }

  private paraResposta(
    categoria: CategoriaEntity
  ): CategoriaRespostaDto {
    return {
      id: categoria.id,
      nome: categoria.nome,
      descricao: categoria.descricao,
    };
  }

  @Post()
  async criar(
    @Body() dados: CriarCategoriaDto
  ): Promise<CategoriaRespostaDto> {
    const novaCategoria = await this.categoriasService.criar(dados);

    return this.paraResposta(novaCategoria);
  }

  @Get()
  async listar(): Promise<CategoriaRespostaDto[]> {
    const categorias = await this.categoriasService.listar();

    return categorias.map((categoria) => this.paraResposta(categoria));
  }

  @Get(':id')
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CategoriaRespostaDto> {
    const categoria = await this.categoriasService.buscarPorId(id);

    return this.paraResposta(categoria);
  }

  @Patch(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarCategoriaDto,
  ): Promise<CategoriaRespostaDto> {
    const categoriaAtualizada = await this.categoriasService.atualizar(id, dados);

    return this.paraResposta(categoriaAtualizada);
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remover(id);
  }
}