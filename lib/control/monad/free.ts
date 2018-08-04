import { Monad } from './';
import { Functor } from '../../data/functor';
import { Either, Left, left, right } from '../../data/either';
import { Identity } from '../../data/indentity';
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
export abstract class Free<F extends Functor<any>, A>
    implements Monad<A>, Eq<Free<F, A>> {

    /**
     * of produces a pure Free from a value.
     */
    of(a: A): Free<F, A> {

        return new Return<F, A>(a);

    }

    /**
     * map implementation.
     */
    map<B>(f: (a: A) => B): Free<F, B> {

        return this.chain((a: A) => new Return(f(a)));

    }

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
    abstract foldFree<M extends Monad<A>>(f: (ff: Functor<any>) => Monad<any>): M;

    /**
     * run the computations of the [[Free]] to completion.
     */
    abstract run(f: (next: F) => Free<F, A>): A;

    /**
     * eq implementation.
     */
    abstract eq(f: Free<F, A>): boolean

}

/**
 * Suspend constructor.
 * @private
 */
export class Suspend<F extends Functor<any>, A> extends Free<F, A> {

    constructor(public value: F) { super(); }

    chain<B>(f: (a: A) => Free<F, B>): Free<F, B> {

        return new Suspend(<F>this.value.map((free: Free<F, A>) => free.chain(f)));

    }

    ap<B>(f: Free<F, (a: A) => B>): Free<F, B> {

        return <Free<F, B>>this.chain(x => f.map(g => g(x)));

    }

    resume(): Either<F, A> {

        return left<F, A>(this.value);

    }

    foldFree<M extends Monad<A>>(f: (ff: Functor<any>) => Monad<any>): M {

        return <M>f(this.value).chain(free => free.foldFree(f));

    }

    run(f: (next: F) => Free<F, A>): A {

        let r = this.resume();

        while (r instanceof Left)
            r = (f(r.takeLeft())).resume();

        return r.takeRight();

    }

    /**
     * eq implementation.
     */
    eq(f: Free<F, A>): boolean {

        let result = false;

        this.resume().takeLeft().map((func: Free<F, A>) => result = func.eq(f));
        return result;

    }

}

/**
 * Return constructor.
 * @private
 */
export class Return<F extends Functor<any>, A> extends Free<F, A> {

    constructor(public value: A) { super(); }

    chain<B>(f: (a: A) => Free<F, B>): Free<F, B> {

        return f(this.value);

    }

    ap<B>(f: Free<F, (a: A) => B>): Free<F, B> {

        return <Free<F, B>>f.map(g => g(this.value));

    }

    resume(): Either<F, A> {

        return right<F, A>(this.value);

    }

    foldFree<M extends Monad<A>>(f: (ff: Functor<any>) => Monad<any>): M {

        return <M>f(new Identity(this.value))

    }

    run(_: (next: F) => Free<F, A>): A {

        return this.value;

    }

    eq(f: Free<F, A>): boolean {

        return (f instanceof Return) ?
            (this.value === f.value) :
            f.eq(this);

    }

}

/**
 * liftF a Functor into a Free.
 */
export const liftF = <F extends Functor<any>, A>(f: Functor<any>): Free<F, A> =>
    new Suspend(<F>f.map(a => new Return(a)));
