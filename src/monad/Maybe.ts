import { Monad } from './Monad';

/**
 * Maybe
 */
export abstract class Maybe<A> implements Monad<A> {

    of(a: A): Maybe<A> {

        return new Just(a);
    }

    map<B>(_: (a: A) => B): Maybe<B> {

        return <any>this;

    }

    join(): A {

        return <any>this;

    }

    chain<B>(_: (a: A) => Maybe<B>): Maybe<B> {

        return <any>this;

    }

    get(): A {

        throw new TypeError('Cannot get anything from Nothing!');

    }

    orElse<B>(f: () => Maybe<B>): Maybe<B> {

        return f();

    }

    /**
     * orJust will turn Nothing into Just, wrapping the value specified.
     */
    orJust<B>(f: () => B): Maybe<B> {

        return just(f());

    }

    /**
     * cata applies the corresponding function to the Maybe
     */
    cata<C>(f: () => C, _g: (a: A) => C): C {

        return f();

    }


}

/**
 * Nothing
 */
export class Nothing<A> extends Maybe<A> { }

/**
 * Just
 */
export class Just<A> extends Maybe<A> {

    constructor(public a: A) {

        super();

    }

    map<B>(f: (a: A) => B): Maybe<B> {

        return new Just(f(this.a));

    }

    join(): A {

        return this.a

    }

    chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {

        return this.map(f).join();
    }

    get(): A {

        return this.a;

    }

    orElse<B>(_f: () => Maybe<B>): Maybe<B> {

        return <any>this;

    }

    orJust<B>(_f: () => B): Maybe<B> {

        return <any>this;

    }

    cata<C>(_f: () => C, g: (a: A) => C): C {

        return g(this.a);

    }


}

/**
 * just wraps a value in a Just
 */
export const just = <A>(a: A): Maybe<A> => new Just(a);;

/**
 * nothing constructs nothing
 */
export const nothing = (): Nothing<void> => new Nothing();

/**
 * fromAny constructs a Maybe from a value that may be null.
 */
export const fromAny = <A>(a: A): Maybe<A> => a == null ? new Nothing() : just(a);
