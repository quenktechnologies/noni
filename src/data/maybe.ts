import { Monad } from '../control/monad';
import { Alt } from '../control/alt';
import { Plus } from '../control/plus';
import { Alternative } from '../control/alternative';
import { Extend } from '../control/extend';
import { Eq } from './eq';

/**
 * Maybe monad represents an optional or nullable value.
 */
export interface Maybe<A> extends
    Monad<A>, Alt<A>, Plus<A>, Alternative<A>, Extend<A>, Eq<Maybe<A>> {

    of(a: A): Maybe<A>;

    map<B>(_: (a: A) => B): Maybe<B>;

    ap<B>(_: Maybe<(a: A) => B>): Maybe<B>;

    chain<B>(_: (a: A) => Maybe<B>): Maybe<B>;

    alt(a: Maybe<A>): Maybe<A>;

    empty(): Maybe<A>;

    extend<B>(_: (ex: Maybe<A>) => B): Maybe<B>;

    /**
     * orJust is like applying map to the Nothing<A> side.
     */
    orJust<B>(_f: () => B): Maybe<A | B>;

    /**
     * orElse allows for an alternative Maybe value to
     * be provided when Nothing<A> but using a function.
     */
    orElse<B>(f: () => Maybe<B>): Maybe<A|B>;

    /**
     * get the value from a Maybe.
     */
    get(): A;

}

/**
 * Nothing represents the absence of a usable value.
 */
export class Nothing<A> implements Maybe<A> {

    /**
     * map simply returns a Nothing<A>
     */
    map<B>(_: (a: A) => B): Maybe<B> {

        return new Nothing<B>();

    }

    /**
     * ap allows for a function wrapped in a Just to apply
     * to value present in this Just.
     */
    ap<B>(_: Maybe<(a: A) => B>): Maybe<B> {

        return new Nothing<B>();

    }

    /**
     * of wraps a value in a Just.
     */
    of(a: A): Maybe<A> {

        return new Just(a);

    }

    /**
     * chain simply returns a Nothing<A>.
     */
    chain<B>(_: (a: A) => Maybe<B>): Maybe<B> {

        return new Nothing<B>();

    }

    /**
     * alt will prefer whatever Maybe instance provided.
     */
    alt(a: Maybe<A>): Maybe<A> {

        return a;

    }

    /**
     * empty provides a default Maybe.
     * Maybe.empty() = new Nothing()
     */
    empty(): Maybe<A> {

        return new Nothing<A>();

    }

    /**
     * extend returns a Nothing<A>.
     */
    extend<B>(_: (ex: Maybe<A>) => B): Maybe<B> {

        return new Nothing<B>();

    }

    /**
     * eq returns true if compared to another Nothing instance.
     */
    eq(m: Maybe<A>) {

        return m instanceof Nothing;

    }

    /**
     * orJust converts a Nothing<A> to a Just
     * using the value from the provided function.
     */
    orJust<B>(f: () => B): Maybe<B> {

        return new Just(f());

    }

    /**
     * orElse allows an alternative Maybe value
     * to be provided since this one is Nothing<A>.
     */
    orElse<B>(f: () => Maybe<B>): Maybe<B> {

        return f();

    }

    /**
     * get throws an error because there
     * is nothing here to get.
     */
    get(): A {

        throw new TypeError('Cannot get a value from Nothing!');

    }

}

/**
 * Just represents the presence of a usable value.
 */
export class Just<A> implements Maybe<A> {

    constructor(public value: A) { }

    /**
     * map over the value present in the Just.
     */
    map<B>(f: (a: A) => B): Maybe<B> {

        return new Just(f(this.value));

    }

    /**
     * ap allows for a function wrapped in a Just to apply
     * to value present in this Just.
     */
    ap<B>(mb: Maybe<(a: A) => B>): Maybe<B> {

        return <Maybe<B>>mb.map(f => f(this.value));

    }

    /**
     * of wraps a value in a Just.
     */
    of(a: A): Maybe<A> {

        return new Just(a);
    }

    /**
     * chain allows the sequencing of functions that return a Maybe.
     */
    chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {

        return f(this.value);

    }

    /**
     * alt will prefer the first Just encountered (this).
     */
    alt(_: Maybe<A>): Maybe<A> {

        return this;

    }

    /**
     * empty provides a default Maybe.
     * Maybe.empty() = new Nothing()
     */
    empty(): Maybe<A> {

        return new Nothing<A>();

    }

    /**
     * extend allows sequencing of Maybes with 
     * functions that unwrap into non Maybe types.
     */
    extend<B>(f: (ex: Maybe<A>) => B): Maybe<B> {

        return new Just(f(this));

    }

    /**
     * eq tests the value of two Justs.
     */
    eq(m: Maybe<A>): boolean {

        return ((m instanceof Just) && (m.value === this.value));

    }

    /**
     * orJust returns this Just.
     */
    orJust<B>(_: (a: A) => B): Maybe<A> {

        return this;

    }

    /**
     * orElse returns this Just
     */
    orElse<B>(_: (a: A) => B): Maybe<A> {

        return this;

    }

    /**
     * get the value of this Just.
     */
    get(): A {

        return this.value;

    }

}

/**
 * of
 */
export const of = <A>(a: A) => new Just(a);

/**
 * nothing convenience constructor
 */
export const nothing = <A>() => new Nothing<A>();

/**
 * just convenience constructor
 */
export const just = <A>(a: A) => new Just(a);

/**
 * fromNullable constructs a Maybe from a value that may be null.
 */
export const fromNullable = <A>(a: A): Maybe<A> => a == null ?
    new Nothing<A>() : new Just(a);

/**
 * fromArray checks an array to see if it's empty
 *
 * Returns [[Nothing]] if it is, [[Just]] otherwise.
 */
export const fromArray = <A>(a: A[]): Maybe<A[]> =>
    (a.length === 0) ? new Nothing<A[]>() : new Just(a)

/**
 * fromObject uses Object.keys to turn see if an object 
 * has any own properties.
 */
export const fromObject = <A>(o: A): Maybe<A> =>
    Object.keys(o).length === 0 ? new Nothing<A>() : new Just(o);

/**
 * fromString constructs Nothing<A> if the string is empty or Just<A> otherwise.
 */
export const fromString = (s: string): Maybe<string> =>
    (s === '') ? new Nothing<string>() : new Just(s);

/**
 * fromBoolean constructs Nothing if b is false, Just<A> otherwise
 */
export const fromBoolean = (b: boolean): Maybe<boolean> =>
    (b === false) ? new Nothing<boolean>() : new Just(b);

/**
 * fromNumber constructs Nothing if n is 0 Just<A> otherwise.
 */
export const fromNumber = (n: number): Maybe<number> =>
    (n === 0) ? new Nothing<number>() : new Just(n);

/**
 * fromNaN constructs Nothing if a value is not a number or
 * Just<A> otherwise.
 */
export const fromNaN = (n: number): Maybe<number> =>
    isNaN(n) ? new Nothing<number>() : new Just(n);
