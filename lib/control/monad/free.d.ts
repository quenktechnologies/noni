import { Monad } from './';
import { Functor } from '../../data/functor';
import { Either } from '../../data/either';
import { Eq } from '../../data/eq';
/**
 * Free monad implementation.
 *
 * This is a basic, somewhat naive implementation of a Free monad devoid
 * of stack safety.
 *
 * As far as the library is concerned, a [[Free]] provides a [[Monad]]
 * that can be used to provide a first-class micro DSL without the overhead
 * of parsing and compilation.
 *
 * A Free monad encases any [[Functor]] effectively promoting it to a monad.
 * These Functors represent your DSL and can be sequenced together via the
 * Free's Monad structure and later "interpreted" or "compiled" into a final
 * result.
 */
export declare abstract class Free<F extends Functor<any>, A> implements Monad<A>, Eq<Free<F, A>> {
    /**
     * of produces a pure Free from a value.
     */
    of(a: A): Free<F, A>;
    /**
     * map implementation.
     */
    map<B>(f: (a: A) => B): Free<F, B>;
    /**
     * chain implementation.
     */
    abstract chain<B>(g: (a: A) => Free<F, B>): Free<F, B>;
    /**
     * ap implementation.
     */
    abstract ap<B>(f: Free<F, (a: A) => B>): Free<F, B>;
    /**
     * resume unwraps one layer of [[Functor]].
     */
    abstract resume(): Either<F, A>;
    /**
     * foldFree transforms a [[Free]] into the [[Monad]] of choice.
     */
    abstract foldFree<M extends Monad<A>>(f: (func: Functor<any>) => Monad<any>): M;
    /**
     * run the computations of the [[Free]] to completion.
     */
    abstract run(f: (next: F) => Free<F, A>): A;
    /**
     * eq implementation.
     */
    abstract eq(f: Free<F, A>): boolean;
}
/**
 * Suspend constructor.
 * @private
 */
export declare class Suspend<F extends Functor<any>, A> extends Free<F, A> {
    value: F;
    constructor(value: F);
    chain<B>(f: (a: A) => Free<F, B>): Free<F, B>;
    ap<B>(f: Free<F, (a: A) => B>): Free<F, B>;
    resume(): Either<F, A>;
    foldFree<M extends Monad<A>>(f: (func: Functor<any>) => Monad<any>): M;
    run(f: (next: F) => Free<F, A>): A;
    /**
     * eq implementation.
     */
    eq(f: Free<F, A>): boolean;
}
/**
 * Return constructor.
 * @private
 */
export declare class Return<F extends Functor<any>, A> extends Free<F, A> {
    value: A;
    constructor(value: A);
    chain<B>(f: (a: A) => Free<F, B>): Free<F, B>;
    ap<B>(f: Free<F, (a: A) => B>): Free<F, B>;
    resume(): Either<F, A>;
    foldFree<M extends Monad<A>>(f: (func: Functor<any>) => Monad<any>): M;
    run(_: (next: F) => Free<F, A>): A;
    eq(f: Free<F, A>): boolean;
}
/**
 * liftF a Functor into a Free.
 */
export declare const liftF: <F extends Functor<any>, A>(f: F) => Free<F, A>;
