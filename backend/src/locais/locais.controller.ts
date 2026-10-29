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

import { LocaisService } from './locais.service.js';
import { LocalEntity } from './entities/local.entity.js';
import { CriarLocalDto } from './dto/criar-local.dto.js';
import { AtualizarLocalDto } from './dto/atualizar-local.dto.js';
import { LocalRespostaDto } from './dto/local-resposta.dto.js';

@Controller('locais')
export class LocaisController {
  constructor(
    private readonly locaisService: LocaisService,
  ) {}

  private paraResposta(
    local: LocalEntity
  ): LocalRespostaDto {
    return {
      id: local.id,
      nome: local.nome,
      descricao: local.descricao,
    };
  }

  @Get()
  listar(): Promise<LocalRespostaDto[]> {
    return this.locaisService.listar().then((locais) =>
      locais.map((local) => this.paraResposta(local))
    );
  }

  @Get(':id')
  buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LocalRespostaDto> {
    return this.locaisService.buscarPorId(id).then(
      (local) => this.paraResposta(local)
    );
  }

  @Post()
  adicionar(
    @Body() dados: CriarLocalDto,
  ): Promise<LocalRespostaDto> {
    return this.locaisService.adicionar(dados).then((local) =>
      this.paraResposta(local));
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarLocalDto,
  ): Promise<LocalRespostaDto> {
    return this.locaisService.atualizar(id, dados).then((local) =>
      this.paraResposta(local));
  }

  @Delete(':id')
  remover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.locaisService.remover(id);
  }
}