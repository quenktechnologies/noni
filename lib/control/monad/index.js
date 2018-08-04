"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * join flattens a Monad that contains another Monad.
 */
exports.join = function (outer) {
    return outer.chain(function (x) { return x; });
};
/**
 * compose two functions that return return Monads.
 *
 * Given two functions  (a:A) => Monad<B> and (b:B) => Monad<C>
 * you get a function (a:A) => Monad<C>
 */
exports.compose = function (f) { return function (g) { return function (a) { return f(a).chain(g); }; }; };
//# sourceMappingURL=index.js.map