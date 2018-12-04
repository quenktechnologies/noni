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
 * statDirAbs is like statDir but expands the names to be absolute.
 */
export declare const statDirAbs: (path: string) => Future<StatsM>;
/**
 * statDirRec preforms a stat recursively for each file or directory found
 * at the given path.
 */
export declare const statDirRec: (path: string) => Future<StatsM>;
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
 * list the files/directories found at a path.
 */
export declare const list: (path: string) => Future<string[]>;
/**
 * listAbs is like list except the paths are absolute.
 */
export declare const listAbs: (path: string) => Future<string[]>;
/**
 * listRec applies list recursively.
 */
export declare const listRec: (path: string) => Future<string[]>;
/**
 * listDirs reads a directory path and returns a list of
 * all that are directories.
 */
export declare const listDirs: (path: string) => Future<string[]>;
/**
 * listDirsAbs is like listDirs but provides the
 * absolute path of each directory.
 */
export declare const listDirsAbs: (path: string) => Future<string[]>;
/**
 * listDirsRec recursively lists all the directories under a path.
 */
export declare const listDirsRec: (path: string) => Future<string[]>;
/**
 * listFiles reads a directory path and returns a list of all
 * that are files.
 */
export declare const listFiles: (path: string) => Future<string[]>;
/**
 * listFilesAbs is like listFiles but provides the absoulte path of each file.
 */
export declare const listFilesAbs: (path: string) => Future<string[]>;
/**
 * listFilesRec recursively lists all the files under a path.
 */
export declare const listFilesRec: (path: string) => Future<string[]>;
/**
 * writeFile (safe) wrapper.
 */
export declare const writeFile: (path: string, contents: Contents, options: string | object) => Future<void>;
/**
 * writeTextFile writes the passed contents to a a file location.
 */
export declare const writeTextFile: (path: string, contents: string) => Future<void>;
/**
 * unlink a path from the file system.
 */
export declare const unlink: (path: string) => Future<void>;
