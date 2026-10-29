
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ObjetoEntity } from './entities/objeto.entity.js';
import { CategoriaEntity } from '../categorias/entities/categoria.entity.js';
import { LocalEntity } from '../locais/entities/local.entity.js';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity.js';
import { DevolucaoEntity } from '../devolucoes/entities/devolucao.entity.js';

import { CategoriasModule } from '../categorias/categorias.module.js';
import { ObjetosRepositoryService } from './objetos-repository/objetos-repository.service.js';
import { ObjetosController } from './objetos.controller.js';
import { CadastroController } from './cadastro/cadastro.controller.js';
import { CadastroService } from './cadastro/cadastro.service.js';
import { GerenciamentoController } from './gerenciamento/gerenciamento.controller.js';
import { GerenciamentoService } from './gerenciamento/gerenciamento.service.js';
import { DevolucoesModule } from '../devolucoes/devolucoes.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ObjetoEntity,
      CategoriaEntity,
      LocalEntity,
      UsuarioEntity,
      DevolucaoEntity,
    ]),
    CategoriasModule,
    DevolucoesModule,
  ],
  providers: [
    ObjetosRepositoryService,
    CadastroService,
    GerenciamentoService,
  ],
  exports: [ObjetosRepositoryService],
  controllers: [
    ObjetosController,
    CadastroController,
    GerenciamentoController,
  ],
})
export class ObjetosModule {}
