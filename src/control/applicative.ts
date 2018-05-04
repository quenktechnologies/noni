import {Apply} from './apply';

/**
 * Applicative extends Apply by including a method
 * for "lifting" a value into an Applicative.
 */
export interface Applicative<A> extends Apply<A> {

    /**
     * of (return/pure).
     */
    of(a: A): Applicative<A>;

}
