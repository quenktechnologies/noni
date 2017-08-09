import { Monad } from '../monad/Monad';

/**
 * left wraps a value on the left side.
 */
export const left = <A, B>(v: A) => new Left<A, B>(v);

/**
 * right wraps a value on the right side.
 */
export const right = <A, B>(v: B) => new Right<A, B>(v);

/**
 * fromBoolean constructs an Either using a boolean value.
 */
export const fromBoolean = (b: boolean): Either<boolean, boolean> => b ? right(true) : left(false);

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

export class Left<L, R> extends Either<L, R> {

    constructor(public l: L) { super(); }

    map<B>(_: (r: R) => B): Either<L, B> {

        return <any>this;

    }

    bimap<LL, RR>(f: (l: L) => LL, _: (r: R) => RR): Either<LL, RR> {

        return left<LL, RR>(f(this.l));

    }

    chain<B>(_: (r: R) => Either<L, B>): Either<L, B> {

        return <any>this;

    }

    join(): Either<L, R> {

        return this;

    }

    orElse<B>(f: (l: L) => Either<L, B>): Either<L, B> {

        return f(this.l);
    }

    ap<B>(_: Either<L, (r: R) => B>): Either<L, B> {

        return <any>this;
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

        return new Right(f(this.r));


    }

    bimap<LL, RR>(_: (l: L) => LL, g: (r: R) => RR): Either<LL, RR> {

        return right<LL, RR>(g(this.r));

    }

    chain<B>(f: (r: R) => Either<L, B>): Either<L, B> {

        return (<any>this.r).map(f).join();

    }

    join(): Either<L, R> {

        return <any>this.r;

    }

    /**
     * orElse returns the result of f if the Either is left.
     */
    orElse<B>(_: (l: L) => Either<L, B>): Either<L, B> {

        return <any>this;

    }

    /**
     * ap
     */
    ap<B>(e: Either<L, (r: R) => B>): Either<L, B> {

        return e.map(f => f((<any>this).r));

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


