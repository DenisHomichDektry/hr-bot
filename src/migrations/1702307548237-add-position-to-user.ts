import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPositionToUser1702307548237 implements MigrationInterface {
    name = 'AddPositionToUser1702307548237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "position" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "position"`);
    }

}
