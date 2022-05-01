"use strict";
/**
 * This module provides functions for operating on Records based on their
 * keys.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.project = exports.difference = exports.intersect = exports.map = void 0;
/** imports */
const _1 = require("./");
/**
 * map maps over the property names of a Record producing a new Record
 * with its keys produced by the MapFunc provided.
 */
const map = (rec, f) => (0, _1.reduce)(rec, {}, (p, c, k) => {
    p = (0, _1.set)(p, f(k, c, rec), c);
    return p;
});
exports.map = map;
/**
 * intersect set operation.
 *
 * Produces a new Record containing only the properties of the keys
 * that intersect the two records. The value of the properties are sourced
 * from the left Record.
 */
const intersect = (left, right) => (0, _1.reduce)(left, {}, (p, c, k) => {
    if (right.hasOwnProperty(k))
        p = (0, _1.set)(p, k, c);
    return p;
});
exports.intersect = intersect;
/**
 * difference set operation.
 *
 * Produces a new Record containing the propertiesof the left Record less
 * any keys appearing in the right one.
 */
const difference = (left, right) => (0, _1.reduce)(left, {}, (p, c, k) => {
    if (!right.hasOwnProperty(k))
        p = (0, _1.set)(p, k, c);
    return p;
});
exports.difference = difference;
/**
 * project a Record according to the field specification given.
 *
 * This does not treat the keys of the spec object as paths.
 * For that, use the project function from the path submodule.
 */
const project = (spec, rec) => (0, _1.reduce)(spec, {}, (p, c, k) => (c === true) ? (0, _1.set)(p, k, rec[k]) : p);
exports.project = project;
//# sourceMappingURL=key.js.map