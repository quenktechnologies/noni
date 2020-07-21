"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = exports.curry5 = exports.curry4 = exports.curry3 = exports.curry = exports.id = exports.identity = exports.flip = exports.cons = exports.compose5 = exports.compose4 = exports.compose3 = exports.compose = void 0;
/**
 * compose two functions into one.
 */
exports.compose = function (f, g) { return function (a) { return g(f(a)); }; };
/**
 * compose3 functions into one.
 */
exports.compose3 = function (f, g, h) { return function (a) { return h(g(f(a))); }; };
/**
 * compose4 functions into one.
 */
exports.compose4 = function (f, g, h, i) {
    return function (a) { return i(h(g(f(a)))); };
};
/**
 * compose5 functions into one.
 */
exports.compose5 = function (f, g, h, i, j) { return function (a) { return j(i(h(g(f(a))))); }; };
/**
 * cons given two values, ignore the second and always return the first.
 */
exports.cons = function (a) { return function (_) { return a; }; };
/**
 * flip the order of arguments to a curried function that takes 2 arguments.
 */
exports.flip = function (f) { return function (b) { return function (a) { return (f(a)(b)); }; }; };
/**
 * identity function.
 */
exports.identity = function (a) { return a; };
exports.id = exports.identity;
/**
 * curry an ES function that accepts 2 parameters.
 */
exports.curry = function (f) { return function (a) { return function (b) { return f(a, b); }; }; };
/**
 * curry3 curries an ES function that accepts 3 parameters.
 */
exports.curry3 = function (f) { return function (a) { return function (b) { return function (c) { return f(a, b, c); }; }; }; };
/**
 * curry4 curries an ES function that accepts 4 parameters.
 */
exports.curry4 = function (f) {
    return function (a) { return function (b) { return function (c) { return function (d) { return f(a, b, c, d); }; }; }; };
};
/**
 * curry5 curries an ES function that accepts 5 parameters.
 */
exports.curry5 = function (f) {
    return function (a) { return function (b) { return function (c) { return function (d) { return function (e) { return f(a, b, c, d, e); }; }; }; }; };
};
/**
 * noop function
 */
exports.noop = function () { };
//# sourceMappingURL=function.js.map