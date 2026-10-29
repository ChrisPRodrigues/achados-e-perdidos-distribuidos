

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { SolicitacaoService } from './solicitacao.service.js';
import { CriarSolicitacaoDto } from './dto/criar-solicitacao.dto.js';
import { AtualizarSolicitacaoDto } from './dto/atualizar-solicitacao.dto.js';
import { SolicitacaoRespostaDto } from './dto/solicitacao-resposta.dto.js';
import type { Solicitacao } from './models/solicitacao/solicitacao.interface.js';

@Controller('solicitacoes')
export class SolicitacaoController {
  constructor(
    private readonly solicitacaoService: SolicitacaoService,
  ) {}

  private paraResposta(
    solicitacao: Solicitacao,
  ): SolicitacaoRespostaDto {
    return {
      id: solicitacao.id,
      usuarioId: solicitacao.usuarioId,
      objetoId: solicitacao.objetoId,
      status: solicitacao.status,
    };
  }

  @Get()
  async listar(): Promise<SolicitacaoRespostaDto[]> {
    const solicitacoes = await this.solicitacaoService.listar();

    return solicitacoes.map((solicitacao) =>
      this.paraResposta(solicitacao),
    );
  }

  @Post()
  async cadastrar(
    @Body() dados: CriarSolicitacaoDto,
  ): Promise<SolicitacaoRespostaDto> {
    const solicitacao = await this.solicitacaoService.cadastrar(dados);

    return this.paraResposta(solicitacao);
  }

  @Get(':id')
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SolicitacaoRespostaDto> {
    const solicitacao = await this.solicitacaoService.buscarPorId(id);

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    return this.paraResposta(solicitacao);
  }

  @Patch(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarSolicitacaoDto,
  ): Promise<SolicitacaoRespostaDto> {
    const solicitacao = await this.solicitacaoService.atualizar(id, dados);

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    return this.paraResposta(solicitacao);
  }

  @Delete(':id')
  async remover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.solicitacaoService.remover(id);
  }
}
