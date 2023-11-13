import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReportTo1699869334729 implements MigrationInterface {
    name = 'AddReportTo1699869334729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding" ADD "reportToId" uuid`);
        await queryRunner.query(`ALTER TABLE "onboarding" ALTER COLUMN "createdAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "onboarding" ADD CONSTRAINT "FK_dde55e1deb49d2555f7e4aebd8f" FOREIGN KEY ("reportToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding" DROP CONSTRAINT "FK_dde55e1deb49d2555f7e4aebd8f"`);
        await queryRunner.query(`ALTER TABLE "onboarding" ALTER COLUMN "createdAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "onboarding" DROP COLUMN "reportToId"`);
    }

}
