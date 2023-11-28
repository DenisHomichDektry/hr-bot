import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailAndImageToUser1700817423161 implements MigrationInterface {
    name = 'AddEmailAndImageToUser1700817423161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "imgUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "imgUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    }

}
