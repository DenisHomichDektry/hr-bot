import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultForNotificationIntervals1699626595573 implements MigrationInterface {
    name = 'SetDefaultForNotificationIntervals1699626595573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding" ALTER COLUMN "notificationIntervals" SET DEFAULT '{600000,600000,600000}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding" ALTER COLUMN "notificationIntervals" DROP DEFAULT`);
    }

}
