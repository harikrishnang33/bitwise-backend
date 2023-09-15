import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspace1694755628374 implements MigrationInterface {
    name = 'Workspace1694755628374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "workspace" ("created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0) WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying NOT NULL, "admin_user_id" uuid NOT NULL, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_workspace_name" ON "workspace" ("name") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_b023bae16b1b2b764ac5a7f75e8" FOREIGN KEY ("admin_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_b023bae16b1b2b764ac5a7f75e8"`);
        await queryRunner.query(`DROP INDEX "public"."idx_workspace_name"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
    }

}
