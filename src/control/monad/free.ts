/**
 * This is a basic, somewhat naive implementation of a Free monad devoid 
 * of stack safety.
 *
 * As far as the library is concerned, a [[Free]] provides a [[Monad]] 
 * that can be used for creating first-class DSL from [[Functor]]s
 * without parsing overhead.
 *
 * It is probably not very efficient to have a very large Free based DSL using
 * this implementation.
 *
 * A Free monad wraps up any [[Functor]] implementation which
 * has the effect of prompoting it to a monad. These Functors are your
 * DSL productions and can be sequenced together like regular monads using
 * `Free#chain`.
 *
 * Think of each as a line of instruction in an assembly type program.
 *
 * ## Limitations
 *
 * ### Performance 
 *
 * As mentioned before this is a naive impementation, future versions may
 * introduce stack safety but for now, assume none exists.
 *
 * ### Type System
 * TypeScript does not have Higher Kinded Types (HKT) or as the author
 * understands; generic types that can themeselves have type parameters.
 *
 * Due to this fact, implementing a Free and related functions is probably
 * impossible without breaking typesafety via `any`. This is evident in the
 * use of `any` for the Functor type parameter.
 *
 * ## Example
 *
 * Start by describing your API via a sum type:
 *
 * ```typescript
 *
 * type API<N>
 *  = Put<N>
 *  | Get<N>
 *  | Remove<N>
 *  ; 
 *
 * ```
 * The `N` type parameter is actually the next step in the chain.
 * It is a Functor wrapped in some [[Free]]. Since we don't have HKT we just 
 * leave it generic otherwise we would lose vital information during chaining.
 *
 * Declare our API clases:
 *
 * ```typescript
 *
 *  class Put<N> {
 * 
 *  constructor(public key: string, public value: string, public next: N) { }
 *
 *  map<B>(f: (a: N) => B): Put<B> {
 *
 *      return new Put(this.key, this.value, f(this.next));
 *
 *  }
 *
 * }
 *
 * class Get<N> {
 *
 *  constructor(public key: string, public next: (s: string) => N) { }
 *
 *  map<B>(f: (a: N) => B): Get<B> {
 *
 *      return new Get(this.key, (a: string) => f(this.next(a)));
 *
 *  }
 *
 * }
 *
 * class Remove<N> {
 *
 *  constructor(public key: string, public next: N) { }
 *
 *  map<B>(f: (a: N) => B): Remove<B> {
 *
 *      return new Remove(this.key, f(this.next));
 *
 *  }
 *
 * }
 *
 * ```
 *
 * In order to chain the API members together with Free, we need to "lift"
 * them into the Free monad thus prompting them. This is done  via the 
 * [[liftF]] function:
 *
 * ```typescript
 * let m: Free<API<any>, undefined> = liftF(new Put('key', 'value', undefined));
 *
 * ```
 *
 * Note the use of `API<any>` here. `any` is used as the type parameter because
 * the typescript compiler will not keep track of our API Functors as we 
 * nest them (no HKT). 
 *
 * The second type parameter to Free is `undefined`. This is the final result
 * of our Free program. We use undefined because we have no "next" value as
 * yet and thus interpreting our variable `m` would result in the effect
 * of a Put followed by nothing.
 *
 * Generally we are not interested in the final value in the first place.
 *
 * Let us create some helper functions to make using our api easier:
 *
 * ```typescript
 * const put = (key: string, value: string) => liftF<API<any>, undefined>(new Put(key, value, _));
 *
 * const get = (key: string) => liftF<API<string>, undefined>(new Get(key, (s: string) => s));
 *
 * const remove = (key: string) => liftF<API<any>, undefined>(new Remove(key, _));
 *
 * ```
 *
 * We now have a set of functions for working with our DSL. Not that the
 * Get class uses a function to provide it's next value, this is how an
 * API command makes a value available to the next one in the chain.
 *
 * We can now use our API as follows:
 *
 * ```typescript
 *
 * let x: Free<API<any>, undefined> =
 *         put('num', '12')
 *         .chain(() => get('num'))
 *         .chain((n: string) => remove(n));
 *
 * ```
 *
 * The variable `x` is now a program represented in out Free DSL.
 *
 * `x` can now be interpreted making use of the `fold` or `run` method.
 *
 * ## Resources:
 * * [Running Free with the Monads](https://www.slideshare.net/kenbot/running-free-with-the-monads)
 * * [Free Monads for cheap interpreters](https://www.tweag.io/posts/2018-02-05-free-monads.html)
 * * [purescript-free](https://pursuit.purescript.org/packages/purescript-free/5.1.0)
 */

/** imports **/
import { Monad } from './';
import { Functor } from '../../data/functor';
import { Either, Left, Right, left, right } from '../../data/either';
import { Identity } from '../../data/indentity';
import { Eq } from '../../data/eq';
import { tail } from '../../data/array';

/**
 * FoldFreeFunction
 */
export type FoldFreeFunction<A> = (func: Functor<A>) => Monad<A>;

/**
 * Free monad implementation.
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
     * fold a Free monad into a single value.
     */
    abstract fold<B>(f: (a: A) => B, g: (f: F) => B): B;

    /**
     * foldM folds a Free monad into another monad.
     */
    abstract foldM<M extends Monad<any>>(f: (a: A) => M, g: (f: F) => M): M;

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

    fold<B>(f: (a: A) => B, g: (f: F) => B): B {

        return g(<F>this.value.map(free => free.fold(f, g)));

    }

    foldM<M extends Monad<any>>(f: (a: A) => M, g: (f: F) => M): M {

        return <M>g(this.value).chain(free => free.foldM(f, g));

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

    fold<B>(f: (a: A) => B, _: (f: F) => B): B {

        return f(this.value);

    }

    foldM<M extends Monad<any>>(f: (a: A) => M, _: (f: F) => M): M {

        return f(this.value);

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
 * Step in the reduction of a [[Free]] chain to a single value. 
 */
export class Step<F extends Functor<any>, A, B> {

    constructor(public value: B, public next: Free<F, A>) { }

}

/**
 * liftF a Functor into a Free.
 */
export const liftF = <F extends Functor<any>, A>(f: F): Free<F, A> =>
    new Suspend(<F>f.map(a => new Return(a)));

/**
 * flatten a Free chain into a single level array.
 */
export const flatten = <F extends Functor<any>, A>
    (fr: Free<F, A>) => (f: (next: F) => Free<F, A>): F[] => {

        let r = fr.resume();
        let l: F[] = [];

        while (r instanceof Left) {

            l.push(r.takeLeft())
            r = f(tail(l)).resume();

        }

        return l;

    }

/**
 * reduce a Free into a single value.
 *
 * This function exists primarly as an alternative to recursively
 * calling a function on each step in the Free's chain.
 *
 * Instead, using a while loop we unwrap each layer of the Free 
 * and apply the function f which yields a Step of computing
 * the final value.
 *
 * Note that the A in Free<F, A> is ignored completely as reflected in the type
 * Free<F,void>
 */
export const reduce = <F extends Functor<any>, B>
    (fr: Free<F, void>) => (b: B) => (f: (prev: B, curr: F) => Step<F, void, B>)
        : B => {

        let step = new Step(b, fr);
        let r = fr.resume();

        if (r instanceof Right) {

            return b;

        } else {

            while (r instanceof Left) {

                step = f(b, r.takeLeft());
                b = step.value;
                r = step.next.resume();

            }

            return b;

        }

    }
