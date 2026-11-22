
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdicionarFotoEComprovacao1793100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "objetos"
      ADD COLUMN "foto" text
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      ADD COLUMN "comprovacao" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      DROP COLUMN "comprovacao"
    `);

    await queryRunner.query(`
      ALTER TABLE "objetos"
      DROP COLUMN "foto"
    `);
  }
}
