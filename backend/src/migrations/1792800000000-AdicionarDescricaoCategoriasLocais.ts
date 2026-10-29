import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdicionarDescricaoCategoriasLocais1792800000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "categorias"
      ADD COLUMN "descricao" text
    `);

    await queryRunner.query(`
      ALTER TABLE "locais"
      ADD COLUMN "descricao" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "locais"
      DROP COLUMN "descricao"
    `);

    await queryRunner.query(`
      ALTER TABLE "categorias"
      DROP COLUMN "descricao"
    `);
  }
}