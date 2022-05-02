"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = exports.removeDir = exports.removeFile = exports.remove = exports.unlink = exports.makeDir = exports.writeTextFile = exports.writeFile = exports.listFilesRec = exports.listFilesAbs = exports.listFiles = exports.listDirsRec = exports.listDirsAbs = exports.listDirs = exports.listRec = exports.listAbs = exports.list = exports.readJSONXFile = exports.readJSONFile = exports.readTextFile = exports.readFile = exports.readdir = exports.isFile = exports.isDirectory = exports.exists = exports.statDirRec = exports.statDirAbs = exports.statDir = exports.stat = exports.Stats = void 0;
const fs = require("fs");
const fs_1 = require("fs");
Object.defineProperty(exports, "Stats", { enumerable: true, get: function () { return fs_1.Stats; } });
const path_1 = require("path");
const future_1 = require("../control/monad/future");
const record_1 = require("../data/record");
/**
 * stat (safe) wrapper.
 */
const stat = (path) => (0, future_1.fromCallback)(cb => fs.stat(path, cb));
exports.stat = stat;
/**
 * statDir runs a `stat` on each file/directory found within a directory.
 */
const statDir = (path) => (0, exports.stat)(path)
    .chain(s => (!s.isDirectory()) ?
    (0, future_1.pure)({}) :
    (0, exports.readdir)(path)
        .chain(list => (0, future_1.parallel)(list.map(l => (0, exports.stat)(`${path}/${l}`)))
        .map(stats => stats.reduce((p, c, i) => {
        p[list[i]] = c;
        return p;
    }, {}))));
exports.statDir = statDir;
/**
 * statDirAbs is like statDir but expands the names to be absolute.
 */
const statDirAbs = (path) => (0, exports.statDir)(path)
    .map(stats => (0, record_1.reduce)(stats, {}, (p, c, k) => {
    p[`${path}/${k}`] = c;
    return p;
}));
exports.statDirAbs = statDirAbs;
/**
 * statDirRec preforms a stat recursively for each file or directory found
 * at the given path.
 */
const statDirRec = (path) => (0, exports.statDirAbs)(path)
    .chain(stats => (0, future_1.parallel)((0, record_1.reduce)(stats, [], (p, c, k) => c.isDirectory() ? p.concat((0, exports.statDirRec)(k)) : p))
    .map(results => results.reduce((p, c) => (0, record_1.merge)(p, c), stats)));
exports.statDirRec = statDirRec;
/**
 * exists (safe) wrapper.
 */
const exists = (path) => (0, exports.stat)(path)
    .chain(() => (0, future_1.pure)(true))
    .catch(() => (0, future_1.pure)(false));
exports.exists = exists;
/**
 * isDirectory (safe) wrapper.
 */
const isDirectory = (path) => (0, exports.exists)(path)
    .chain(yes => yes ?
    (0, exports.stat)(path).map(s => s.isDirectory()) :
    (0, future_1.pure)(false));
exports.isDirectory = isDirectory;
/**
 * isFile (safe) wrapper.
 */
const isFile = (path) => (0, exports.exists)(path)
    .chain(yes => yes ?
    (0, exports.stat)(path).map(s => s.isFile()) :
    (0, future_1.pure)(false));
exports.isFile = isFile;
/**
 * readdir (safe) wrapper
 */
const readdir = (path) => (0, future_1.fromCallback)(cb => fs.readdir(path, cb));
exports.readdir = readdir;
/**
 * readFile (safe) wrapper
 */
const readFile = (path, options) => (0, future_1.fromCallback)(cb => fs.readFile(path, options, cb));
exports.readFile = readFile;
/**
 * readTextFile reads the contents of a file as a utf8 encoded text file.
 */
const readTextFile = (path) => (0, exports.readFile)(path, { encoding: 'utf8' });
exports.readTextFile = readTextFile;
/**
 * readJSONFile reads the contents of a file as a JSON [[Object]].
 */
const readJSONFile = (path) => (0, future_1.doFuture)(function* () {
    let txt = yield (0, exports.readTextFile)(path);
    let json = yield (0, future_1.attempt)(() => JSON.parse(txt));
    return (0, future_1.pure)(json);
});
exports.readJSONFile = readJSONFile;
/**
 * readJSONXFile provides the result of readJSONFile as a jsonx object.
 *
 * A future version of this may recognize dates etc.
 */
const readJSONXFile = (path) => (0, exports.readJSONFile)(path).map(obj => obj);
exports.readJSONXFile = readJSONXFile;
/**
 * list the files/directories found at a path.
 */
const list = (path) => (0, exports.statDir)(path)
    .map(stats => Object.keys(stats));
exports.list = list;
/**
 * listAbs is like list except the paths are absolute.
 */
const listAbs = (path) => (0, exports.statDirAbs)(path)
    .map(stats => Object.keys(stats));
exports.listAbs = listAbs;
/**
 * listRec applies list recursively.
 */
const listRec = (path) => (0, exports.statDirRec)(path)
    .map(stats => Object.keys(stats));
exports.listRec = listRec;
/**
 * listDirs reads a directory path and returns a list of
 * all that are directories.
 */
const listDirs = (path) => (0, exports.statDir)(path)
    .map(stats => (0, record_1.reduce)(stats, [], (p, c, k) => c.isDirectory() ? p.concat(k) : p));
exports.listDirs = listDirs;
/**
 * listDirsAbs is like listDirs but provides the
 * absolute path of each directory.
 */
const listDirsAbs = (path) => (0, exports.listDirs)(path).map(n => n.map(expand(path)));
exports.listDirsAbs = listDirsAbs;
/**
 * listDirsRec recursively lists all the directories under a path.
 */
const listDirsRec = (path) => (0, exports.statDirRec)(path)
    .map(stats => (0, record_1.reduce)(stats, {}, (p, c, k) => c.isDirectory() ?
    (0, record_1.merge)(p, { [k]: c }) :
    p))
    .map(stats => Object.keys(stats));
exports.listDirsRec = listDirsRec;
/**
 * listFiles reads a directory path and returns a list of all
 * that are files.
 */
const listFiles = (path) => (0, exports.statDir)(path)
    .map(stats => (0, record_1.reduce)(stats, [], (p, c, k) => c.isFile() ? p.concat(k) : p));
exports.listFiles = listFiles;
/**
 * listFilesAbs is like listFiles but provides the absoulte path of each file.
 */
const listFilesAbs = (path) => (0, exports.listFiles)(path).map(n => n.map(expand(path)));
exports.listFilesAbs = listFilesAbs;
/**
 * listFilesRec recursively lists all the files under a path.
 */
const listFilesRec = (path) => (0, exports.statDirRec)(path)
    .map(stats => (0, record_1.reduce)(stats, {}, (p, c, k) => c.isFile() ?
    (0, record_1.merge)(p, { [k]: c }) :
    p))
    .map(stats => Object.keys(stats));
exports.listFilesRec = listFilesRec;
const expand = (path) => (name) => (0, path_1.join)(path, name);
/**
 * writeFile (safe) wrapper.
 */
const writeFile = (path, contents, options = null) => (0, future_1.fromCallback)(cb => fs.writeFile(path, contents, options, cb));
exports.writeFile = writeFile;
/**
 * writeTextFile writes the passed contents to a a file location.
 */
const writeTextFile = (path, contents) => (0, exports.writeFile)(path, contents, { encoding: 'utf8' });
exports.writeTextFile = writeTextFile;
/**
 * makeDir makes a directory at the specified path.
 *
 * By default will create parents if they do not exist.
 *
 * NOTE: On node 8.11.3 and prior the fs module does not support
 * parent directory creation so this function will fail if the parent
 * path does not exist.
 */
const makeDir = (path, options = {}) => (0, future_1.fromCallback)(cb => fs.mkdir(path, (0, record_1.merge)({ recursive: true }, options), cb));
exports.makeDir = makeDir;
/**
 * unlink a path from the file system.
 *
 * Does not matter whether it is a file or directory.
 * Use with caution!
 */
const unlink = (path) => (0, exports.isDirectory)(path)
    .chain(yes => yes ?
    (0, exports.removeDir)(path) :
    (0, exports.removeFile)(path));
exports.unlink = unlink;
exports.remove = exports.unlink;
/**
 * removeFile removes a file and only a file.
 *
 * Will fail if the path is not a file.
 */
const removeFile = (path) => (0, exports.exists)(path)
    .chain(yes => yes ?
    (0, future_1.fromCallback)(cb => fs.unlink(path, cb)) :
    (0, future_1.pure)((() => { })()));
exports.removeFile = removeFile;
/**
 * removeDir removes a directory and only a directory.
 *
 * Will fail if the path is not a directory.
 */
const removeDir = (path) => (0, exports.exists)(path)
    .chain(yes => yes ?
    (0, exports.listAbs)(path)
        .chain(l => (0, future_1.parallel)(l.map(exports.unlink)))
        .chain(() => (0, future_1.fromCallback)(cb => fs.rmdir(path, cb))) :
    (0, future_1.pure)((() => { })()));
exports.removeDir = removeDir;
/**
 * copy the contents of the src file or directory to a new destination.
 *
 * If dest already exists, this operation will fail.
 */
const copy = (src, dest) => (0, future_1.doFuture)(function* () {
    if (yield (0, exports.exists)(dest))
        return (0, future_1.raise)(new Error(`io/file#copy: Path "${dest}" already exists!`));
    if (yield (0, exports.isFile)(src)) {
        let contents = yield (0, exports.readFile)(src);
        yield (0, exports.writeFile)(dest, contents);
        return (0, future_1.pure)(1);
    }
    else {
        let dirs = [src];
        let counter = 0;
        while (!(0, record_1.empty)(dirs)) {
            let dir = dirs.shift();
            let paths = yield (0, exports.listAbs)(dir);
            let destDir = dir.replace(src, dest);
            yield (0, exports.makeDir)(destDir);
            for (let path of paths) {
                let destPath = path.replace(src, dest);
                if (yield (0, exports.isDirectory)(path)) {
                    yield (0, exports.makeDir)(destPath);
                    dirs.push(path);
                }
                else {
                    let contents = yield (0, exports.readFile)(path);
                    yield (0, exports.writeFile)(destPath, contents);
                    counter++;
                }
            }
        }
        return (0, future_1.pure)(counter);
    }
});
exports.copy = copy;
//# sourceMappingURL=file.js.map