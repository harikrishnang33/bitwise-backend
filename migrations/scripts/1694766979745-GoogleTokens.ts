import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoogleTokens1694766979745 implements MigrationInterface {
  name = 'GoogleTokens1694766979745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "google_token_data" json NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "google_token_data"`,
    );
  }
}
