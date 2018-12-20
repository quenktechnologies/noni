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
import { Maybe, nothing, just } from './maybe';

/**
 * The abstract Either class.
 *
 * This is the type that will be used in signatures.
 */
export abstract class Either<L, R> implements
    Functor<R>,
    Apply<R>,
    Alt<R>,
    Chain<R>,
    Monad<R>,
    Extend<R>,
    Eq<Either<L, R>> {

    of(value: R): Either<L, R> {

        return new Right<L, R>(value);

    }

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
    abstract orElse(_: (l: L) => Either<L, R>): Either<L, R>

    /**
     * orRight allows an alternative value to be produced from 
     * a function when the Either is Right.
     */
    abstract orRight(_: (l: L) => R): Either<L, R>

    /**
     * takeLeft extracts the value from the Left side.
     */
    abstract takeLeft(): L

    /**
     * takeRight extracts the value from the Right side.
     *
     * Will throw an error if the value is not Right.
     */
    abstract takeRight(): R

    /**
     * toMaybe transformation.
     */
    abstract toMaybe(): Maybe<R>;

}

/**
 * Left side of the Either implementation.
 */
export class Left<L, R> extends Either<L, R> {

    constructor(public value: L) { super(); }

    map<B>(_: (r: R) => B): Either<L, B> {

        return new Left<L, B>(this.value);

    }

    lmap<B>(f: (l: L) => B): Either<B, R> {

        return new Left<B, R>(f(this.value));

    }

    bimap<A, B>(f: (l: L) => A, _: (r: R) => B): Either<A, B> {

        return new Left<A, B>(f(this.value));

    }

    alt(a: Either<L, R>): Either<L, R> {

        return a;

    }

    chain<B>(_: (r: R) => Either<L, B>): Either<L, B> {

        return new Left<L, B>(this.value);

    }

    ap<B>(_: Either<L, (r: R) => B>): Either<L, B> {

        return new Left<L, B>(this.value);
    }

    extend<B>(_: (_: Either<L, R>) => B): Either<L, B> {

        return new Left<L, B>(this.value);

    }

    fold<B>(f: (l: L) => B, _: (r: R) => B): B {

        return f(this.value);

    }

    eq(m: Either<L, R>): boolean {

        return ((m instanceof Left) && (m.value === this.value));

    }

    orElse<B>(f: (l: L) => Either<L, B>): Either<L, B> {

        return f(this.value);
    }

    orRight(f: (l: L) => R): Either<L, R> {

        return new Right<L, R>(f(this.value));

    }

    takeLeft(): L {

        return this.value;

    }

    takeRight(): R {

        throw new TypeError(`Not right!`);
    }

    toMaybe(): Maybe<R> {

        return nothing();

    }

}

/**
 * Right side implementation.
 */
export class Right<L, R> extends Either<L, R>  {

    constructor(public value: R) { super(); }

    map<B>(f: (r: R) => B): Either<L, B> {

        return new Right<L, B>(f(this.value));

    }

    lmap<B>(_: (l: L) => B): Either<B, R> {

        return new Right<B, R>(this.value);

    }

    bimap<A, B>(_: (l: L) => A, g: (r: R) => B): Either<A, B> {

        return new Right<A, B>(g(this.value));

    }

    alt(_: Either<L, R>): Either<L, R> {

        return this;

    }

    chain<B>(f: (r: R) => Either<L, B>): Either<L, B> {

        return f(this.value);

    }

    ap<B>(e: Either<L, (r: R) => B>): Either<L, B> {

        return <Either<L, B>>e.map(f => f(this.value));

    }

    extend<B>(f: (ex: Either<L, R>) => B): Either<L, B> {

        return new Right<L, B>(f(this));

    }

    eq(m: Either<L, R>): boolean {

        return ((m instanceof Right) && (m.value === this.value));

    }

    fold<B>(_: (l: L) => B, g: (r: R) => B): B {

        return g(this.value);

    }

    orElse(_: (l: L) => Either<L, R>): Either<L, R> {

        return this;

    }

    orRight(_: (l: L) => R): Either<L, R> {

        return this;

    }

    takeLeft(): L {

        throw new TypeError(`Not left!`);

    }

    takeRight(): R {

        return this.value;

    }

    toMaybe(): Maybe<R> {

        return just(this.value);

    }

}

/**
 * left constructor helper.
 */
export const left = <A, B>(a: A) : Either<A,B> => new Left<A, B>(a);

/**
 * right constructor helper.
 */
export const right = <A, B>(b: B) : Either<A,B> => new Right<A, B>(b);

/**
 * fromBoolean constructs an Either using a boolean value.
 */
export const fromBoolean = (b: boolean): Either<boolean, boolean> =>
    b ? right<boolean, boolean>(true) : left<boolean, boolean>(false);

/**
 * either given two functions, first for Left, second for Right, will return
 * the result of applying the appropriate function to an Either's internal value.
 */
export const either =
    <A, B, C>(f: (a: A) => C) => (g: (b: B) => C) => (e: Either<A, B>) : C =>
        (e instanceof Right) ? g(e.takeRight()) : f(e.takeLeft())
