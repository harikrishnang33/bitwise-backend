import { MigrationInterface, QueryRunner } from "typeorm";

export class GoogleWorkspaceIntegration1694807629269 implements MigrationInterface {
    name = 'GoogleWorkspaceIntegration1694807629269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "google_doc" ADD "workspace_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "google_doc" DROP COLUMN "workspace_id"`);
    }

}
