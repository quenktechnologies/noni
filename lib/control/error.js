"use strict";
/**
 * This module provides functions and types to make dealing with ES errors
 * easier.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.attempt = exports.raise = exports.convert = void 0;
/** imports */
var either_1 = require("../data/either");
/**
 * convert an Err to an Error.
 */
var convert = function (e) {
    return (e instanceof Error) ? e : new Error(e.message);
};
exports.convert = convert;
/**
 * raise the supplied Error.
 *
 * This function exists to maintain a functional style in situations where
 * you may actually want to throw an error.
 */
var raise = function (e) {
    if (e instanceof Error) {
        throw e;
    }
    else {
        throw new Error(e.message);
    }
};
exports.raise = raise;
/**
 * attempt a synchronous computation that may throw an exception.
 */
var attempt = function (f) {
    try {
        return either_1.right(f());
    }
    catch (e) {
        return either_1.left(e);
    }
};
exports.attempt = attempt;
//# sourceMappingURL=error.js.map