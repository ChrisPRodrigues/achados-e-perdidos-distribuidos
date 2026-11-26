import { Module, Logger } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';

import { ObjetosModule } from './objetos/objetos.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { DevolucoesModule } from './devolucoes/devolucoes.module.js';
import { CategoriasModule } from './categorias/categorias.module.js';
import { LocaisModule } from './locais/locais.module.js';
import { SolicitacoesModule } from './solicitacoes/solicitacoes.module.js';
import { ComprovanteModule } from './comprovantes/comprovante.module.js';
import { HistoricoModule } from './historicos/historico.module.js';
import { ProcessamentoParaleloModule } from './processamento-paralelo/processamento-paralelo.module.js';

const logger = new Logger('DatabaseConfig');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        logger.log(
          `DATABASE_URL recebida: ${databaseUrl ? 'SIM' : 'NÃO'}`,
        );

        if (process.env.RENDER && !databaseUrl) {
          throw new Error(
            'DATABASE_URL não foi configurada no ambiente do Render.',
          );
        }

        return {
          type: 'postgres' as const,
          ...(databaseUrl
            ? {
                url: databaseUrl,
                ssl: { rejectUnauthorized: false },
              }
            : {
                host: config.get<string>('DB_HOST'),
                port: Number(config.get<string>('DB_PORT') ?? 5432),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_DATABASE'),
                ssl:
                  config.get<string>('DB_SSL') === 'true'
                    ? { rejectUnauthorized: true }
                    : false,
              }),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),

    AuthModule,
    ObjetosModule,
    UsuariosModule,
    DevolucoesModule,
    CategoriasModule,
    LocaisModule,
    SolicitacoesModule,
    ComprovanteModule,
    HistoricoModule,
    ProcessamentoParaleloModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}