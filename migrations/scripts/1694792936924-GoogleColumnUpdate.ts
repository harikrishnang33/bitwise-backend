import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoogleColumnUpdate1694792936924 implements MigrationInterface {
  name = 'GoogleColumnUpdate1694792936924';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "google_doc" RENAME COLUMN "doc_id" TO "google_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "google_doc" RENAME COLUMN "google_id" TO "doc_id"`,
    );
  }
}
