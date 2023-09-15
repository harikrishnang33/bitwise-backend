import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketWorkspace1694762696603 implements MigrationInterface {
  name = 'TicketWorkspace1694762696603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "workspace_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "workspace_id"`);
  }
}
