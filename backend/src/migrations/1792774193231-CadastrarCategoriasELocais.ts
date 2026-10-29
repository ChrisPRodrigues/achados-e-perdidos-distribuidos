
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CadastrarCategoriasELocais1792774193231
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "categorias" ("nome")
      VALUES
        ('Eletrônicos'),
        ('Documentos'),
        ('Material escolar'),
        ('Roupas e acessórios'),
        ('Chaves'),
        ('Outros')
      ON CONFLICT ("nome") DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO "locais" ("nome")
      VALUES
        ('Biblioteca'),
        ('Laboratório'),
        ('Sala de aula'),
        ('Cantina'),
        ('Área de convivência'),
        ('Outros')
      ON CONFLICT ("nome") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "locais"
      WHERE "nome" IN (
        'Biblioteca',
        'Laboratório',
        'Sala de aula',
        'Cantina',
        'Área de convivência',
        'Outros'
      );
    `);

    await queryRunner.query(`
      DELETE FROM "categorias"
      WHERE "nome" IN (
        'Eletrônicos',
        'Documentos',
        'Material escolar',
        'Roupas e acessórios',
        'Chaves',
        'Outros'
      );
    `);
  }
}
