import { Type } from '../../data/type';
import { Applicative } from '../applicative';
import { Chain } from '../chain';
/**
 * DoFn type.
 *
 * This is the type of function we expect for do notation.
 */
export declare type DoFn<A, M extends Monad<A>> = () => Generator<Monad<Type>, M, Type>;
/**
 * Monad provides a combination of an Applicative and Chain.
 *
 * As far as this library is concerned, a Monad is a type used
 * to contain a value that can be transformed through a sequence of computations.
 *
 * Monads allow the programmer to visually separate transformations and side-effects
 * in a way that is easier to visually review and debug (when done properly).
 * @param <A> The type of the value the Monad contains.
 */
export interface Monad<A> extends Applicative<A>, Chain<A> {
}
/**
 * join flattens a Monad that contains another Monad.
 */
export declare const join: <A, M extends Monad<A>>(outer: Monad<M>) => M;
/**
 * compose right composes functions that produce Monads so that the output
 * of the second is the input of the first.
 */
export declare const compose: <A, B, C, MB extends Monad<B>, MC extends Monad<C>>(g: (b: B) => MC, f: (a: A) => MB) => (value: A) => Chain<C>;
/**
 * pipe left composes functions that produce Monads so that the output of the
 * first is the input of the second.
 */
export declare const pipe: <A, B, C, MB extends Monad<B>, MC extends Monad<C>>(f: (a: A) => MB, g: (b: B) => MC) => (value: A) => Chain<C>;
/**
 * pipeN is like pipe but takes variadic parameters.
 *
 * Because of this, the resulting function only maps from A -> B.
 */
export declare const pipeN: <A, B, MB extends Monad<B>>(f: (a: A) => MB, ...list: ((b: B) => MB)[]) => (value: A) => MB;
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
export declare const doN: <A, M extends Monad<A>>(f: DoFn<A, M>) => M;
