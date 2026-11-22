
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdicionarDataCriacaoSolicitacao1793200000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      DROP COLUMN "created_at"
    `);
  }
}
