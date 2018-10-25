"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var either_1 = require("../data/either");
/**
 * raise the supplied Error.
 *
 * This function exists to maintain a functional style in situations where
 * you may actually want to throw an error.
 */
exports.raise = function (e) { throw e; };
/**
 * attempt a synchronous computation that may throw an exception.
 */
exports.attempt = function (f) {
    try {
        return either_1.right(f());
    }
    catch (e) {
        return either_1.left(e);
    }
};
//# sourceMappingURL=error.js.map