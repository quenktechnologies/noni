"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = exports.curry5 = exports.curry4 = exports.curry3 = exports.curry = exports.id = exports.identity = exports.flip = exports.cons = exports.compose5 = exports.compose4 = exports.compose3 = exports.compose = void 0;
/**
 * compose two functions into one.
 */
var compose = function (f, g) { return function (a) { return g(f(a)); }; };
exports.compose = compose;
/**
 * compose3 functions into one.
 */
var compose3 = function (f, g, h) { return function (a) { return h(g(f(a))); }; };
exports.compose3 = compose3;
/**
 * compose4 functions into one.
 */
var compose4 = function (f, g, h, i) {
    return function (a) { return i(h(g(f(a)))); };
};
exports.compose4 = compose4;
/**
 * compose5 functions into one.
 */
var compose5 = function (f, g, h, i, j) { return function (a) { return j(i(h(g(f(a))))); }; };
exports.compose5 = compose5;
/**
 * cons given two values, ignore the second and always return the first.
 */
var cons = function (a) { return function (_) { return a; }; };
exports.cons = cons;
/**
 * flip the order of arguments to a curried function that takes 2 arguments.
 */
var flip = function (f) { return function (b) { return function (a) { return (f(a)(b)); }; }; };
exports.flip = flip;
/**
 * identity function.
 */
var identity = function (a) { return a; };
exports.identity = identity;
exports.id = exports.identity;
/**
 * curry an ES function that accepts 2 parameters.
 */
var curry = function (f) { return function (a) { return function (b) { return f(a, b); }; }; };
exports.curry = curry;
/**
 * curry3 curries an ES function that accepts 3 parameters.
 */
var curry3 = function (f) { return function (a) { return function (b) { return function (c) { return f(a, b, c); }; }; }; };
exports.curry3 = curry3;
/**
 * curry4 curries an ES function that accepts 4 parameters.
 */
var curry4 = function (f) {
    return function (a) { return function (b) { return function (c) { return function (d) { return f(a, b, c, d); }; }; }; };
};
exports.curry4 = curry4;
/**
 * curry5 curries an ES function that accepts 5 parameters.
 */
var curry5 = function (f) {
    return function (a) { return function (b) { return function (c) { return function (d) { return function (e) { return f(a, b, c, d, e); }; }; }; }; };
};
exports.curry5 = curry5;
/**
 * noop function
 */
var noop = function () { };
exports.noop = noop;
//# sourceMappingURL=function.js.map