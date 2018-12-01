/// <reference types="node" />
import * as fs from 'fs';
import { Future } from '../control/monad/future';
import { Maybe } from '../data/maybe';
import { Either } from '../data/either';
declare const Stats: typeof fs.Stats;
export { Stats };
/**
 * Path to a file.
 */
export declare type Path = string;
/**
 * Contents of a file.
 */
export declare type Contents = string | Buffer | NodeJS.TypedArray | DataView;
/**
 * stat (safe) wrapper.
 */
export declare const stat: (path: string) => Future<fs.Stats>;
/**
 * exists (safe) wrapper.
 */
export declare const exists: (path: string) => Future<Maybe<string>>;
/**
 * isDirectory (safe) wrapper.
 */
export declare const isDirectory: (path: string) => Future<Either<boolean, boolean>>;
/**
 * isFile (safe) wrapper.
 */
export declare const isFile: (path: string) => Future<Either<boolean, boolean>>;
/**
 * readdir (safe) wrapper
 */
export declare const readdir: (path: string) => Future<{}>;
/**
 * readFile (safe) wrapper
 */
export declare const readFile: (path: string, options: string | object) => Future<Contents>;
/**
 * readTextFile reads the contents of a file as a utf8 encoded text file.
 */
export declare const readTextFile: (path: string) => Future<string>;
/**
 * writeFile (safe) wrapper.
 */
export declare const writeFile: (path: string, contents: Contents, options: string | object) => Future<Contents>;
/**
 * writeTextFile writes the passed contents to a a file location.
 */
export declare const writeTextFile: (path: string, contents: string) => Future<Contents>;
