import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriasController } from './categorias.controller.js';
import { CategoriasService } from './categorias.service.js';
import { CategoriaEntity } from './entities/categoria.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaEntity]),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}