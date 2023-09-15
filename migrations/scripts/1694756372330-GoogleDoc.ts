import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoogleDoc1694756372330 implements MigrationInterface {
  name = 'GoogleDoc1694756372330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "google_doc" ("created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0) WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "doc_id" character varying, CONSTRAINT "PK_72b39dfd7972d9a497434ed90ca" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "google_doc"`);
  }
}
