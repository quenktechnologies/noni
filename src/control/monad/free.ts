/**
 * This is a basic, somewhat naive implementation of a Free monad devoid 
 * of stack safety.
 *
 * As far as the library is concerned, a [[Free]] provides a [[Monad]] structure
 * that can be used for creating first-class DSL from [[Functors]]
 * without the overhead parsing and compilation.
 *
 * Instead, the overhead incurred depends on the method use to interpret
 * the Free based DSL.
 *
 * A Free monad encases any [[Functor]] effectively promoting it to a monad.
 * These Functors represent your DSL and can be sequenced together via
 * Free#chain.
 *
 * Think of each as a line of instruction in an assembly type program.
 *
 * ## Limitations
 *
 * ### Performance 
 *
 * As mentioned before this is a naive impementation, future versions may
 * introduce stack safety.
 *
 * ### Type System
 * TypeScript does not have Higher Kinded Types (HKT) or as the author
 * understands; generic types that can themeselves have type parameters.
 *
 * Due to this fact, implementing a Free and related functions is probably
 * impossible without breaking typesafety via any. This is evident in the
 * use of any for the Functor constraint type parameter.
 *
 * ### Example
 *
 * This example can be seen in the tests for this module.
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
 * The <N> type parameter is the next link in the Free chain however seeing that
 * our API members need to be Functors we leave it generic.
 *
 * Now we declare our API clases.
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
 * them into the Free monad thus prompting them to [[Monads]]s this is done
 * via the [[liftF]] function:
 *
 * ```typescript
 *
 * let m: Free<API<any>, undefined> = liftF(new Put('key', 'value', undefined));
 *
 * ```
 *
 * Note the use of API<any> here. Any is used as the type parameter because
 * the typescript compiler will not keep track of our API Functors as we 
 * nest them (no HKT). 
 *
 * The second type parameter to Free is undefined. This is the final result
 * of our Free program. We use undefined because we have no "next" value as
 * yet and thus interpreting our variable `m` would result in undefined.
 *
 * As we chain Free's together this may change but generally we are 
 * not interested in this result in the first place.
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
 * Putting it all thogether we can now do this:
 *
 * ```typescript
 *
 * let x: Free<API<any>, undefined> =
 *         put('num', '12')
 *         .chain(() => get('num'))
 *         .chain((n: string) => remove(n));
 *
 * ```typescript
 *
 * The variable `x` is now our DSL program represented as a Free Monad.
 *
 * `x` can now be interpreted makind use of the foldFree or run methods
 * or one of the helper functions this module provides.
 *
 * ## Resources:
 * * [Running Free with the Monads](https://www.slideshare.net/kenbot/running-free-with-the-monads)
 * * [Free Monads for cheap interpreters](https://www.tweag.io/posts/2018-02-05-free-monads.html)
 * * [purescript-free](https://pursuit.purescript.org/packages/purescript-free/5.1.0)
 */
import { Monad } from './';
import { Functor } from '../../data/functor';
import { Either, Left, Right, left, right } from '../../data/either';
import { Identity } from '../../data/indentity';
import { Eq } from '../../data/eq';
import { tail } from '../../data/array';

/**
 * Step in the reduction of a [[Free]] chain to a single value. 
 */
export class Step<F extends Functor<any>, A, B> {

    constructor(public value: B, public next: Free<F, A>) { }

}

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

    foldFree<M extends Monad<A>>(f: (func: Functor<any>) => Monad<any>): M {

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

    foldFree<M extends Monad<A>>(f: (func: Functor<any>) => Monad<any>): M {

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
