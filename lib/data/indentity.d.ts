import { Alt } from '../control/alt';
import { Eq } from '../data/eq';
import { Applicative } from '../control/applicative';
import { Monad } from '../control/monad';
/**
 * Identity monad.
 *
 * This class is here mostly for future iterations of this libary.
 * The Identity class typically returns the value supplied for most of its
 * operations.
 */
export declare class Identity<A> implements Alt<A>, Applicative<A>, Monad<A>, Eq<Identity<A>> {
    value: A;
    constructor(value: A);
    /**
     * of
     */
    of(a: A): Identity<A>;
    /**
     * map
     */
    map<B>(f: (a: A) => B): Identity<B>;
    /**
     * chain
     */
    chain<B>(f: (a: A) => Identity<B>): Identity<B>;
    /**
     * ap
     */
    ap<B>(i: Identity<(a: A) => B>): Identity<B>;
    /**
     * alt will prefer whatever Maybe instance provided.
     */
    alt(a: Identity<A>): Identity<A>;
    /**
     * eq
     */
    eq(i: Identity<A>): boolean;
}
