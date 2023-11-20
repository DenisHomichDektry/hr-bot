import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnboardingProgress1700150227164 implements MigrationInterface {
    name = 'AddOnboardingProgress1700150227164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_638a55ddc57cad610c122c4ab86"`);
        await queryRunner.query(`CREATE TABLE "onboarding_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "stepId" uuid, CONSTRAINT "PK_070eb6e4f3132f9d7f29651aa3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "onboardingStep"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "onboardingStepId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "text" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "source" character varying`);
        await queryRunner.query(`ALTER TABLE "onboarding_progress" ADD CONSTRAINT "FK_4415f2106c0bc02bd20482fb485" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding_progress" ADD CONSTRAINT "FK_3a92a5242f2c666e249f9f9aadb" FOREIGN KEY ("stepId") REFERENCES "onboarding"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_progress" DROP CONSTRAINT "FK_3a92a5242f2c666e249f9f9aadb"`);
        await queryRunner.query(`ALTER TABLE "onboarding_progress" DROP CONSTRAINT "FK_4415f2106c0bc02bd20482fb485"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "source"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "onboardingStepId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "onboardingStep" integer`);
        await queryRunner.query(`DROP TABLE "onboarding_progress"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_638a55ddc57cad610c122c4ab86" FOREIGN KEY ("onboardingStepId") REFERENCES "onboarding"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
