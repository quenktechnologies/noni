import * as fs from 'fs';
import { Stats } from 'fs';
import { join } from 'path';
import { Future, pure, parallel, fromCallback } from '../control/monad/future';
import { reduce } from '../data/record';

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
    | DataView
    | object
    ;

/**
 * StatsM is a map of Stats where the key is the filename
 * and the value the Stats.
 */
export interface StatsM {

    [key: string]: Stats

}

/**
 * stat (safe) wrapper.
 */
export const stat = (path: Path): Future<fs.Stats> =>
    fromCallback(cb => fs.stat(path, cb));

/**
 * exists (safe) wrapper.
 */
export const exists = (path: Path): Future<boolean> =>
    stat(path)
        .chain(() => pure(true))
        .catch(() => pure(false));

/**
 * isDirectory (safe) wrapper.
 */
export const isDirectory = (path: Path): Future<boolean> =>
    exists(path)
        .chain(yes => yes ?
            stat(path).map(s => s.isDirectory()) :
            pure(false));

/**
 * isFile (safe) wrapper.
 */
export const isFile = (path: Path): Future<boolean> =>
    exists(path)
        .chain(yes => yes ?
            stat(path).map(s => s.isFile()) :
            pure(false));

/**
 * readdir (safe) wrapper
 */
export const readdir = (path: Path): Future<string[]> =>
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
 * list runs a `stat` on each file/directory found within a directory. 
 */
export const list = (path: Path): Future<StatsM> =>
    readdir(path)
        .chain(list =>
            parallel(list.map(l => stat(`${path}/${l}`)))
                .map(stats => stats.reduce((p, c, i) => {

                    p[list[i]] = c;

                    return p;

                }, <StatsM>{})));

/**
 * listD reads a directory path and returns a list of 
 * all that are directories.
 */
export const listD = (path: Path): Future<string[]> =>
    list(path)
        .map(stats => reduce(stats, [], (p: string[], c, k) =>
            c.isDirectory() ? p.concat(k) : p));

/**
 * listDA is like listD but provides the absolute path of each directory.
 */
export const listDA = (path: Path): Future<Path[]> =>
    listD(path).map(n => n.map(expand(path)));

/**
 * listF reads a directory path and returns a list of all
 * that are files.
 */
export const listF = (path: Path): Future<string[]> =>
    list(path)
        .map(stats => reduce(stats, [], (p: string[], c, k) =>
            c.isFile() ? p.concat(k) : p));

/**
 * listFA is like listF but provides the absoulte path of each file.
 */
export const listFA = (path: Path): Future<string[]> =>
    listF(path).map(n => n.map(expand(path)));

const expand = (path: Path) => (name: string): Path =>
    join(path, name);

/**
 * writeFile (safe) wrapper.
 */
export const writeFile = (path: Path, contents: Contents, options: string | object)
    : Future<void> =>
    fromCallback(cb => fs.writeFile(path, contents, options, cb));

/**
 * writeTextFile writes the passed contents to a a file location.
 */
export const writeTextFile = (path: Path, contents: string): Future<void> =>
    writeFile(path, contents, 'utf8');
