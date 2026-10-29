import { MigrationInterface, QueryRunner } from "typeorm";

export class CriarUsuarios1792722918383 implements MigrationInterface {
    name = 'CriarUsuarios1792722918383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nome" character varying(150) NOT NULL, "email" character varying(255) NOT NULL, "tipo" character varying(20) NOT NULL, CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
