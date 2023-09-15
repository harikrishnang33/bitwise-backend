import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorkspaceUsers1694779540428 implements MigrationInterface {
  name = 'WorkspaceUsers1694779540428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "workspace_users" ("created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0) WITH TIME ZONE, "user_id" character varying NOT NULL, "workspace_id" character varying NOT NULL, CONSTRAINT "PK_32ac635a2108dccfd39a000a4ee" PRIMARY KEY ("user_id", "workspace_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "workspace_users"`);
  }
}
