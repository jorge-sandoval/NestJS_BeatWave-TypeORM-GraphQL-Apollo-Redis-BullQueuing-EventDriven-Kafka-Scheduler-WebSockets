
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateSongInput {
    title: string;
    artistIds: string[];
    releasedDate: string;
    duration: string;
}

export class UpdateSongInput {
    title?: Nullable<string>;
    artistIds?: Nullable<string[]>;
    releasedDate?: Nullable<string>;
    duration?: Nullable<string>;
}

export class Song {
    id: string;
    title?: Nullable<string>;
    releaseDate?: Nullable<string>;
    duration?: Nullable<string>;
}

export abstract class IQuery {
    abstract songs(page: number, pageSize: number): Song[] | Promise<Song[]>;

    abstract song(id: string): Song | Promise<Song>;
}

export abstract class IMutation {
    abstract createSong(createSongInput: CreateSongInput): Song | Promise<Song>;

    abstract updateSong(id: string, updateSongInput: UpdateSongInput): Song | Promise<Song>;

    abstract deleteSong(id: string): boolean | Promise<boolean>;
}

type Nullable<T> = T | null;
