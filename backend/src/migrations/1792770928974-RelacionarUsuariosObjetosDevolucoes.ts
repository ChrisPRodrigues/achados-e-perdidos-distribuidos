import { MigrationInterface, QueryRunner } from "typeorm";

export class RelacionarUsuariosObjetosDevolucoes1792770928974 implements MigrationInterface {
    name = 'RelacionarUsuariosObjetosDevolucoes1792770928974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "objetos" ADD "usuario_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devolucoes" ADD "usuario_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "objetos" ADD CONSTRAINT "FK_ea2eeedd230bea363eb01861857" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devolucoes" ADD CONSTRAINT "FK_bab7768fc5ef5a189f3ea9a91a3" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devolucoes" DROP CONSTRAINT "FK_bab7768fc5ef5a189f3ea9a91a3"`);
        await queryRunner.query(`ALTER TABLE "objetos" DROP CONSTRAINT "FK_ea2eeedd230bea363eb01861857"`);
        await queryRunner.query(`ALTER TABLE "devolucoes" DROP COLUMN "usuario_id"`);
        await queryRunner.query(`ALTER TABLE "objetos" DROP COLUMN "usuario_id"`);
    }

}
