import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTitleToName1698326392236 implements MigrationInterface {
    name = 'ChangeTitleToName1698326392236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledge_base_category" RENAME COLUMN "title" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledge_base_category" RENAME COLUMN "name" TO "title"`);
    }

}
