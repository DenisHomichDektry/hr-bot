import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUser1698057921171 implements MigrationInterface {
  name = 'AddUser1698057921171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "telegramId" integer NOT NULL, "roleId" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Insert roles
    await queryRunner.query(
      `INSERT INTO "user_role" ("name") VALUES ('admin')`,
    );
    await queryRunner.query(`INSERT INTO "user_role" ("name") VALUES ('user')`);

    // Insert admin user
    await queryRunner.query(
      `INSERT INTO "user" ("firstName", "lastName", "telegramId", "roleId") VALUES ('Admin', 'Frankyshtein', '30310118', (SELECT "id" FROM "user_role" WHERE "name" = 'admin'))`,
    );
    await queryRunner.query(
      `CREATE TABLE "knowledge_base" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "link" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "knowledge_base"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
  }
}
