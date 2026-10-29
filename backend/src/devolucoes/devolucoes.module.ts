
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DevolucaoController } from './devolucao.controller.js';
import { DevolucaoService } from './devolucao.service.js';
import { DevolucaoEntity } from './entities/devolucao.entity.js';
import { ObjetoEntity } from '../objetos/entities/objeto.entity.js';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevolucaoEntity,
      ObjetoEntity,
      UsuarioEntity,
    ]),
  ],
  controllers: [DevolucaoController],
  providers: [DevolucaoService],
  exports: [DevolucaoService],
})
export class DevolucoesModule {}
