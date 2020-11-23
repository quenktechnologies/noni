"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDir = exports.removeFile = exports.unlink = exports.makeDir = exports.writeTextFile = exports.writeFile = exports.listFilesRec = exports.listFilesAbs = exports.listFiles = exports.listDirsRec = exports.listDirsAbs = exports.listDirs = exports.listRec = exports.listAbs = exports.list = exports.readTextFile = exports.readFile = exports.readdir = exports.isFile = exports.isDirectory = exports.exists = exports.statDirRec = exports.statDirAbs = exports.statDir = exports.stat = exports.Stats = void 0;
var fs = require("fs");
var fs_1 = require("fs");
Object.defineProperty(exports, "Stats", { enumerable: true, get: function () { return fs_1.Stats; } });
var path_1 = require("path");
var future_1 = require("../control/monad/future");
var record_1 = require("../data/record");
/**
 * stat (safe) wrapper.
 */
var stat = function (path) {
    return future_1.fromCallback(function (cb) { return fs.stat(path, cb); });
};
exports.stat = stat;
/**
 * statDir runs a `stat` on each file/directory found within a directory.
 */
var statDir = function (path) {
    return exports.stat(path)
        .chain(function (s) { return (!s.isDirectory()) ?
        future_1.pure({}) :
        exports.readdir(path)
            .chain(function (list) {
            return future_1.parallel(list.map(function (l) { return exports.stat(path + "/" + l); }))
                .map(function (stats) { return stats.reduce(function (p, c, i) {
                p[list[i]] = c;
                return p;
            }, {}); });
        }); });
};
exports.statDir = statDir;
/**
 * statDirAbs is like statDir but expands the names to be absolute.
 */
var statDirAbs = function (path) {
    return exports.statDir(path)
        .map(function (stats) { return record_1.reduce(stats, {}, function (p, c, k) {
        p[path + "/" + k] = c;
        return p;
    }); });
};
exports.statDirAbs = statDirAbs;
/**
 * statDirRec preforms a stat recursively for each file or directory found
 * at the given path.
 */
var statDirRec = function (path) {
    return exports.statDirAbs(path)
        .chain(function (stats) {
        return future_1.parallel(record_1.reduce(stats, [], function (p, c, k) {
            return c.isDirectory() ? p.concat(exports.statDirRec(k)) : p;
        }))
            .map(function (results) { return results.reduce(function (p, c) { return record_1.merge(p, c); }, stats); });
    });
};
exports.statDirRec = statDirRec;
/**
 * exists (safe) wrapper.
 */
var exists = function (path) {
    return exports.stat(path)
        .chain(function () { return future_1.pure(true); })
        .catch(function () { return future_1.pure(false); });
};
exports.exists = exists;
/**
 * isDirectory (safe) wrapper.
 */
var isDirectory = function (path) {
    return exports.exists(path)
        .chain(function (yes) { return yes ?
        exports.stat(path).map(function (s) { return s.isDirectory(); }) :
        future_1.pure(false); });
};
exports.isDirectory = isDirectory;
/**
 * isFile (safe) wrapper.
 */
var isFile = function (path) {
    return exports.exists(path)
        .chain(function (yes) { return yes ?
        exports.stat(path).map(function (s) { return s.isFile(); }) :
        future_1.pure(false); });
};
exports.isFile = isFile;
/**
 * readdir (safe) wrapper
 */
var readdir = function (path) {
    return future_1.fromCallback(function (cb) { return fs.readdir(path, cb); });
};
exports.readdir = readdir;
/**
 * readFile (safe) wrapper
 */
var readFile = function (path, options) {
    return future_1.fromCallback(function (cb) { return fs.readFile(path, options, cb); });
};
exports.readFile = readFile;
/**
 * readTextFile reads the contents of a file as a utf8 encoded text file.
 */
var readTextFile = function (path) {
    return exports.readFile(path, { encoding: 'utf8' });
};
exports.readTextFile = readTextFile;
/**
 * list the files/directories found at a path.
 */
var list = function (path) {
    return exports.statDir(path)
        .map(function (stats) { return Object.keys(stats); });
};
exports.list = list;
/**
 * listAbs is like list except the paths are absolute.
 */
var listAbs = function (path) {
    return exports.statDirAbs(path)
        .map(function (stats) { return Object.keys(stats); });
};
exports.listAbs = listAbs;
/**
 * listRec applies list recursively.
 */
var listRec = function (path) {
    return exports.statDirRec(path)
        .map(function (stats) { return Object.keys(stats); });
};
exports.listRec = listRec;
/**
 * listDirs reads a directory path and returns a list of
 * all that are directories.
 */
var listDirs = function (path) {
    return exports.statDir(path)
        .map(function (stats) { return record_1.reduce(stats, [], function (p, c, k) {
        return c.isDirectory() ? p.concat(k) : p;
    }); });
};
exports.listDirs = listDirs;
/**
 * listDirsAbs is like listDirs but provides the
 * absolute path of each directory.
 */
var listDirsAbs = function (path) {
    return exports.listDirs(path).map(function (n) { return n.map(expand(path)); });
};
exports.listDirsAbs = listDirsAbs;
/**
 * listDirsRec recursively lists all the directories under a path.
 */
var listDirsRec = function (path) {
    return exports.statDirRec(path)
        .map(function (stats) { return record_1.reduce(stats, {}, function (p, c, k) {
        var _a;
        return c.isDirectory() ?
            record_1.merge(p, (_a = {}, _a[k] = c, _a)) :
            p;
    }); })
        .map(function (stats) { return Object.keys(stats); });
};
exports.listDirsRec = listDirsRec;
/**
 * listFiles reads a directory path and returns a list of all
 * that are files.
 */
var listFiles = function (path) {
    return exports.statDir(path)
        .map(function (stats) { return record_1.reduce(stats, [], function (p, c, k) {
        return c.isFile() ? p.concat(k) : p;
    }); });
};
exports.listFiles = listFiles;
/**
 * listFilesAbs is like listFiles but provides the absoulte path of each file.
 */
var listFilesAbs = function (path) {
    return exports.listFiles(path).map(function (n) { return n.map(expand(path)); });
};
exports.listFilesAbs = listFilesAbs;
/**
 * listFilesRec recursively lists all the files under a path.
 */
var listFilesRec = function (path) {
    return exports.statDirRec(path)
        .map(function (stats) { return record_1.reduce(stats, {}, function (p, c, k) {
        var _a;
        return c.isFile() ?
            record_1.merge(p, (_a = {}, _a[k] = c, _a)) :
            p;
    }); })
        .map(function (stats) { return Object.keys(stats); });
};
exports.listFilesRec = listFilesRec;
var expand = function (path) { return function (name) {
    return path_1.join(path, name);
}; };
/**
 * writeFile (safe) wrapper.
 */
var writeFile = function (path, contents, options) {
    return future_1.fromCallback(function (cb) { return fs.writeFile(path, contents, options, cb); });
};
exports.writeFile = writeFile;
/**
 * writeTextFile writes the passed contents to a a file location.
 */
var writeTextFile = function (path, contents) {
    return exports.writeFile(path, contents, { encoding: 'utf8' });
};
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
var makeDir = function (path, options) {
    if (options === void 0) { options = {}; }
    return future_1.fromCallback(function (cb) { return fs.mkdir(path, record_1.merge({ recursive: true }, options), cb); });
};
exports.makeDir = makeDir;
/**
 * unlink a path from the file system.
 *
 * Does not matter whether it is a file or directory.
 * Use with caution!
 */
var unlink = function (path) {
    return exports.isDirectory(path)
        .chain(function (yes) { return yes ?
        exports.removeDir(path) :
        exports.removeFile(path); });
};
exports.unlink = unlink;
/**
 * removeFile removes a file and only a file.
 *
 * Will fail if the path is not a file.
 */
var removeFile = function (path) {
    return exports.exists(path)
        .chain(function (yes) { return yes ?
        future_1.fromCallback(function (cb) { return fs.unlink(path, cb); }) :
        future_1.pure((function () { })()); });
};
exports.removeFile = removeFile;
/**
 * removeDir removes a directory and only a directory.
 *
 * Will fail if the path is not a directory.
 */
var removeDir = function (path) {
    return exports.exists(path)
        .chain(function (yes) { return yes ?
        exports.listAbs(path)
            .chain(function (l) { return future_1.parallel(l.map(exports.unlink)); })
            .chain(function () { return future_1.fromCallback(function (cb) { return fs.rmdir(path, cb); }); }) :
        future_1.pure((function () { })()); });
};
exports.removeDir = removeDir;
//# sourceMappingURL=file.js.map