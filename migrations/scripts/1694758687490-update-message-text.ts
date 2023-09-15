import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMessageText1694758687490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.message ALTER COLUMN message TYPE text USING message::text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // no implementation
  }
}
