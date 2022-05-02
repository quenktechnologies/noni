import * as fs from 'fs';

import { Stats } from 'fs';
import { join } from 'path';

import {
    Future,
    pure,
    parallel,
    fromCallback,
    raise,
    doFuture,
    attempt
} from '../control/monad/future';
import { JSONXObject } from '../data/jsonx/types';
import { Object } from '../data/json';
import { reduce, merge, empty } from '../data/record';

export { Stats };

/**
 * Path to a file.
 */
export type Path = string;

/**
 * TypedArray
 */
export type TypedArray
    = Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Uint8ClampedArray
    | Float32Array
    | Float64Array
    ;

/**
 * Contents of a file.
 */
export type Contents
    = string
    | DataView
    | TypedArray
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
 * statDir runs a `stat` on each file/directory found within a directory. 
 */
export const statDir = (path: Path): Future<StatsM> =>
    stat(path)
        .chain(s => (!s.isDirectory()) ?
            pure({}) :
            readdir(path)
                .chain(list =>
                    parallel(list.map(l => stat(`${path}/${l}`)))
                        .map(stats => stats.reduce((p, c, i) => {

                            p[list[i]] = c;

                            return p;

                        }, <StatsM>{}))));

/**
 * statDirAbs is like statDir but expands the names to be absolute.
 */
export const statDirAbs = (path: Path): Future<StatsM> =>
    statDir(path)
        .map(stats => reduce(stats, {}, (p: StatsM, c, k) => {

            p[`${path}/${k}`] = c;
            return p;

        }));

/**
 * statDirRec preforms a stat recursively for each file or directory found
 * at the given path.
 */
export const statDirRec = (path: Path): Future<StatsM> =>
    statDirAbs(path)
        .chain(stats =>
            parallel(reduce(stats, [], (p: Future<StatsM>[], c, k) =>
                c.isDirectory() ? p.concat(statDirRec(k)) : p))
                .map(results => results.reduce((p, c) => merge(p, c), stats)));

/**
 * exists (safe) wrapper.
 */
export const exists = (path: Path): Future<boolean> =>
    stat(path)
        .chain(() => pure(<boolean>true))
        .catch(() => pure(<boolean>false));

/**
 * isDirectory (safe) wrapper.
 */
export const isDirectory = (path: Path): Future<boolean> =>
    exists(path)
        .chain(yes => yes ?
            stat(path).map(s => <boolean>s.isDirectory()) :
            pure(<boolean>false));

/**
 * isFile (safe) wrapper.
 */
export const isFile = (path: Path): Future<boolean> =>
    exists(path)
        .chain(yes => yes ?
            stat(path).map(s => <boolean>s.isFile()) :
            pure(<boolean>false));

/**
 * readdir (safe) wrapper
 */
export const readdir = (path: Path): Future<string[]> =>
    fromCallback(cb => fs.readdir(path, cb));

export interface ReadFileOptions {
    encoding?: string | null | undefined,
    flag?: string | undefined,
    signal?: AbortSignal | undefined
}

/**
 * readFile (safe) wrapper
 */
export const readFile = (path: Path, options?: ReadFileOptions)
    : Future<Contents> => fromCallback(cb => fs.readFile(path,
        <object>options, cb));

/**
 * readTextFile reads the contents of a file as a utf8 encoded text file.
 */
export const readTextFile = (path: Path): Future<string> =>
    <Future<string>>readFile(path, { encoding: 'utf8' });

/**
 * readJSONFile reads the contents of a file as a JSON [[Object]].
 */
export const readJSONFile = (path: Path): Future<Object> =>
    doFuture(function*() {

        let txt = yield readTextFile(path);

        let json = yield attempt(() => JSON.parse(txt));

        return pure(<Object>json);

    });

/**
 * readJSONXFile provides the result of readJSONFile as a jsonx object.
 *
 * A future version of this may recognize dates etc.
 */
export const readJSONXFile = (path: Path): Future<JSONXObject> =>
    readJSONFile(path).map(obj => <JSONXObject><object>obj);

/**
 * list the files/directories found at a path.
 */
export const list = (path: Path): Future<string[]> =>
    statDir(path)
        .map(stats => Object.keys(stats));

/**
 * listAbs is like list except the paths are absolute.
 */
export const listAbs = (path: Path): Future<Path[]> =>
    statDirAbs(path)
        .map(stats => Object.keys(stats));

/**
 * listRec applies list recursively.
 */
export const listRec = (path: Path): Future<Path[]> =>
    statDirRec(path)
        .map(stats => Object.keys(stats));

/**
 * listDirs reads a directory path and returns a list of 
 * all that are directories.
 */
export const listDirs = (path: Path): Future<string[]> =>
    statDir(path)
        .map(stats => reduce(stats, [], (p: string[], c, k) =>
            c.isDirectory() ? p.concat(k) : p));

/**
 * listDirsAbs is like listDirs but provides the
 * absolute path of each directory.
 */
export const listDirsAbs = (path: Path): Future<Path[]> =>
    listDirs(path).map(n => n.map(expand(path)));

/**
 * listDirsRec recursively lists all the directories under a path.
 */
export const listDirsRec = (path: Path): Future<Path[]> =>
    statDirRec(path)
        .map(stats => reduce(stats, {}, (p: StatsM, c, k) => c.isDirectory() ?
            merge(p, { [k]: c }) :
            p))
        .map(stats => Object.keys(stats));

/**
 * listFiles reads a directory path and returns a list of all
 * that are files.
 */
export const listFiles = (path: Path): Future<string[]> =>
    statDir(path)
        .map(stats => reduce(stats, [], (p: string[], c, k) =>
            c.isFile() ? p.concat(k) : p));

/**
 * listFilesAbs is like listFiles but provides the absoulte path of each file.
 */
export const listFilesAbs = (path: Path): Future<Path[]> =>
    listFiles(path).map(n => n.map(expand(path)));

/**
 * listFilesRec recursively lists all the files under a path.
 */
export const listFilesRec = (path: Path): Future<Path[]> =>
    statDirRec(path)
        .map(stats => reduce(stats, {}, (p: StatsM, c, k) => c.isFile() ?
            merge(p, { [k]: c }) :
            p))
        .map(stats => Object.keys(stats));

const expand = (path: Path) => (name: string): Path =>
    join(path, name);

/**
 * writeFile (safe) wrapper.
 */
export const writeFile = (path: Path, contents: Contents,
    options: fs.WriteFileOptions = null): Future<void> =>
    fromCallback(cb => fs.writeFile(path, contents, options, cb));

/**
 * writeTextFile writes the passed contents to a a file location.
 */
export const writeTextFile = (path: Path, contents: string): Future<void> =>
    writeFile(path, contents, { encoding: 'utf8' });

/**
 * makeDir makes a directory at the specified path.
 *
 * By default will create parents if they do not exist.
 *
 * NOTE: On node 8.11.3 and prior the fs module does not support
 * parent directory creation so this function will fail if the parent
 * path does not exist.
 */
export const makeDir = (path: Path, options: object = {})
    : Future<void> =>
    fromCallback(cb => fs.mkdir(
        path,
        <any>merge({ recursive: true }, options), cb)
    );

/**
 * unlink a path from the file system.
 *
 * Does not matter whether it is a file or directory.
 * Use with caution!
 */
export const unlink = (path: Path): Future<void> =>
    isDirectory(path)
        .chain(yes => yes ?
            removeDir(path) :
            removeFile(path));

export { unlink as remove }

/**
 * removeFile removes a file and only a file.
 *
 * Will fail if the path is not a file.
 */
export const removeFile = (path: Path): Future<void> =>
    exists(path)
        .chain(yes => yes ?
            fromCallback(cb => fs.unlink(path, cb)) :
            pure((() => { })()));

/**
 * removeDir removes a directory and only a directory.
 *
 * Will fail if the path is not a directory.
 */
export const removeDir = (path: Path): Future<void> =>
    exists(path)
        .chain(yes => yes ?
            listAbs(path)
                .chain(l => parallel(l.map(unlink)))
                .chain(() => fromCallback(cb => fs.rmdir(path, cb))) :
            pure((() => { })()));

/**
 * copy the contents of the src file or directory to a new destination.
 *
 * If dest already exists, this operation will fail.
 */
export const copy = (src: Path, dest: Path): Future<number> =>
    doFuture(function*() {

        if (yield exists(dest))
            return raise(new Error(
                `io/file#copy: Path "${dest}" already exists!`));

        if (yield isFile(src)) {

            let contents = yield readFile(src);

            yield writeFile(dest, contents);

            return pure(1);

        } else {

            let dirs = [src];

            let counter = 0;

            while (!empty(dirs)) {

                let dir = <string>dirs.shift();

                let paths = yield listAbs(dir);

                let destDir = dir.replace(src, dest);

                yield makeDir(destDir);

                for (let path of paths) {

                    let destPath = path.replace(src, dest);

                    if (yield isDirectory(path)) {

                        yield makeDir(destPath);

                        dirs.push(path);

                    } else {

                        let contents = yield readFile(path);

                        yield writeFile(destPath, contents);

                        counter++;

                    }

                }

            }

            return pure(counter);

        }

    })
