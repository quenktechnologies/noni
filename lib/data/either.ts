import { Functor } from './functor';
import { Apply } from '../control/apply';
import { Alt } from '../control/alt';
import { Chain } from '../control/chain';
import { Monad } from '../control/monad';
import { Extend } from '../control/extend';
import { Eq } from './eq';

/**
 * Either represents a value that may be one of two types.
 *
 * An Either is either a Left or Right. Mapping and related functions over the 
 * Left side returns the value unchanged. When the value is Right
 * functions are applied as normal.
 *
 * The Either concept is often used to accomodate error handling but there
 * are other places it may come in handy.
 */
export interface Either<L, R> extends
    Functor<R>,
    Apply<R>,
    Alt<R>,
    Chain<R>,
    Monad<R>,
    Extend<R>,
    Eq<Either<L, R>> {

    /**
     * orElse allows an alternative to be produced from a function
     * when the Either is Left.
     */
    orElse(_: (l: L) => Either<L, R>): Either<L, R>

    /**
     * orRight allows an alternative value to be produced from 
     * a function when the Either is Right.
     */
    orRight(_: (l: L) => R): Either<L, R>

    /**
     * takeLeft extracts the value from the Left side.
     */
    takeLeft(): L

    /**
     * takeRight extracts the value from the Right side.
     *
     * Will throw an error if the value is not Right.
     */
    takeRight(): R

}

/**
 * Left side of the Either implementation.
 */
export class Left<L, R> implements Either<L, R> {

    constructor(public value: L) { }

    of(value: R): Either<L, R> {

        return new Right<L, R>(value);

    }

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

    empty(): Either<L, R> {

        return new Left<L, R>(this.value);

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

}

/**
 * Right side implementation.
 */
export class Right<L, R> implements Either<L, R>  {

    constructor(public value: R) { }

    of(value: R) {

        return new Right<L, R>(value);

    }

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

}

/**
 * left constructor helper.
 */
export const left = <A, B>(a: A) => new Left<A, B>(a);

/**
 * right constructor helper.
 */
export const right = <A, B>(b: B) => new Right<A, B>(b);

/**
 * fromBoolean constructs an Either using a boolean value.
 */
export const fromBoolean = (b: boolean): Either<boolean, boolean> =>
    b ? right<boolean, boolean>(true) : left<boolean, boolean>(false);

