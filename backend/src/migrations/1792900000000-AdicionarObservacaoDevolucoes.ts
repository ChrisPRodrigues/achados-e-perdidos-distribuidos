
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdicionarObservacaoDevolucoes1792900000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "devolucoes"
      ADD COLUMN "observacao" character varying(500)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "devolucoes"
      DROP COLUMN "observacao"
    `);
  }
}