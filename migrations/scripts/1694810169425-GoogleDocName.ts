import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoogleDocName1694810169425 implements MigrationInterface {
  name = 'GoogleDocName1694810169425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "google_doc" ADD "name" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "google_doc" DROP COLUMN "name"`);
  }
}
