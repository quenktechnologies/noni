/**
 * Either represents a value that may be one of two types.
 *
 * An Either is either a Left or Right. Mapping and related functions over the
 * Left side returns the value unchanged. When the value is Right
 * functions are applied as normal.
 *
 * The Either concept is often used to accomodate error handling but there
 * are other places it may come in handy.
 *
 * An important point to note when using this type is that the left side
 * remains the same while chaining. That means, the types Either<number, string>
 * and Either<boolean, string> are two different types that can not be sequenced
 * together via map,chain etc.
 *
 * This turns up compiler errors in unexpected places and is sometimes rectified
 * by extracting the values out of the Either type completley and constructing
 * a fresh one.
 */
/** imports */
import { Functor } from './functor';
import { Apply } from '../control/apply';
import { Alt } from '../control/alt';
import { Chain } from '../control/chain';
import { Monad } from '../control/monad';
import { Extend } from '../control/extend';
import { Eq } from './eq';
import { Maybe } from './maybe';
/**
 * The abstract Either class.
 *
 * This is the type that will be used in signatures.
 */
export declare abstract class Either<L, R> implements Functor<R>, Apply<R>, Alt<R>, Chain<R>, Monad<R>, Extend<R>, Eq<Either<L, R>> {
    of(value: R): Either<L, R>;
    abstract map<B>(_: (r: R) => B): Either<L, B>;
    abstract lmap<B>(f: (l: L) => B): Either<B, R>;
    abstract bimap<A, B>(f: (l: L) => A, g: (r: R) => B): Either<A, B>;
    abstract alt(a: Either<L, R>): Either<L, R>;
    abstract chain<B>(f: (r: R) => Either<L, B>): Either<L, B>;
    abstract ap<B>(e: Either<L, (r: R) => B>): Either<L, B>;
    abstract extend<B>(f: (_: Either<L, R>) => B): Either<L, B>;
    abstract fold<B>(f: (l: L) => B, g: (r: R) => B): B;
    abstract eq(m: Either<L, R>): boolean;
    /**
     * orElse allows an alternative to be produced from a function
     * when the Either is Left.
     */
    abstract orElse(_: (l: L) => Either<L, R>): Either<L, R>;
    /**
     * orRight allows an alternative value to be produced from
     * a function when the Either is Right.
     */
    abstract orRight(_: (l: L) => R): Either<L, R>;
    /**
     * takeLeft extracts the value from the Left side.
     */
    abstract takeLeft(): L;
    /**
     * takeRight extracts the value from the Right side.
     *
     * Will throw an error if the value is not Right.
     */
    abstract takeRight(): R;
    /**
     * toMaybe transformation.
     */
    abstract toMaybe(): Maybe<R>;
}
/**
 * Left side of the Either implementation.
 */
export declare class Left<L, R> extends Either<L, R> {
    value: L;
    constructor(value: L);
    map<B>(_: (r: R) => B): Either<L, B>;
    lmap<B>(f: (l: L) => B): Either<B, R>;
    bimap<A, B>(f: (l: L) => A, _: (r: R) => B): Either<A, B>;
    alt(a: Either<L, R>): Either<L, R>;
    chain<B>(_: (r: R) => Either<L, B>): Either<L, B>;
    ap<B>(_: Either<L, (r: R) => B>): Either<L, B>;
    extend<B>(_: (_: Either<L, R>) => B): Either<L, B>;
    fold<B>(f: (l: L) => B, _: (r: R) => B): B;
    eq(m: Either<L, R>): boolean;
    orElse<B>(f: (l: L) => Either<L, B>): Either<L, B>;
    orRight(f: (l: L) => R): Either<L, R>;
    takeLeft(): L;
    takeRight(): R;
    toMaybe(): Maybe<R>;
}
/**
 * Right side implementation.
 */
export declare class Right<L, R> extends Either<L, R> {
    value: R;
    constructor(value: R);
    map<B>(f: (r: R) => B): Either<L, B>;
    lmap<B>(_: (l: L) => B): Either<B, R>;
    bimap<A, B>(_: (l: L) => A, g: (r: R) => B): Either<A, B>;
    alt(_: Either<L, R>): Either<L, R>;
    chain<B>(f: (r: R) => Either<L, B>): Either<L, B>;
    ap<B>(e: Either<L, (r: R) => B>): Either<L, B>;
    extend<B>(f: (ex: Either<L, R>) => B): Either<L, B>;
    eq(m: Either<L, R>): boolean;
    fold<B>(_: (l: L) => B, g: (r: R) => B): B;
    orElse(_: (l: L) => Either<L, R>): Either<L, R>;
    orRight(_: (l: L) => R): Either<L, R>;
    takeLeft(): L;
    takeRight(): R;
    toMaybe(): Maybe<R>;
}
/**
 * left constructor helper.
 */
export declare const left: <A, B>(a: A) => Either<A, B>;
/**
 * right constructor helper.
 */
export declare const right: <A, B>(b: B) => Either<A, B>;
/**
 * fromBoolean constructs an Either using a boolean value.
 */
export declare const fromBoolean: (b: boolean) => Either<boolean, boolean>;
/**
 * either given two functions, first for Left, second for Right, will return
 * the result of applying the appropriate function to an Either's internal value.
 */
export declare const either: <A, B, C>(f: (a: A) => C) => (g: (b: B) => C) => (e: Either<A, B>) => C;
