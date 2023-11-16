import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescription1700057916885 implements MigrationInterface {
    name = 'AddDescription1700057916885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding" DROP COLUMN "description"`);
    }

}
