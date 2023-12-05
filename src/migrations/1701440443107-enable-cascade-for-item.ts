import { MigrationInterface, QueryRunner } from "typeorm";

export class EnableCascadeForItem1701440443107 implements MigrationInterface {
    name = 'EnableCascadeForItem1701440443107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledge_base" DROP CONSTRAINT "FK_3cf0599a5d507290dccc49cfa84"`);
        await queryRunner.query(`ALTER TABLE "knowledge_base" ADD CONSTRAINT "FK_3cf0599a5d507290dccc49cfa84" FOREIGN KEY ("categoryId") REFERENCES "knowledge_base_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledge_base" DROP CONSTRAINT "FK_3cf0599a5d507290dccc49cfa84"`);
        await queryRunner.query(`ALTER TABLE "knowledge_base" ADD CONSTRAINT "FK_3cf0599a5d507290dccc49cfa84" FOREIGN KEY ("categoryId") REFERENCES "knowledge_base_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
