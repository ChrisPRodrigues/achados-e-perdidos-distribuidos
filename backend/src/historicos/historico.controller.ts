import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { Historico } from './historico.interface.js';
import { HistoricoService } from './historico.service.js';

@Controller('historicos')
export class HistoricoController {
  constructor(
    private readonly historicoService: HistoricoService,
  ) {}

  @Get()
  listar(): Historico[] {
    return this.historicoService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string): Historico {
    return this.historicoService.buscarPorId(Number(id));
  }

  @Post()
  adicionar(
    @Body() dados: Omit<Historico, 'id'>,
  ): Historico {
    return this.historicoService.adicionar(dados);
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() dados: Partial<Omit<Historico, 'id'>>,
  ): Historico {
    return this.historicoService.atualizar(
      Number(id),
      dados,
    );
  }

  @Delete(':id')
  remover(@Param('id') id: string): void {
    return this.historicoService.remover(Number(id));
  }
}