import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKnowledgeBaseCategory1698243627106 implements MigrationInterface {
    name = 'AddKnowledgeBaseCategory1698243627106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledge_base" RENAME COLUMN "description" TO "categoryId"`);
        await queryRunner.query(`CREATE TABLE "knowledge_base_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8ba06c2b53efe658e46a78950c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "knowledge_base" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "knowledge_base" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "knowledge_base" ADD CONSTRAINT "FK_3cf0599a5d507290dccc49cfa84" FOREIGN KEY ("categoryId") REFERENCES "knowledge_base_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledge_base" DROP CONSTRAINT "FK_3cf0599a5d507290dccc49cfa84"`);
        await queryRunner.query(`ALTER TABLE "knowledge_base" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "knowledge_base" ADD "categoryId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "knowledge_base_category"`);
        await queryRunner.query(`ALTER TABLE "knowledge_base" RENAME COLUMN "categoryId" TO "description"`);
    }

}
