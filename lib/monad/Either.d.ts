import { Monad } from '../monad/Monad';
/**
 * left wraps a value on the left side.
 */
export declare const left: <A, B>(a: A) => Left<A, B>;
/**
 * right wraps a value on the right side.
 */
export declare const right: <A, B>(b: B) => Right<A, B>;
/**
 * fromBoolean constructs an Either using a boolean value.
 */
export declare const fromBoolean: (b: boolean) => Either<boolean, boolean>;
/**
 * Either monad implementation
 */
export declare abstract class Either<L, R> implements Monad<R> {
    static left: <A, B>(a: A) => Left<A, B>;
    static right: <A, B>(b: B) => Right<A, B>;
    static fromBoolean: (b: boolean) => Either<boolean, boolean>;
    of(v: R): Either<L, R>;
    abstract map<B>(f: (r: R) => B): Either<L, B>;
    abstract mapLeft<B>(f: (l: L) => B): Either<B, R>;
    abstract bimap<LL, RR>(f: (l: L) => LL, g: (r: R) => RR): Either<LL, RR>;
    /**
     * chain
     */
    abstract chain<B>(f: (r: R) => Either<L, B>): Either<L, B>;
    /**
     * orElse returns the result of f if the Either is left.
     */
    abstract orElse(f: (l: L) => Either<L, R>): Either<L, R>;
    /**
     * orRight is like orElse except it just expects the value
     */
    abstract orRight(f: (l: L) => R): Either<L, R>;
    /**
     * ap
     */
    abstract ap<B>(e: Either<L, (r: R) => B>): Either<L, B>;
    /**
      * takeLeft extracts the left value of an Either, throwing an error if the Either is right.
      */
    abstract takeLeft(): L;
    /**
     * takeRight is the opposite of left
     * @summary Either<A,B> →  B|Error
     */
    abstract takeRight(): R;
    /**
     * cata
     */
    abstract cata<B>(f: (l: L) => B, g: (r: R) => B): B;
}
export declare class Left<L, R> extends Either<L, R> {
    l: L;
    constructor(l: L);
    map<B>(_: (r: R) => B): Either<L, B>;
    mapLeft<B>(f: (l: L) => B): Either<B, R>;
    bimap<LL, RR>(f: (l: L) => LL, _: (r: R) => RR): Either<LL, RR>;
    chain<B>(_: (r: R) => Either<L, B>): Either<L, B>;
    orElse<B>(f: (l: L) => Either<L, B>): Either<L, B>;
    orRight(f: (l: L) => R): Either<L, R>;
    ap<B>(_: Either<L, (r: R) => B>): Either<L, B>;
    takeLeft(): L;
    takeRight(): R;
    cata<B>(f: (l: L) => B, _: (r: R) => B): B;
}
export declare class Right<L, R> extends Either<L, R> {
    r: R;
    constructor(r: R);
    map<B>(f: (r: R) => B): Either<L, B>;
    mapLeft<B>(_: (l: L) => B): Either<B, R>;
    bimap<LL, RR>(_: (l: L) => LL, g: (r: R) => RR): Either<LL, RR>;
    chain<B>(f: (r: R) => Either<L, B>): Either<L, B>;
    /**
     * orElse returns the result of f if the Either is left.
     */
    orElse(_: (l: L) => Either<L, R>): Either<L, R>;
    orRight(_: (l: L) => R): Either<L, R>;
    /**
     * ap
     */
    ap<B>(e: Either<L, (r: R) => B>): Either<L, B>;
    /**
      * takeLeft extracts the left value of an Either, throwing an error if the Either is right.
      */
    takeLeft(): L;
    takeRight(): R;
    /**
     * cata
     */
    cata<B>(_: (l: L) => B, g: (r: R) => B): B;
}
