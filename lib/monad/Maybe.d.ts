import { Monad } from './Monad';
import { Either } from './Either';
/**
 * just wraps a value in a Just
 */
export declare const just: <A>(a: A) => Maybe<A>;
/**
 * nothing constructs nothing
 */
export declare const nothing: <A>() => Nothing<A>;
/**
 * fromAny constructs a Maybe from a value that may be null.
 */
export declare const fromAny: <A>(a: A) => Maybe<A>;
/**
 * fromArray checks an array to see if it's empty (or full of nulls)
 * and returns a Maybe.
 */
export declare const fromArray: <A>(a: A[]) => Maybe<A[]>;
/**
 * fromOBject uses Object.keys to turn see if an object has any own properties.
 */
export declare const fromObject: <A>(o: A) => Maybe<A>;
/**
 * fromString constructs nothing if the string is empty or just otherwise.
 */
export declare const fromString: (s: string) => Maybe<string>;
/**
 * fromBoolean constructs nothing if b is false, just otherwise
 */
export declare const fromBoolean: (b: boolean) => Maybe<boolean>;
/**
 * fromNumber constructs nothing if n is 0 just otherwise.
 */
export declare const fromNumber: (n: number) => Maybe<number>;
/**
 * Maybe
 */
export declare abstract class Maybe<A> implements Monad<A> {
    static just: <A>(a: A) => Maybe<A>;
    static nothing: <A>() => Nothing<A>;
    static fromAny: <A>(a: A) => Maybe<A>;
    static fromObject: <A>(o: A) => Maybe<A>;
    static fromArray: <A>(a: A[]) => Maybe<A[]>;
    static fromString: (s: string) => Maybe<string>;
    static fromBoolean: (b: boolean) => Maybe<boolean>;
    of(a: A): Maybe<A>;
    abstract map<B>(_: (a: A) => B): Maybe<B>;
    abstract chain<B>(_: (a: A) => Maybe<B>): Maybe<B>;
    abstract get(): A;
    abstract orElse<B>(f: () => Maybe<B>): Maybe<B>;
    abstract orJust<B>(f: () => B): Maybe<B>;
    abstract cata<C>(f: () => C, _g: (a: A) => C): C;
    abstract toEither(): Either<undefined, A>;
}
/**
 * Nothing
 */
export declare class Nothing<A> extends Maybe<A> {
    map<B>(_: (a: A) => B): Maybe<B>;
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
    toEither(): Either<undefined, A>;
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
    toEither(): Either<undefined, A>;
}
