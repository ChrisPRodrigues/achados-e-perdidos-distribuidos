
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjetoRespostaDto } from './dto/objeto-resposta.dto.js';

import { ObjetoEntity } from './entities/objeto.entity.js';
import { paraObjetoResposta } from './dto/objeto-resposta.mapper.js';

@Controller('objetos')
export class ObjetosController {
  constructor(
    @InjectRepository(ObjetoEntity)
    private readonly objetosRepository: Repository<ObjetoEntity>,
  ) {}

  @Get()
  async listar(): Promise<ObjetoRespostaDto[]> {
    const objetos = await this.objetosRepository.find({
      relations: {
        categoria: true,
        localEncontrado: true,
        usuario: true,
      },
      order: {
        id: 'ASC',
      },
    });

    return objetos.map((objeto) => paraObjetoResposta(objeto));
  }
}
