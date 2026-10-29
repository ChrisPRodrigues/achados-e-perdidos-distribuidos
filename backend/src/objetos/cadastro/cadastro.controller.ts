import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { CadastroService } from './cadastro.service.js';
import { ObjetoEntity } from '../entities/objeto.entity.js';
import { CriarObjetoDto } from '../dto/criar-objeto.dto.js';
import { ObjetoRespostaDto } from '../dto/objeto-resposta.dto.js';
import { paraObjetoResposta } from '../dto/objeto-resposta.mapper.js';

@Controller('objetos')
export class CadastroController {
  constructor(
    private readonly cadastroService: CadastroService,
  ) {}

  @Post()
  async cadastrar(
    @Body() dados: CriarObjetoDto,
  ): Promise<ObjetoRespostaDto> {
    const novoObjeto = await this.cadastroService.cadastrar(dados);

    return paraObjetoResposta(novoObjeto);
  }

  @Get(':id')
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ObjetoRespostaDto> {
    const objeto = await this.cadastroService.buscarPorId(id);

    return paraObjetoResposta(objeto);
  }
}