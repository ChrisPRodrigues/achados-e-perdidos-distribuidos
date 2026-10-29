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
import type { Comprovante } from './comprovante.interface.js';
import { ComprovanteService } from './comprovante.service.js';
import { CriarComprovanteDto } from './dto/criar-comprovante.dto.js';
import { AtualizarComprovanteDto } from './dto/atualizar-comprovante.dto.js';
import { ComprovanteRespostaDto } from './dto/comprovante-resposta.dto.js';

@Controller('comprovantes')
export class ComprovanteController {
  constructor(
    private readonly comprovanteService: ComprovanteService,
  ) { }

  private paraResposta(
    comprovante: Comprovante,
  ): ComprovanteRespostaDto {
    return {
      id: comprovante.id,
      objetoId: comprovante.objetoId,
      descricao: comprovante.descricao,
      dataRegistro: comprovante.dataRegistro,
    };
  }

  @Get()
  listar(): ComprovanteRespostaDto[] {
    return this.comprovanteService.listar().map((comprovante) =>
      this.paraResposta(comprovante)
    );
  }

  @Get(':id')
  buscarPorId(@Param('id', new ParseIntPipe()) id: number
  ): ComprovanteRespostaDto {
    const comprovante = this.comprovanteService.buscarPorId(id);

    return this.paraResposta(comprovante

    );
  }

  @Post()
  adicionar(
    @Body() dados: CriarComprovanteDto,
  ): ComprovanteRespostaDto {
    const comprovante = this.comprovanteService.adicionar(dados);
    return this.paraResposta(comprovante);
  }

  @Patch(':id')
  atualizar(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dados: AtualizarComprovanteDto,
  ): ComprovanteRespostaDto {
    const comprovante = this.comprovanteService.atualizar(
      id,
      dados,
    );

    return this.paraResposta(comprovante);
  }

  @Delete(':id')
  remover(@Param('id', new ParseIntPipe()) id: number): void {

    return this.comprovanteService.remover(id);
  }
}