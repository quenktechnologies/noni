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
 * TypedArray
 */
export declare type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
/**
 * Contents of a file.
 */
export declare type Contents = string | DataView | TypedArray;
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
export declare const stat: (path: Path) => Future<fs.Stats>;
/**
 * statDir runs a `stat` on each file/directory found within a directory.
 */
export declare const statDir: (path: Path) => Future<StatsM>;
/**
 * statDirAbs is like statDir but expands the names to be absolute.
 */
export declare const statDirAbs: (path: Path) => Future<StatsM>;
/**
 * statDirRec preforms a stat recursively for each file or directory found
 * at the given path.
 */
export declare const statDirRec: (path: Path) => Future<StatsM>;
/**
 * exists (safe) wrapper.
 */
export declare const exists: (path: Path) => Future<boolean>;
/**
 * isDirectory (safe) wrapper.
 */
export declare const isDirectory: (path: Path) => Future<boolean>;
/**
 * isFile (safe) wrapper.
 */
export declare const isFile: (path: Path) => Future<boolean>;
/**
 * readdir (safe) wrapper
 */
export declare const readdir: (path: Path) => Future<string[]>;
export interface ReadFileOptions {
    encoding?: string | null | undefined;
    flag?: string | undefined;
    signal?: AbortSignal | undefined;
}
/**
 * readFile (safe) wrapper
 */
export declare const readFile: (path: Path, options?: ReadFileOptions | undefined) => Future<Contents>;
/**
 * readTextFile reads the contents of a file as a utf8 encoded text file.
 */
export declare const readTextFile: (path: Path) => Future<string>;
/**
 * list the files/directories found at a path.
 */
export declare const list: (path: Path) => Future<string[]>;
/**
 * listAbs is like list except the paths are absolute.
 */
export declare const listAbs: (path: Path) => Future<Path[]>;
/**
 * listRec applies list recursively.
 */
export declare const listRec: (path: Path) => Future<Path[]>;
/**
 * listDirs reads a directory path and returns a list of
 * all that are directories.
 */
export declare const listDirs: (path: Path) => Future<string[]>;
/**
 * listDirsAbs is like listDirs but provides the
 * absolute path of each directory.
 */
export declare const listDirsAbs: (path: Path) => Future<Path[]>;
/**
 * listDirsRec recursively lists all the directories under a path.
 */
export declare const listDirsRec: (path: Path) => Future<Path[]>;
/**
 * listFiles reads a directory path and returns a list of all
 * that are files.
 */
export declare const listFiles: (path: Path) => Future<string[]>;
/**
 * listFilesAbs is like listFiles but provides the absoulte path of each file.
 */
export declare const listFilesAbs: (path: Path) => Future<Path[]>;
/**
 * listFilesRec recursively lists all the files under a path.
 */
export declare const listFilesRec: (path: Path) => Future<Path[]>;
/**
 * writeFile (safe) wrapper.
 */
export declare const writeFile: (path: Path, contents: Contents, options?: fs.WriteFileOptions) => Future<void>;
/**
 * writeTextFile writes the passed contents to a a file location.
 */
export declare const writeTextFile: (path: Path, contents: string) => Future<void>;
/**
 * makeDir makes a directory at the specified path.
 *
 * By default will create parents if they do not exist.
 *
 * NOTE: On node 8.11.3 and prior the fs module does not support
 * parent directory creation so this function will fail if the parent
 * path does not exist.
 */
export declare const makeDir: (path: Path, options?: object) => Future<void>;
/**
 * unlink a path from the file system.
 *
 * Does not matter whether it is a file or directory.
 * Use with caution!
 */
export declare const unlink: (path: Path) => Future<void>;
export { unlink as remove };
/**
 * removeFile removes a file and only a file.
 *
 * Will fail if the path is not a file.
 */
export declare const removeFile: (path: Path) => Future<void>;
/**
 * removeDir removes a directory and only a directory.
 *
 * Will fail if the path is not a directory.
 */
export declare const removeDir: (path: Path) => Future<void>;
/**
 * copy the contents of the src file or directory to a new destination.
 *
 * If dest already exists, this operation will fail.
 */
export declare const copy: (src: Path, dest: Path) => Future<number>;
