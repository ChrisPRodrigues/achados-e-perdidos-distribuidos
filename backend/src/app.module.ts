import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { ObjetosModule } from './objetos/objetos.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { DevolucoesModule } from './devolucoes/devolucoes.module.js';
import { CategoriasModule } from './categorias/categorias.module.js';
import { LocaisModule } from './locais/locais.module.js';
import { SolicitacoesModule } from './solicitacoes/solicitacoes.module.js';
import { ComprovanteModule } from './comprovantes/comprovante.module.js';
import { HistoricoModule } from './historicos/historico.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT') ?? 5432),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        ssl:
          config.get<string>('DB_SSL') === 'true'
            ? { rejectUnauthorized: true }
            : false,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    ObjetosModule,
    UsuariosModule,
    DevolucoesModule,
    CategoriasModule,
    LocaisModule,
    SolicitacoesModule,
    ComprovanteModule,
    HistoricoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}