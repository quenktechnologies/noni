"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var fs_1 = require("fs");
exports.Stats = fs_1.Stats;
var future_1 = require("../control/monad/future");
/**
 * stat (safe) wrapper.
 */
exports.stat = function (path) {
    return future_1.fromCallback(function (cb) { return fs.stat(path, cb); });
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
    return exports.stat(path).map(function (s) { return s.isDirectory(); });
};
/**
 * isFile (safe) wrapper.
 */
exports.isFile = function (path) {
    return exports.stat(path).map(function (s) { return s.isFile(); });
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