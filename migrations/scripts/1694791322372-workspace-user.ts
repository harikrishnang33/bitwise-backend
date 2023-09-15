import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorkspaceUser1694791322372 implements MigrationInterface {
  name = 'WorkspaceUser1694791322372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "workspace_users" ("created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0) WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "workspace_id" uuid NOT NULL, CONSTRAINT "PK_6d52a8e2739982d783279cffe84" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "workspace_users"`);
  }
}
