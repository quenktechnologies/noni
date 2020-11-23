"use strict";
/**
 * This module provides functions for operating on Records based on their
 * keys.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.project = exports.difference = exports.intersect = exports.map = void 0;
/** imports */
var _1 = require("./");
/**
 * map maps over the property names of a Record producing a new Record
 * with its keys produced by the MapFunc provided.
 */
var map = function (rec, f) {
    return _1.reduce(rec, {}, function (p, c, k) {
        p = _1.set(p, f(k, c, rec), c);
        return p;
    });
};
exports.map = map;
/**
 * intersect set operation.
 *
 * Produces a new Record containing only the properties of the keys
 * that intersect the two records. The value of the properties are sourced
 * from the left Record.
 */
var intersect = function (left, right) {
    return _1.reduce(left, {}, function (p, c, k) {
        if (right.hasOwnProperty(k))
            p = _1.set(p, k, c);
        return p;
    });
};
exports.intersect = intersect;
/**
 * difference set operation.
 *
 * Produces a new Record containing the propertiesof the left Record less
 * any keys appearing in the right one.
 */
var difference = function (left, right) {
    return _1.reduce(left, {}, function (p, c, k) {
        if (!right.hasOwnProperty(k))
            p = _1.set(p, k, c);
        return p;
    });
};
exports.difference = difference;
/**
 * project a Record according to the field specification given.
 *
 * This does not treat the keys of the spec object as paths.
 * For that, use the project function from the path submodule.
 */
var project = function (spec, rec) {
    return _1.reduce(spec, {}, function (p, c, k) {
        return (c === true) ? _1.set(p, k, rec[k]) : p;
    });
};
exports.project = project;
//# sourceMappingURL=key.js.map