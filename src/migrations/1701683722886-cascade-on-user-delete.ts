import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOnUserDelete1701683722886 implements MigrationInterface {
    name = 'CascadeOnUserDelete1701683722886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_69b470efb1b19aca6e781214490"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_776000050f42ddb61d3c628ff16"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`ALTER TABLE "onboarding" DROP CONSTRAINT "FK_dde55e1deb49d2555f7e4aebd8f"`);
        await queryRunner.query(`ALTER TABLE "onboarding_progress" DROP CONSTRAINT "FK_4415f2106c0bc02bd20482fb485"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_776000050f42ddb61d3c628ff16" FOREIGN KEY ("fromId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_69b470efb1b19aca6e781214490" FOREIGN KEY ("toId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding" ADD CONSTRAINT "FK_dde55e1deb49d2555f7e4aebd8f" FOREIGN KEY ("reportToId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding_progress" ADD CONSTRAINT "FK_4415f2106c0bc02bd20482fb485" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_progress" DROP CONSTRAINT "FK_4415f2106c0bc02bd20482fb485"`);
        await queryRunner.query(`ALTER TABLE "onboarding" DROP CONSTRAINT "FK_dde55e1deb49d2555f7e4aebd8f"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_69b470efb1b19aca6e781214490"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_776000050f42ddb61d3c628ff16"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c"`);
        await queryRunner.query(`ALTER TABLE "onboarding_progress" ADD CONSTRAINT "FK_4415f2106c0bc02bd20482fb485" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding" ADD CONSTRAINT "FK_dde55e1deb49d2555f7e4aebd8f" FOREIGN KEY ("reportToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_776000050f42ddb61d3c628ff16" FOREIGN KEY ("fromId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_69b470efb1b19aca6e781214490" FOREIGN KEY ("toId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
