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
/**
 * doN simulates haskell's do notation using ES6's generator syntax.
 *
 * Example:
 *
 * ```typescript
 * doN(function*() {
 *
 *   const a = yield pure(1);
 *   const b = yield pure(a+2);
 *   const c = yield pure(b+1);
 *
 *   return c;
 *
 * })
 * ```
 * Each yield is results in a level of nesting added to the chain. The above
 * could be re-written as:
 *
 * ```typescript
 *
 * pure(1)
 *  .chain(a =>
 *   pure(a + 2)
 *    .chain(b =>
 *       pure(b + 1)));
 *
 * ```
 *
 * NOTE: You MUST wrap your return values manually, this function
 *       will not do it for you.
 *
 * NOTE1: Errors thrown in the body of a generator function simply
 * bring the generator to an end. According to MDN:
 *
 * "Much like a return statement, an error thrown inside the generator will
 * make the generator finished -- unless caught within the generator's body."
 *
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator.
 *
 * Beware of uncaught errors being swallowed in the function body.
 */
exports.doN = function (f) {
    var gen = f();
    var next = function (val) {
        var r = gen.next(val);
        if (r.done)
            return r.value;
        else
            return r.value.chain(next);
    };
    return next(undefined);
};
//# sourceMappingURL=index.js.map