import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntityEnableAPIKey1726452143615 implements MigrationInterface {
    name = 'UserEntityEnableAPIKey1726452143615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "apiKey" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "apiKey"`);
    }

}
