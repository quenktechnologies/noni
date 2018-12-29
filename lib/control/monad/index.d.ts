import { Applicative } from '../applicative';
import { Chain } from '../chain';
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
 * compose two functions that return return Monads.
 *
 * Given two functions  (a:A) => Monad<B> and (b:B) => Monad<C>
 * you get a function (a:A) => Monad<C>
 */
export declare const compose: <A, B, C, MB extends Monad<B>, MC extends Monad<C>>(f: (a: A) => MB) => (g: (b: B) => MC) => (a: A) => MC;
/**
 * $do simulates haskell's do notation using ES6's generator syntax.
 *
 * Example:
 *
 * ```typescript
 * $do(function*() {
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
 */
export declare const $do: <A, M extends Monad<A>>(f: () => Iterator<M>) => M;
