/// <reference types="node" />
import * as fs from 'fs';
import { Stats } from 'fs';
import { Future } from '../control/monad/future';
export { Stats };
/**
 * Path to a file.
 */
export declare type Path = string;
/**
 * Contents of a file.
 */
export declare type Contents = string | DataView | object;
/**
 * StatsM is a map of Stats where the key is the filename
 * and the value the Stats.
 */
export interface StatsM {
    [key: string]: Stats;
}
/**
 * stat (safe) wrapper.
 */
export declare const stat: (path: string) => Future<fs.Stats>;
/**
 * statDir runs a `stat` on each file/directory found within a directory.
 */
export declare const statDir: (path: string) => Future<StatsM>;
/**
 * exists (safe) wrapper.
 */
export declare const exists: (path: string) => Future<boolean>;
/**
 * isDirectory (safe) wrapper.
 */
export declare const isDirectory: (path: string) => Future<boolean>;
/**
 * isFile (safe) wrapper.
 */
export declare const isFile: (path: string) => Future<boolean>;
/**
 * readdir (safe) wrapper
 */
export declare const readdir: (path: string) => Future<string[]>;
/**
 * readFile (safe) wrapper
 */
export declare const readFile: (path: string, options: string | object) => Future<Contents>;
/**
 * readTextFile reads the contents of a file as a utf8 encoded text file.
 */
export declare const readTextFile: (path: string) => Future<string>;
/**
 * listDirs reads a directory path and returns a list of
 * all that are directories.
 */
export declare const listDirs: (path: string) => Future<string[]>;
/**
 * listFiles reads a directory path and returns a list of all
 * that are files.
 */
export declare const listFiles: (path: string) => Future<string[]>;
/**
 * writeFile (safe) wrapper.
 */
export declare const writeFile: (path: string, contents: Contents, options: string | object) => Future<void>;
/**
 * writeTextFile writes the passed contents to a a file location.
 */
export declare const writeTextFile: (path: string, contents: string) => Future<void>;
