import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArtistEntitySongRelations1726248675168
  implements MigrationInterface
{
  name = 'ArtistEntitySongRelations1726248675168';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "artists" ("id" int NOT NULL IDENTITY(1,1), "stageName" nvarchar(255) NOT NULL, "userId" int, CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_f7bd9114dc2849a90d39512911" ON "artists" ("userId") WHERE "userId" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "songs_artists" ("songId" int NOT NULL, "artistsId" int NOT NULL, CONSTRAINT "PK_692cd19990920a7c993ed7deea6" PRIMARY KEY ("songId", "artistsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6b46ee473a9983b18d8100860a" ON "songs_artists" ("songId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3f43a7e4032521e4edd2e7ecd2" ON "songs_artists" ("artistsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "artists" ADD CONSTRAINT "FK_f7bd9114dc2849a90d39512911b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_6b46ee473a9983b18d8100860ad" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Fill songs_artists
    const songs = await queryRunner.query(`SELECT id, artists FROM "song"`);
    for (const song of songs) {
      const artistsArray = song.artists.split(',');
      for (const stageName of artistsArray) {
        const cleanedStageName = stageName.trim();

        let artist = await queryRunner.query(`
          SELECT * FROM "artists" WHERE "stageName" = '${cleanedStageName}'
        `);

        if (artist.length === 0) {
          const username = cleanedStageName
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9]/gi, '');

          await queryRunner.query(`
            INSERT INTO "user" (firstName, lastName, username, password)
            VALUES ('${cleanedStageName}', '${cleanedStageName}', '${username}', 'p4ssw0d!')
          `);

          const userId = await queryRunner.query(
            `SELECT id FROM "user" WHERE username = '${username}'`,
          );

          await queryRunner.query(`
            INSERT INTO "artists" ("stageName", "userId")
            VALUES ('${cleanedStageName}', ${userId[0].id})
          `);

          artist = await queryRunner.query(`
            SELECT * FROM "artists" WHERE "stageName" = '${cleanedStageName}'
          `);
        }

        await queryRunner.query(`
          INSERT INTO "songs_artists" ("songId", "artistsId")
          VALUES (${song.id}, ${artist[0].id})
        `);
      }
    }

    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "artists"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Refill Song.artists
    await queryRunner.query(`ALTER TABLE "song" ADD "artists" ntext NOT NULL`);

    const songs = await queryRunner.query(`SELECT id FROM "song"`);
    for (const song of songs) {
      const artists = await queryRunner.query(`
        SELECT "stageName" FROM "artists"
        INNER JOIN "songs_artists" ON "artists"."id" = "songs_artists"."artistsId"
        WHERE "songs_artists"."songId" = ${song.id}
      `);

      const artistsString = artists
        .map((artist: { stageName: string }) => artist.stageName)
        .join(',');

      await queryRunner.query(`
        UPDATE "song"
        SET "artists" = '${artistsString}'
        WHERE "id" = ${song.id}
      `);
    }

    await queryRunner.query(
      `ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_6b46ee473a9983b18d8100860ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "artists" DROP CONSTRAINT "FK_f7bd9114dc2849a90d39512911b"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3f43a7e4032521e4edd2e7ecd2" ON "songs_artists"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_6b46ee473a9983b18d8100860a" ON "songs_artists"`,
    );
    await queryRunner.query(`DROP TABLE "songs_artists"`);
    await queryRunner.query(
      `DROP INDEX "REL_f7bd9114dc2849a90d39512911" ON "artists"`,
    );
    await queryRunner.query(`DROP TABLE "artists"`);
  }
}
