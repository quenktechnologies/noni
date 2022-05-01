"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doMonad = exports.doN = exports.pipeN = exports.pipe = exports.compose = exports.join = void 0;
/**
 * join flattens a Monad that contains another Monad.
 */
const join = (outer) => outer.chain((x) => x);
exports.join = join;
/**
 * compose right composes functions that produce Monads so that the output
 * of the second is the input of the first.
 */
const compose = (g, f) => (0, exports.pipe)(f, g);
exports.compose = compose;
/**
 * pipe left composes functions that produce Monads so that the output of the
 * first is the input of the second.
 */
const pipe = (f, g) => (value) => f(value).chain(b => g(b));
exports.pipe = pipe;
/**
 * pipeN is like pipe but takes variadic parameters.
 *
 * Because of this, the resulting function only maps from A -> B.
 */
const pipeN = (f, ...list) => (value) => list.reduce((p, c) => p.chain(v => c(v)), f(value));
exports.pipeN = pipeN;
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
const doN = (f) => {
    let gen = f();
    let next = (val) => {
        let r = gen.next(val);
        if (r.done)
            return r.value;
        else
            return r.value.chain(next);
    };
    return next();
};
exports.doN = doN;
exports.doMonad = exports.doN;
//# sourceMappingURL=index.js.map