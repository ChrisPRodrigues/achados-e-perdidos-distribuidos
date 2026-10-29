
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

import { DevolucaoService } from './devolucao.service.js';
import type { Devolucao } from './devolucao.interface.js';
import { CriarDevolucaoDto } from './dto/criar-devolucao.dto.js';
import { AtualizarDevolucaoDto } from './dto/atualizar-devolucao.dto.js';
import { DevolucaoRespostaDto } from './dto/devolucao-resposta.dto.js';

@Controller('devolucoes')
export class DevolucaoController {
  constructor(
    private readonly devolucaoService: DevolucaoService,
  ) { }

  private paraResposta(
    devolucao: Devolucao
  ): DevolucaoRespostaDto {
    return {
      id: devolucao.id,
      objetoId: devolucao.objetoId,
      usuarioId: devolucao.usuarioId,
      dataDevolucao: devolucao.dataDevolucao,
      observacao: devolucao.observacao,
    };
  }

  @Get()
  listar(): Promise<DevolucaoRespostaDto[]> {
    return this.devolucaoService.listar().then((devolucoes) =>
      devolucoes.map((devolucao) => this.paraResposta(devolucao))
    );
  }

  @Get(':id')
  buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DevolucaoRespostaDto> {
    return this.devolucaoService.buscarPorId(id).then(
      (devolucao) => this.paraResposta(devolucao)
    );
  }

  @Post()
  adicionar(
    @Body() dados: CriarDevolucaoDto,
  ): Promise<DevolucaoRespostaDto> {
    return this.devolucaoService.adicionar(dados).then((devolucao) =>
      this.paraResposta(devolucao));
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarDevolucaoDto,
  ): Promise<DevolucaoRespostaDto> {
    return this.devolucaoService.atualizar(id, dados).then((devolucao) => this.paraResposta(devolucao));
  }

  @Delete(':id')
  remover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.devolucaoService.remover(id);
  }
}