import { compose } from '../util';
import { left, right, Left, Either } from './Either';
import { Monad } from './Monad';
import { Functor } from '../data/Functor';

/**
 * free wraps a value in a free
 */
export const free = <A>(a: A) => new Return(a);

/**
 * suspend lifts a function into a Free monad to mimic tail call recursion.
 */
export const suspend = <A>(f: () => A) => new Suspend(compose(free, f));

/**
 * liftF lifts a Functor into a Free.
 */
export const liftF = <F extends Functor<A>, A>(f: F) => new Suspend(f.map(free));

/**
 * Free is a Free monad that also implements a Free Applicative (almost).
 *
 * Inspired by https://cwmyers.github.io/monet.js/#free
 */
export abstract class Free<F, A> implements Monad<A> {

    static free = free;
    static suspend = suspend;
    static liftF = liftF;

    /**
     * of
     */
    of(a: A): Free<F, A> {

        return new Return(a);

    }

    /**
     * map
     */
    map<B>(f: (a: A) => B): Free<F, B> {

        return this.chain((a: A) => free(f(a)));

    }

    /**
     * chain
     */
    chain<B>(g: (a: A) => Free<F, B>): Free<F, B> {

        if (this instanceof Suspend) {

            let f = this.f;

            return (typeof f === 'function') ?
                new Suspend((x: A) => f(x).chain(g)) :
                new Suspend(f.map((free: Free<F, A>) => free.chain(g)));

        } else if (this instanceof Return) {

            g(this.a);
        }

    }

    /**
     * resume the next stage of the computation
     */
    resume(): Either<F, A> {

        if (this instanceof Suspend) {

            return left(this.f)

        } else if (this instanceof Return) {

            return right<F, A>(this.a);

        }

    }

    /**
     * hoist
    hoist<B>(func: (fb: Functor<B>) => Functor<B>): Free<F, A> {

        if (this instanceof Suspend) {

            return new Suspend((func(this.f))
                .map((fr: Free<F, B>) => fr.hoist<any>(func)))
        } else {

            return this;

        }

    }
    */

    /**
     * cata 
     */
    cata<B>(f: (f: F) => B, g: (a: A) => B): B {

        return this.resume().cata(f, g);

    }

    /**
     * go runs the computation to completion using f to extract each stage.
     * @summmary go :: Free<F<*>, A> →  (F<Free<F,A>> →  Free<F,A>) →  A
     */
    go(f: (next: F) => Free<F, A>): A {

        if (this instanceof Suspend) {

            let r = this.resume();

            while (r instanceof Left)
                r = (f(r.takeLeft())).resume();

            return r.takeRight();

        } else if (this instanceof Return) {

            return this.a;

        }

    }

    /**
     * run the Free chain to completion
     * @summary run :: Free<A→ A,A> →  A
     */
    run(): A {

        return this.go((next: F): Free<F, A> => (<Function><any>next)());

    }

}

export class Suspend<F, A> extends Free<F, A> {

    f: F;

    constructor(f: F) {

        super();
        this.f = f;

    }

}

export class Return<A> extends Free<any, A> {

    a: A;

    constructor(a: A) {

        super();
        this.a = a;

    }

}


