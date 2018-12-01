"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var future_1 = require("../control/monad/future");
var maybe_1 = require("../data/maybe");
var either_1 = require("../data/either");
var Stats = fs.Stats;
exports.Stats = Stats;
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
        .map(function () { return maybe_1.just(path); })
        .catch(function () { return future_1.pure(maybe_1.nothing()); });
};
/**
 * isDirectory (safe) wrapper.
 */
exports.isDirectory = function (path) {
    return exports.stat(path)
        .map(function (s) { return either_1.fromBoolean(s.isDirectory()); });
};
/**
 * isFile (safe) wrapper.
 */
exports.isFile = function (path) {
    return exports.stat(path)
        .map(function (s) { return either_1.fromBoolean(s.isFile()); });
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