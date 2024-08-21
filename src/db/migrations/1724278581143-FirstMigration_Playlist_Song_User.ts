import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigrationPlaylistSongUser1724278581143 implements MigrationInterface {
    name = 'FirstMigrationPlaylistSongUser1724278581143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "song" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "artists" ntext NOT NULL, "releaseDate" nvarchar(255) NOT NULL, "duration" nvarchar(255) NOT NULL, CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlist" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "userId" int, CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "username" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlist_songs_song" ("playlistId" int NOT NULL, "songId" int NOT NULL, CONSTRAINT "PK_9a24b586572c2896bfb75e57fb4" PRIMARY KEY ("playlistId", "songId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3e66846398a681262e56574fc9" ON "playlist_songs_song" ("playlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_efc8204ff6cdd9f17e83f8d001" ON "playlist_songs_song" ("songId") `);
        await queryRunner.query(`ALTER TABLE "playlist" ADD CONSTRAINT "FK_92ca9b9b5394093adb6e5f55c4b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist_songs_song" ADD CONSTRAINT "FK_3e66846398a681262e56574fc99" FOREIGN KEY ("playlistId") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "playlist_songs_song" ADD CONSTRAINT "FK_efc8204ff6cdd9f17e83f8d001e" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_songs_song" DROP CONSTRAINT "FK_efc8204ff6cdd9f17e83f8d001e"`);
        await queryRunner.query(`ALTER TABLE "playlist_songs_song" DROP CONSTRAINT "FK_3e66846398a681262e56574fc99"`);
        await queryRunner.query(`ALTER TABLE "playlist" DROP CONSTRAINT "FK_92ca9b9b5394093adb6e5f55c4b"`);
        await queryRunner.query(`DROP INDEX "IDX_efc8204ff6cdd9f17e83f8d001" ON "playlist_songs_song"`);
        await queryRunner.query(`DROP INDEX "IDX_3e66846398a681262e56574fc9" ON "playlist_songs_song"`);
        await queryRunner.query(`DROP TABLE "playlist_songs_song"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "playlist"`);
        await queryRunner.query(`DROP TABLE "song"`);
    }

}
