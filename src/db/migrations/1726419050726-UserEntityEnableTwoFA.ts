import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntityEnableTwoFA1726419050726 implements MigrationInterface {
  name = 'UserEntityEnableTwoFA1726419050726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "twoFASecret" text`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "enableTwoFA" bit NOT NULL CONSTRAINT "DF_2f8206d4b8d46b3c165e65cfa9f" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_2f8206d4b8d46b3c165e65cfa9f"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "enableTwoFA"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twoFASecret"`);
  }
}
