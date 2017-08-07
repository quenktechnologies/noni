import { Monad } from './Monad';
/**
 * Maybe
 */
export declare abstract class Maybe<A> implements Monad<A> {
    of(a: A): Maybe<A>;
    map<B>(_: (a: A) => B): Maybe<B>;
    join(): A;
    chain<B>(_: (a: A) => Maybe<B>): Maybe<B>;
    get(): A;
    orElse<B>(f: () => Maybe<B>): Maybe<B>;
    /**
     * orJust will turn Nothing into Just, wrapping the value specified.
     */
    orJust<B>(f: () => B): Maybe<B>;
    /**
     * cata applies the corresponding function to the Maybe
     */
    cata<C>(f: () => C, _g: (a: A) => C): C;
}
/**
 * Nothing
 */
export declare class Nothing<A> extends Maybe<A> {
}
/**
 * Just
 */
export declare class Just<A> extends Maybe<A> {
    a: A;
    constructor(a: A);
    map<B>(f: (a: A) => B): Maybe<B>;
    join(): A;
    chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
    get(): A;
    orElse<B>(_f: () => Maybe<B>): Maybe<B>;
    orJust<B>(_f: () => B): Maybe<B>;
    cata<C>(_f: () => C, g: (a: A) => C): C;
}
/**
 * just wraps a value in a Just
 */
export declare const just: <A>(a: A) => Maybe<A>;
/**
 * nothing constructs nothing
 */
export declare const nothing: () => Nothing<void>;
/**
 * fromAny constructs a Maybe from a value that may be null.
 */
export declare const fromAny: <A>(a: A) => Maybe<A>;
