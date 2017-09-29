import { Monad } from '../monad/Monad';

/**
 * left wraps a value on the left side.
 */
export const left = <A, B>(a: A) => new Left<A, B>(a);

/**
 * right wraps a value on the right side.
 */
export const right = <A, B>(b: B) => new Right<A, B>(b);

/**
 * fromBoolean constructs an Either using a boolean value.
 */
export const fromBoolean = (b: boolean): Either<boolean, boolean> =>
    b ? right<boolean, boolean>(true) : left<boolean, boolean>(false);

/**
 * Either monad implementation
 */
export abstract class Either<L, R> implements Monad<R> {

    static left = left;
    static right = right;
    static fromBoolean = fromBoolean;

    of(v: R): Either<L, R> {

        return new Right<L, R>(v);

    }

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

export class Left<L, R> extends Either<L, R> {

    constructor(public l: L) { super(); }

    map<B>(_: (r: R) => B): Either<L, B> {

        return new Left<L, B>(this.l);

    }

    mapLeft<B>(f: (l: L) => B): Either<B, R> {

        return new Left<B, R>(f(this.l));

    }

    bimap<LL, RR>(f: (l: L) => LL, _: (r: R) => RR): Either<LL, RR> {

        return left<LL, RR>(f(this.l));

    }

    chain<B>(_: (r: R) => Either<L, B>): Either<L, B> {

        return new Left<L, B>(this.l);

    }

    orElse<B>(f: (l: L) => Either<L, B>): Either<L, B> {

        return f(this.l);
    }

    orRight(f: (l: L) => R): Either<L, R> {

        return new Right<L, R>(f(this.l));

    }

    ap<B>(_: Either<L, (r: R) => B>): Either<L, B> {

        return new Left<L, B>(this.l);
    }

    takeLeft(): L {

        return this.l;

    }

    takeRight(): R {

        throw new TypeError(`Not right!`);
    }

    cata<B>(f: (l: L) => B, _: (r: R) => B): B {

        return f(this.l);

    }

}

export class Right<L, R> extends Either<L, R>  {

    constructor(public r: R) { super(); }

    map<B>(f: (r: R) => B): Either<L, B> {

        return new Right<L, B>(f(this.r));

    }

    mapLeft<B>(_: (l: L) => B): Either<B, R> {

        return new Right<B, R>(this.r);

    }

    bimap<LL, RR>(_: (l: L) => LL, g: (r: R) => RR): Either<LL, RR> {

        return right<LL, RR>(g(this.r));

    }

    chain<B>(f: (r: R) => Either<L, B>): Either<L, B> {

        return f(this.r);

    }

    /**
     * orElse returns the result of f if the Either is left.
     */
    orElse(_: (l: L) => Either<L, R>): Either<L, R> {

        return this;

    }

    orRight(_: (l: L) => R): Either<L, R> {

        return this;

    }

    /**
     * ap
     */
    ap<B>(e: Either<L, (r: R) => B>): Either<L, B> {

        return e.map(f => f(this.r));

    }

    /**
      * takeLeft extracts the left value of an Either, throwing an error if the Either is right.
      */
    takeLeft(): L {

        throw new TypeError(`Not left!`);

    }

    takeRight(): R {

        return this.r;

    }

    /**
     * cata
     */
    cata<B>(_: (l: L) => B, g: (r: R) => B): B {

        return g(this.r);

    }

}


