
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum CacheControlScope {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export class SignupInput {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export class LoginInput {
    username: string;
    password: string;
}

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

export class User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export abstract class IQuery {
    abstract login(loginInput: LoginInput): LoginResponse | Promise<LoginResponse>;

    abstract songs(page: number, pageSize: number): Song[] | Promise<Song[]>;

    abstract song(id: string): Song | Promise<Song>;
}

export abstract class IMutation {
    abstract signup(signupInput: SignupInput): SignupResponse | Promise<SignupResponse>;

    abstract createSong(createSongInput: CreateSongInput): Song | Promise<Song>;

    abstract updateSong(id: string, updateSongInput: UpdateSongInput): Song | Promise<Song>;

    abstract deleteSong(id: string): boolean | Promise<boolean>;
}

export class SignupResponse {
    username: string;
}

export class LoginResponse {
    accessToken: string;
}

export class Song {
    id: string;
    title?: Nullable<string>;
    releaseDate?: Nullable<string>;
    duration?: Nullable<string>;
}

export abstract class ISubscription {
    abstract songCreated(): Song | Promise<Song>;
}

type Nullable<T> = T | null;
