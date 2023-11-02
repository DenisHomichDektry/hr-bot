import { MigrationInterface, QueryRunner } from "typeorm";

export class AddsOnboardingAndNotification1698935909144 implements MigrationInterface {
    name = 'AddsOnboardingAndNotification1698935909144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "sendAt" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "sendAt" SET DEFAULT now()`);
    }

}
