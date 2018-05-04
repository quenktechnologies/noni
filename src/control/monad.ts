import { Applicative } from './applicative';
import {Chain} from './chain';

/**
 * Monad provides a combination of an Applicative and Chain.
 */
export interface Monad<A> extends Applicative<A>, Chain<A> { }

/**
 * join flattens a Monad that contains another Monad.
 */
export const join = <A, M extends Monad<A>>(outer: Monad<M>): M =>
    <M>outer.chain((x: M) => x);

/**
 * composeK (>=>) composition for functions that return monads.
 *
 * Instead of:
 *
 * Monad
 *  .chain(a => new Monad(a+b))
 *  .chain(ab => new Monad(ab+c))
 *
 * We get:
 *
 * Monad.chain(composeK(a => new Monad(a+b), ab => new Monad(ab+c)))
 */
export const composeK = <A, B, MB extends Monad<B>, C, MC extends Monad<C>>
    (f: (a: A) => MB) => (g: (b: B) => MC) => (a: A): MC => <MC>f(a).chain(g);
