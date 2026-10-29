
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';

import { GerenciamentoService } from './gerenciamento.service.js';
import { AtualizarObjetoDto } from '../dto/atualizar-objeto.dto.js';
import { RegistrarDevolucaoDto } from '../../devolucoes/dto/registrar-devolucao.dto.js';
import {ObjetoRespostaDto} from "../dto/objeto-resposta.dto.js";
import { paraObjetoResposta } from '../dto/objeto-resposta.mapper.js';

@Controller('objetos')
export class GerenciamentoController {
  constructor(
    private readonly gerenciamentoService: GerenciamentoService,
  ) {}

  @Patch(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarObjetoDto,
  ): Promise<ObjetoRespostaDto> {
    const objetoAtualizado =
    await this.gerenciamentoService.atualizar(id, dados);

    return paraObjetoResposta(objetoAtualizado);
  }

  @Patch(':id/devolucao')
  async devolver(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: RegistrarDevolucaoDto,
  ): Promise<ObjetoRespostaDto> {
    const objetoDevolvido =
    await this.gerenciamentoService.devolver(
      id,
      dados.usuarioId,
      dados.observacao,
    );

    return paraObjetoResposta(objetoDevolvido);
  }
}