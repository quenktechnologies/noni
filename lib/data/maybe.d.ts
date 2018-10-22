import { Monad } from '../control/monad';
import { Alt } from '../control/alt';
import { Plus } from '../control/plus';
import { Alternative } from '../control/alternative';
import { Extend } from '../control/extend';
import { Eq } from './eq';
/**
 * Maybe monad represents an optional or nullable value.
 */
export interface Maybe<A> extends Monad<A>, Alt<A>, Plus<A>, Alternative<A>, Extend<A>, Eq<Maybe<A>> {
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
    orJust<B>(_f: () => B): Maybe<A> | Maybe<B>;
    /**
     * orElse allows for an alternative Maybe value to
     * be provided when Nothing<A> but using a function.
     */
    orElse<B>(_f: () => Maybe<B>): Maybe<A> | Maybe<B>;
    /**
     * get the value from a Maybe.
     */
    get(): A;
}
/**
 * Nothing represents the absence of a usable value.
 */
export declare class Nothing<A> implements Maybe<A> {
    /**
     * map simply returns a Nothing<A>
     */
    map<B>(_: (a: A) => B): Maybe<B>;
    /**
     * ap allows for a function wrapped in a Just to apply
     * to value present in this Just.
     */
    ap<B>(_: Maybe<(a: A) => B>): Maybe<B>;
    /**
     * of wraps a value in a Just.
     */
    of(a: A): Maybe<A>;
    /**
     * chain simply returns a Nothing<A>.
     */
    chain<B>(_: (a: A) => Maybe<B>): Maybe<B>;
    /**
     * alt will prefer whatever Maybe instance provided.
     */
    alt(a: Maybe<A>): Maybe<A>;
    /**
     * empty provides a default Maybe.
     * Maybe.empty() = new Nothing()
     */
    empty(): Maybe<A>;
    /**
     * extend returns a Nothing<A>.
     */
    extend<B>(_: (ex: Maybe<A>) => B): Maybe<B>;
    /**
     * eq returns true if compared to another Nothing instance.
     */
    eq(m: Maybe<A>): boolean;
    /**
     * orJust converts a Nothing<A> to a Just
     * using the value from the provided function.
     */
    orJust<B>(f: () => B): Maybe<B>;
    /**
     * orElse allows an alternative Maybe value
     * to be provided since this one is Nothing<A>.
     */
    orElse<B>(f: () => Maybe<B>): Maybe<B>;
    /**
     * get throws an error because there
     * is nothing here to get.
     */
    get(): A;
}
/**
 * Just represents the presence of a usable value.
 */
export declare class Just<A> implements Maybe<A> {
    value: A;
    constructor(value: A);
    /**
     * map over the value present in the Just.
     */
    map<B>(f: (a: A) => B): Maybe<B>;
    /**
     * ap allows for a function wrapped in a Just to apply
     * to value present in this Just.
     */
    ap<B>(mb: Maybe<(a: A) => B>): Maybe<B>;
    /**
     * of wraps a value in a Just.
     */
    of(a: A): Maybe<A>;
    /**
     * chain allows the sequencing of functions that return a Maybe.
     */
    chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
    /**
     * alt will prefer the first Just encountered (this).
     */
    alt(_: Maybe<A>): Maybe<A>;
    /**
     * empty provides a default Maybe.
     * Maybe.empty() = new Nothing()
     */
    empty(): Maybe<A>;
    /**
     * extend allows sequencing of Maybes with
     * functions that unwrap into non Maybe types.
     */
    extend<B>(f: (ex: Maybe<A>) => B): Maybe<B>;
    /**
     * eq tests the value of two Justs.
     */
    eq(m: Maybe<A>): boolean;
    /**
     * orJust returns this Just.
     */
    orJust<B>(_: (a: A) => B): Maybe<A>;
    /**
     * orElse returns this Just
     */
    orElse<B>(_: (a: A) => B): Maybe<A>;
    /**
     * get the value of this Just.
     */
    get(): A;
}
/**
 * of
 */
export declare const of: <A>(a: A) => Just<A>;
/**
 * nothing convenience constructor
 */
export declare const nothing: <A>() => Nothing<A>;
/**
 * just convenience constructor
 */
export declare const just: <A>(a: A) => Just<A>;
/**
 * fromNullable constructs a Maybe from a value that may be null.
 */
export declare const fromNullable: <A>(a: A) => Maybe<A>;
/**
 * fromArray checks an array to see if it's empty
 *
 * Returns [[Nothing]] if it is, [[Just]] otherwise.
 */
export declare const fromArray: <A>(a: A[]) => Maybe<A[]>;
/**
 * fromObject uses Object.keys to turn see if an object
 * has any own properties.
 */
export declare const fromObject: <A>(o: A) => Maybe<A>;
/**
 * fromString constructs Nothing<A> if the string is empty or Just<A> otherwise.
 */
export declare const fromString: (s: string) => Maybe<string>;
/**
 * fromBoolean constructs Nothing if b is false, Just<A> otherwise
 */
export declare const fromBoolean: (b: boolean) => Maybe<boolean>;
/**
 * fromNumber constructs Nothing if n is 0 Just<A> otherwise.
 */
export declare const fromNumber: (n: number) => Maybe<number>;
/**
 * fromNaN constructs Nothing if a value is not a number or
 * Just<A> otherwise.
 */
export declare const fromNaN: (n: number) => Maybe<number>;
