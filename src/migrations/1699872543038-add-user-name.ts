import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserName1699872543038 implements MigrationInterface {
    name = 'AddUserName1699872543038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    }

}
