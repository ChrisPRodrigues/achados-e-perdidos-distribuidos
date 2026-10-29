import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

import { UsuarioEntity } from './usuarios/entities/usuario.entity.js';
import { CategoriaEntity } from './categorias/entities/categoria.entity.js';
import { LocalEntity } from './locais/entities/local.entity.js';
import { ObjetoEntity } from './objetos/entities/objeto.entity.js';
import { DevolucaoEntity } from './devolucoes/entities/devolucao.entity.js';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: true }
      : false,

  entities: [
    UsuarioEntity,
    CategoriaEntity,
    LocalEntity,
    ObjetoEntity,
    DevolucaoEntity,
  ],

  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});