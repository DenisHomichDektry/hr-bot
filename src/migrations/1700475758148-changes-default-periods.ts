import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangesDefaultPeriods1700475758148 implements MigrationInterface {
    name = 'ChangesDefaultPeriods1700475758148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding" ALTER COLUMN "notificationIntervals" SET DEFAULT '{600000,600000,600000,600000}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding" ALTER COLUMN "notificationIntervals" SET DEFAULT '{600000,600000,600000}'`);
    }

}
