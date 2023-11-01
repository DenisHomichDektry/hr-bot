import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnboarding1698850106948 implements MigrationInterface {
    name = 'AddOnboarding1698850106948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "onboarding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "link" character varying NOT NULL, "order" integer NOT NULL, "notificationIntervals" integer array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b8b6cfe63674aaee17874f033cf" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "onboarding"`);
    }

}
