import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionarEntidadesMvp1792769989722 implements MigrationInterface {
    name = 'AdicionarEntidadesMvp1792769989722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categorias" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, CONSTRAINT "UQ_de8a2d8979f7820616e31dc1e15" UNIQUE ("nome"), CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locais" ("id" SERIAL NOT NULL, "nome" character varying(150) NOT NULL, CONSTRAINT "UQ_64320ca4be574b81c57b95484bb" UNIQUE ("nome"), CONSTRAINT "PK_42eaed01557782613d36365d300" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "objetos" ("id" SERIAL NOT NULL, "nome" character varying(150) NOT NULL, "descricao" text NOT NULL, "dataEncontrado" TIMESTAMP NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'encontrado', "categoria_id" integer NOT NULL, "local_id" integer NOT NULL, CONSTRAINT "PK_5f2898ccbd673819ed827b32a91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "devolucoes" ("id" SERIAL NOT NULL, "dataDevolucao" TIMESTAMP NOT NULL DEFAULT now(), "objeto_id" integer NOT NULL, CONSTRAINT "REL_9ff892c612f28f70e177f5a387" UNIQUE ("objeto_id"), CONSTRAINT "PK_e89335b8032acafded142bbbff1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "objetos" ADD CONSTRAINT "FK_1e1425c88011c24bdf5c17f4ebf" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "objetos" ADD CONSTRAINT "FK_44bf3f10332412700dcb7d98c76" FOREIGN KEY ("local_id") REFERENCES "locais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devolucoes" ADD CONSTRAINT "FK_9ff892c612f28f70e177f5a387b" FOREIGN KEY ("objeto_id") REFERENCES "objetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devolucoes" DROP CONSTRAINT "FK_9ff892c612f28f70e177f5a387b"`);
        await queryRunner.query(`ALTER TABLE "objetos" DROP CONSTRAINT "FK_44bf3f10332412700dcb7d98c76"`);
        await queryRunner.query(`ALTER TABLE "objetos" DROP CONSTRAINT "FK_1e1425c88011c24bdf5c17f4ebf"`);
        await queryRunner.query(`DROP TABLE "devolucoes"`);
        await queryRunner.query(`DROP TABLE "objetos"`);
        await queryRunner.query(`DROP TABLE "locais"`);
        await queryRunner.query(`DROP TABLE "categorias"`);
    }

}
