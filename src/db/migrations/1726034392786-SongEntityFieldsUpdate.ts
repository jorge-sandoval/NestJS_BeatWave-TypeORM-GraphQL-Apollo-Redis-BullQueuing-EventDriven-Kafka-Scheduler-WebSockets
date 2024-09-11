import { MigrationInterface, QueryRunner } from 'typeorm';

export class SongEntityFieldsUpdate1726034392786 implements MigrationInterface {
  name = 'SongEntityFieldsUpdate1726034392786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear las columnas temporales permitiendo valores NULL
    await queryRunner.query(`ALTER TABLE "song" ADD "tempReleasedDate" date NULL`);
    await queryRunner.query(`ALTER TABLE "song" ADD "tempDuration" time NULL`);

    // 2. Convertir y copiar los valores de las columnas existentes a las nuevas columnas temporales
    await queryRunner.query(`
        UPDATE "song"
        SET "tempReleasedDate" = TRY_CAST("releaseDate" AS date),
            "tempDuration" = TRY_CAST("duration" AS time)
    `);

    // 3. Eliminar las columnas antiguas
    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "releaseDate"`);
    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "duration"`);

    // 4. Renombrar las columnas temporales a sus nombres originales
    await queryRunner.query(`EXEC sp_rename 'song.tempReleasedDate', 'releasedDate', 'COLUMN'`);
    await queryRunner.query(`EXEC sp_rename 'song.tempDuration', 'duration', 'COLUMN'`);

    // 5. Asegurarse de que las nuevas columnas no permitan valores nulos
    await queryRunner.query(`ALTER TABLE "song" ALTER COLUMN "releasedDate" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "song" ALTER COLUMN "duration" time NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir el proceso de la misma manera
    await queryRunner.query(`ALTER TABLE "song" ADD "tempReleaseDate" nvarchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE "song" ADD "tempDuration" nvarchar(255) NULL`);

    // Convertir los valores de nuevo a cadenas de texto
    await queryRunner.query(`
        UPDATE "song"
        SET "tempReleaseDate" = CAST("releasedDate" AS nvarchar(255)),
            "tempDuration" = CAST("duration" AS nvarchar(255))
    `);

    // Eliminar las nuevas columnas
    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "releasedDate"`);
    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "duration"`);

    // Renombrar las columnas temporales a sus nombres originales
    await queryRunner.query(`EXEC sp_rename 'song.tempReleaseDate', 'releaseDate', 'COLUMN'`);
    await queryRunner.query(`EXEC sp_rename 'song.tempDuration', 'duration', 'COLUMN'`);
  }
}
