"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = exports.curry5 = exports.curry4 = exports.curry3 = exports.curry = exports.id = exports.identity = exports.flip = exports.cons = exports.compose5 = exports.compose4 = exports.compose3 = exports.compose = void 0;
/**
 * compose two functions into one.
 */
const compose = (f, g) => (a) => g(f(a));
exports.compose = compose;
/**
 * compose3 functions into one.
 */
const compose3 = (f, g, h) => (a) => h(g(f(a)));
exports.compose3 = compose3;
/**
 * compose4 functions into one.
 */
const compose4 = (f, g, h, i) => (a) => i(h(g(f(a))));
exports.compose4 = compose4;
/**
 * compose5 functions into one.
 */
const compose5 = (f, g, h, i, j) => (a) => j(i(h(g(f(a)))));
exports.compose5 = compose5;
/**
 * cons given two values, ignore the second and always return the first.
 */
const cons = (a) => (_) => a;
exports.cons = cons;
/**
 * flip the order of arguments to a curried function that takes 2 arguments.
 */
const flip = (f) => (b) => (a) => (f(a)(b));
exports.flip = flip;
/**
 * identity function.
 */
const identity = (a) => a;
exports.identity = identity;
exports.id = exports.identity;
/**
 * curry an ES function that accepts 2 parameters.
 */
const curry = (f) => (a) => (b) => f(a, b);
exports.curry = curry;
/**
 * curry3 curries an ES function that accepts 3 parameters.
 */
const curry3 = (f) => (a) => (b) => (c) => f(a, b, c);
exports.curry3 = curry3;
/**
 * curry4 curries an ES function that accepts 4 parameters.
 */
const curry4 = (f) => (a) => (b) => (c) => (d) => f(a, b, c, d);
exports.curry4 = curry4;
/**
 * curry5 curries an ES function that accepts 5 parameters.
 */
const curry5 = (f) => (a) => (b) => (c) => (d) => (e) => f(a, b, c, d, e);
exports.curry5 = curry5;
/**
 * noop function
 */
const noop = () => { };
exports.noop = noop;
//# sourceMappingURL=function.js.map