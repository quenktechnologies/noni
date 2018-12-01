import * as fs from 'fs';
import { Future, pure, fromCallback } from '../control/monad/future';
import { Maybe, just, nothing } from '../data/maybe';
import { Either, fromBoolean } from '../data/either';

const Stats = fs.Stats;

export { Stats };

/**
 * Path to a file.
 */
export type Path = string;

/**
 * Contents of a file.
 */
export type Contents
    = string
    | Buffer
    | NodeJS.TypedArray
    | DataView
    ;

/**
 * stat (safe) wrapper.
 */
export const stat = (path: Path): Future<fs.Stats> =>
    fromCallback(cb => fs.stat(path, cb));

/**
 * exists (safe) wrapper.
 */
export const exists = (path: Path): Future<Maybe<Path>> =>
    stat(path)
        .map(() => just(path))
        .catch(() => pure(nothing()));

/**
 * isDirectory (safe) wrapper.
 */
export const isDirectory = (path: Path): Future<boolean> =>
    stat(path)        .map(s => s.isDirectory());

/**
 * isFile (safe) wrapper.
 */
export const isFile = (path: Path): Future<boolean> =>
    stat(path)        .map(s =>s.isFile());

/**
 * readdir (safe) wrapper
 */
export const readdir = (path: Path) =>
    fromCallback(cb => fs.readdir(path, cb));

/**
 * readFile (safe) wrapper
 */
export const readFile = (path: Path, options: string | object): Future<Contents> =>
    fromCallback(cb => fs.readFile(path, options, cb));

/**
 * readTextFile reads the contents of a file as a utf8 encoded text file.
 */
export const readTextFile = (path: Path): Future<string> =>
    <Future<string>>readFile(path, 'utf8');

/**
 * writeFile (safe) wrapper.
 */
export const writeFile = (path: Path, contents: Contents, options: string | object)
    : Future<Contents> =>
    fromCallback(cb => fs.writeFile(path, contents, options, cb));

/**
 * writeTextFile writes the passed contents to a a file location.
 */
export const writeTextFile = (path: Path, contents: string) =>
    writeFile(path, contents, 'utf8');

