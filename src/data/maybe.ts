import { Monad } from '../control/monad';
import { Alt } from '../control/alt';
import { Plus } from '../control/plus';
import { Alternative } from '../control/alternative';
import { Extend } from '../control/extend';
import { Eq } from './eq';

/**
 * Maybe monad represents an optional or nullable value.
 */
export abstract class Maybe<A>
    implements
        Monad<A>,
        Alt<A>,
        Plus<A>,
        Alternative<A>,
        Extend<A>,
        Eq<Maybe<A>>
{
    static of<A>(value: A): Maybe<A> {
        return value == null ? new Nothing<A>() : new Just(value);
    }

    static just<A>(value: A): Maybe<A> {
        return new Just(value);
    }

    static nothing<A>(): Maybe<A> {
        return new Nothing<A>();
    }

    /**
     * fromNullable constructs a Maybe from a value that may be null.
     */
    static fromNullable = <A>(a: A | undefined | null): Maybe<A> =>
        a == null ? new Nothing<A>() : new Just(a);

    /**
     * fromArray checks an array to see if it's empty
     *
     * Returns [[Nothing]] if it is, [[Just]] otherwise.
     */
    static fromArray = <A>(a: A[]): Maybe<A[]> =>
        a.length === 0 ? new Nothing<A[]>() : new Just(a);

    /**
     * fromObject uses Object.keys to turn see if an object
     * has any own properties.
     */
    static fromObject = <A extends Object>(o: A): Maybe<A> =>
        Object.keys(o).length === 0 ? new Nothing<A>() : new Just(o);

    /**
     * fromString constructs Nothing<A> if the string is empty or Just<A> otherwise.
     */
    static fromString = (s: string): Maybe<string> =>
        s === '' ? new Nothing<string>() : new Just(s);

    /**
     * fromBoolean constructs Nothing if b is false, Just<A> otherwise
     */
    static fromBoolean = (b: boolean): Maybe<boolean> =>
        b === false ? new Nothing<boolean>() : new Just(b);

    /**
     * fromNumber constructs Nothing if n is 0 Just<A> otherwise.
     */
    static fromNumber = (n: number): Maybe<number> =>
        n === 0 || isNaN(n) ? new Nothing<number>() : new Just(n);

    abstract of(a: A): Maybe<A>;

    abstract map<B>(_: (a: A) => B): Maybe<B>;

    abstract ap<B>(_: Maybe<(a: A) => B>): Maybe<B>;

    abstract chain<B>(_: (a: A) => Maybe<B>): Maybe<B>;

    abstract alt(a: Maybe<A>): Maybe<A>;

    abstract eq(e: Maybe<A>): boolean;

    abstract extend<B>(_: (ex: Maybe<A>) => B): Maybe<B>;

    /**
     * orJust is like applying map to the Nothing<A> side.
     */
    abstract orJust<B>(_f: () => B): Maybe<A | B>;

    /**
     * orElse allows for an alternative Maybe value to
     * be provided when Nothing<A> but using a function.
     */
    abstract orElse<B>(f: () => Maybe<B>): Maybe<A | B>;

    /**
     * isNothing tests whether the Maybe is a Nothing.
     */
    abstract isNothing(): boolean;

    /**
     * isJust tests whether the Maybe is a Just.
     */
    abstract isJust(): boolean;

    /**
     * get the value from a Maybe.
     */
    abstract get(): A;

    empty(): Maybe<A> {
        return new Nothing<A>();
    }
}

/**
 * Nothing represents the absence of a usable value.
 */
export class Nothing<A> extends Maybe<A> {
    map<B>(_: (a: A) => B): Maybe<B> {
        return new Nothing<B>();
    }

    ap<B>(_: Maybe<(a: A) => B>): Maybe<B> {
        return new Nothing<B>();
    }

    of(a: A): Maybe<A> {
        return Maybe.of(a);
    }

    chain<B>(_: (a: A) => Maybe<B>): Maybe<B> {
        return new Nothing<B>();
    }

    alt(a: Maybe<A>): Maybe<A> {
        return a;
    }

    extend<B>(_: (ex: Maybe<A>) => B): Maybe<B> {
        return new Nothing<B>();
    }

    eq(m: Maybe<A>) {
        return m instanceof Nothing;
    }

    orJust<B>(f: () => B): Maybe<B> {
        return new Just(f());
    }

    orElse<B>(f: () => Maybe<B>): Maybe<B> {
        return f();
    }

    isNothing(): boolean {
        return true;
    }

    isJust(): boolean {
        return false;
    }

    get(): A {
        throw new TypeError('Cannot get a value from Nothing!');
    }
}

/**
 * Just represents the presence of a usable value.
 */
export class Just<A> extends Maybe<A> {
    constructor(public value: A) {
        super();
    }

    map<B>(f: (a: A) => B): Maybe<B> {
        return new Just(f(this.value));
    }

    ap<B>(mb: Maybe<(a: A) => B>): Maybe<B> {
        return <Maybe<B>>mb.map(f => f(this.value));
    }

    of(a: A): Maybe<A> {
        return Maybe.of(a);
    }

    chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
        return f(this.value);
    }

    alt(_: Maybe<A>): Maybe<A> {
        return this;
    }

    extend<B>(f: (ex: Maybe<A>) => B): Maybe<B> {
        return new Just(f(this));
    }

    eq(m: Maybe<A>): boolean {
        return m instanceof Just && m.value === this.value;
    }

    orJust<B>(_: (a: A) => B): Maybe<A> {
        return this;
    }

    orElse<B>(_: (a: A) => B): Maybe<A> {
        return this;
    }

    isNothing(): boolean {
        return false;
    }

    isJust(): boolean {
        return true;
    }

    get(): A {
        return this.value;
    }
}

export const nothing = Maybe.nothing;

export const just = Maybe.just;

export const fromNullable = Maybe.fromNullable;

export const fromArray = Maybe.fromArray;

export const fromObject = Maybe.fromObject;

export const fromString = Maybe.fromString;

export const fromBoolean = Maybe.fromBoolean;

export const fromNumber = Maybe.fromNumber;

export const fromNaN = Maybe.fromNumber;
