
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SolicitacaoController } from './solicitacao.controller.js';
import { SolicitacaoService } from './solicitacao.service.js';
import { SolicitacaoEntity } from './entities/solicitacao.entity.js';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity.js';
import { ObjetoEntity } from '../objetos/entities/objeto.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolicitacaoEntity,
      UsuarioEntity,
      ObjetoEntity,
    ]),
  ],
  controllers: [SolicitacaoController],
  providers: [SolicitacaoService],
})
export class SolicitacoesModule {}
