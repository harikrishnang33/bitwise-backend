import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkedNodeMessageDesc1694788452155 implements MigrationInterface {
  name = 'LinkedNodeMessageDesc1694788452155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "linked_node" ("created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0) WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source_id" character varying NOT NULL, "destination_id" character varying NOT NULL, "workspace_id" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_60430dbd53e8e63a9e26d58ee0e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "linked_node"`);
  }
}
