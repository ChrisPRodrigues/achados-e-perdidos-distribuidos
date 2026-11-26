import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdicionarAutenticacaoUsuarios1793300000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN "senha_hash" varchar(255),
      ADD COLUMN "status" varchar(30) NOT NULL DEFAULT 'aguardando_senha'
    `);

    await queryRunner.query(`
      UPDATE "usuarios"
      SET "status" = 'pendente'
      WHERE "tipo" = 'docente'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN "status",
      DROP COLUMN "senha_hash"
    `);
  }
}