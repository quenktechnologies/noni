"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var fs_1 = require("fs");
exports.Stats = fs_1.Stats;
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
    return exports.readdir(path)
        .chain(function (list) {
        return future_1.parallel(list.map(function (l) { return exports.stat(path + "/" + l); }))
            .map(function (stats) { return stats.reduce(function (p, c, i) {
            p[list[i]] = c;
            return p;
        }, {}); });
    });
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
    return exports.readFile(path, 'utf8');
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
 * writeFile (safe) wrapper.
 */
exports.writeFile = function (path, contents, options) {
    return future_1.fromCallback(function (cb) { return fs.writeFile(path, contents, options, cb); });
};
/**
 * writeTextFile writes the passed contents to a a file location.
 */
exports.writeTextFile = function (path, contents) {
    return exports.writeFile(path, contents, 'utf8');
};
//# sourceMappingURL=file.js.map