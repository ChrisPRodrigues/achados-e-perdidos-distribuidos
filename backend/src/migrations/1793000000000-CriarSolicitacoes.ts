
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriarSolicitacoes1793000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "solicitacoes" (
        "id" SERIAL NOT NULL,
        "usuario_id" integer NOT NULL,
        "objeto_id" integer NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'pendente',
        CONSTRAINT "PK_solicitacoes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_solicitacoes_usuario"
          FOREIGN KEY ("usuario_id")
          REFERENCES "usuarios"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT "FK_solicitacoes_objeto"
          FOREIGN KEY ("objeto_id")
          REFERENCES "objetos"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT "CHK_solicitacoes_status"
          CHECK ("status" IN ('pendente', 'aprovada', 'recusada'))
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "solicitacoes"
    `);
  }
}
