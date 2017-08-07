import { Monad } from '../monad/Monad';
/**
 * Either monad implementation
 */
export declare abstract class Either<L, R> implements Monad<R> {
    of(v: R): Either<L, R>;
    abstract map<B>(f: (r: R) => B): Either<L, B>;
    abstract bimap<LL, RR>(f: (l: L) => LL, g: (r: R) => RR): Either<LL, RR>;
    /**
     * chain
     */
    abstract chain<B>(f: (r: R) => Either<L, B>): Either<L, B>;
    /**
     * join an inner monad value to the outer.
     */
    abstract join(): Either<L, R>;
    /**
     * orElse returns the result of f if the Either is left.
     */
    abstract orElse<B>(f: (l: L) => Either<L, B>): Either<L, B>;
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
    bimap<LL, RR>(f: (l: L) => LL, _: (r: R) => RR): Either<LL, RR>;
    chain<B>(_: (r: R) => Either<L, B>): Either<L, B>;
    join(): Either<L, R>;
    orElse<B>(f: (l: L) => Either<L, B>): Either<L, B>;
    ap<B>(_: Either<L, (r: R) => B>): Either<L, B>;
    takeLeft(): L;
    takeRight(): R;
    cata<B>(f: (l: L) => B, _: (r: R) => B): B;
}
export declare class Right<L, R> extends Either<L, R> {
    r: R;
    constructor(r: R);
    map<B>(f: (r: R) => B): Either<L, B>;
    bimap<LL, RR>(_: (l: L) => LL, g: (r: R) => RR): Either<LL, RR>;
    chain<B>(f: (r: R) => Either<L, B>): Either<L, B>;
    join(): Either<L, R>;
    /**
     * orElse returns the result of f if the Either is left.
     */
    orElse<B>(_: (l: L) => Either<L, B>): Either<L, B>;
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
/**
 * left wraps a value on the left side.
 */
export declare const left: <A, B>(v: A) => Left<A, B>;
/**
 * right wraps a value on the right side.
 */
export declare const right: <A, B>(v: B) => Right<A, B>;
