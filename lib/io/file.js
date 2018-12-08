"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var fs_1 = require("fs");
exports.Stats = fs_1.Stats;
var path_1 = require("path");
var future_1 = require("../control/monad/future");
var record_1 = require("../data/record");
/**
 * stat (safe) wrapper.
 */
exports.stat = function (path) {
    return future_1.fromCallback(function (cb) { return fs.stat(path, cb); });
};
/**
 * statDir runs a `stat` on each file/directory found within a directory.
 */
exports.statDir = function (path) {
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
/**
 * statDirAbs is like statDir but expands the names to be absolute.
 */
exports.statDirAbs = function (path) {
    return exports.statDir(path)
        .map(function (stats) { return record_1.reduce(stats, {}, function (p, c, k) {
        p[path + "/" + k] = c;
        return p;
    }); });
};
/**
 * statDirRec preforms a stat recursively for each file or directory found
 * at the given path.
 */
exports.statDirRec = function (path) {
    return exports.statDirAbs(path)
        .chain(function (stats) { return future_1.parallel(record_1.reduce(stats, [], function (p, c, k) {
        return c.isDirectory() ? p.concat(exports.statDirAbs(k)) : p;
    }))
        .map(function (results) { return results.reduce(function (p, c) { return record_1.merge(p, c); }, stats); }); });
};
/**
 * exists (safe) wrapper.
 */
exports.exists = function (path) {
    return exports.stat(path)
        .chain(function () { return future_1.pure(true); })
        .catch(function () { return future_1.pure(false); });
};
/**
 * isDirectory (safe) wrapper.
 */
exports.isDirectory = function (path) {
    return exports.exists(path)
        .chain(function (yes) { return yes ?
        exports.stat(path).map(function (s) { return s.isDirectory(); }) :
        future_1.pure(false); });
};
/**
 * isFile (safe) wrapper.
 */
exports.isFile = function (path) {
    return exports.exists(path)
        .chain(function (yes) { return yes ?
        exports.stat(path).map(function (s) { return s.isFile(); }) :
        future_1.pure(false); });
};
/**
 * readdir (safe) wrapper
 */
exports.readdir = function (path) {
    return future_1.fromCallback(function (cb) { return fs.readdir(path, cb); });
};
/**
 * readFile (safe) wrapper
 */
exports.readFile = function (path, options) {
    return future_1.fromCallback(function (cb) { return fs.readFile(path, options, cb); });
};
/**
 * readTextFile reads the contents of a file as a utf8 encoded text file.
 */
exports.readTextFile = function (path) {
    return exports.readFile(path, { encoding: 'utf8' });
};
/**
 * list the files/directories found at a path.
 */
exports.list = function (path) {
    return exports.statDir(path)
        .map(function (stats) { return Object.keys(stats); });
};
/**
 * listAbs is like list except the paths are absolute.
 */
exports.listAbs = function (path) {
    return exports.statDirAbs(path)
        .map(function (stats) { return Object.keys(stats); });
};
/**
 * listRec applies list recursively.
 */
exports.listRec = function (path) {
    return exports.statDirRec(path)
        .map(function (stats) { return Object.keys(stats); });
};
/**
 * listDirs reads a directory path and returns a list of
 * all that are directories.
 */
exports.listDirs = function (path) {
    return exports.statDir(path)
        .map(function (stats) { return record_1.reduce(stats, [], function (p, c, k) {
        return c.isDirectory() ? p.concat(k) : p;
    }); });
};
/**
 * listDirsAbs is like listDirs but provides the
 * absolute path of each directory.
 */
exports.listDirsAbs = function (path) {
    return exports.listDirs(path).map(function (n) { return n.map(expand(path)); });
};
/**
 * listDirsRec recursively lists all the directories under a path.
 */
exports.listDirsRec = function (path) {
    return exports.statDirRec(path)
        .map(function (stats) { return record_1.reduce(stats, {}, function (p, c, k) {
        var _a;
        return c.isDirectory() ?
            record_1.merge(p, (_a = {}, _a[k] = c, _a)) :
            p;
    }); })
        .map(function (stats) { return Object.keys(stats); });
};
/**
 * listFiles reads a directory path and returns a list of all
 * that are files.
 */
exports.listFiles = function (path) {
    return exports.statDir(path)
        .map(function (stats) { return record_1.reduce(stats, [], function (p, c, k) {
        return c.isFile() ? p.concat(k) : p;
    }); });
};
/**
 * listFilesAbs is like listFiles but provides the absoulte path of each file.
 */
exports.listFilesAbs = function (path) {
    return exports.listFiles(path).map(function (n) { return n.map(expand(path)); });
};
/**
 * listFilesRec recursively lists all the files under a path.
 */
exports.listFilesRec = function (path) {
    return exports.statDirRec(path)
        .map(function (stats) { return record_1.reduce(stats, {}, function (p, c, k) {
        var _a;
        return c.isFile() ?
            record_1.merge(p, (_a = {}, _a[k] = c, _a)) :
            p;
    }); })
        .map(function (stats) { return Object.keys(stats); });
};
var expand = function (path) { return function (name) {
    return path_1.join(path, name);
}; };
/**
 * writeFile (safe) wrapper.
 */
exports.writeFile = function (path, contents, options) {
    return future_1.fromCallback(function (cb) { return fs.writeFile(path, contents, options, cb); });
};
/**
 * writeTextFile writes the passed contents to a a file location.
 */
exports.writeTextFile = function (path, contents) {
    return exports.writeFile(path, contents, { encoding: 'utf8' });
};
/**
 * makeDir makes a directory at the specified path.
 *
 * By default will create parents if they do not exist.
 *
 * NOTE: On node 8.11.3 and prior the fs module does not support
 * parent directory creation so this function will fail if the parent
 * path does not exist.
 */
exports.makeDir = function (path, options) {
    if (options === void 0) { options = {}; }
    return future_1.fromCallback(function (cb) { return fs.mkdir(path, record_1.merge({ recursive: true }, options), cb); });
};
/**
 * unlink a path from the file system.
 *
 * Does not matter whether it is a file or directory.
 * Use with caution!
 */
exports.unlink = function (path) {
    return exports.isDirectory(path)
        .chain(function (yes) { return future_1.fromCallback(function (cb) { return yes ?
        exports.removeDir(path) :
        exports.removeFile(path); }); });
};
/**
 * removeFile removes a file and only a file.
 *
 * Will fail if the path is not a file.
 */
exports.removeFile = function (path) {
    return exports.exists(path)
        .chain(function (yes) { return yes ?
        future_1.fromCallback(function (cb) { return fs.unlink(path, cb); }) :
        future_1.pure((function () { })()); });
};
/**
 * removeDir removes a directory and only a directory.
 *
 * Will fail if the path is not a directory.
 */
exports.removeDir = function (path) {
    return exports.exists(path)
        .chain(function (yes) { return yes ?
        exports.listAbs(path)
            .chain(function (l) { return future_1.parallel(l.map(exports.unlink)); })
            .chain(function () { return future_1.fromCallback(function (cb) { return fs.rmdir(path, cb); }); }) :
        future_1.pure((function () { })()); });
};
//# sourceMappingURL=file.js.map