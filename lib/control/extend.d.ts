import { Functor } from '../data/functor';
/**
 * Extend is the dual of Chain.
 */
export interface Extend<A> extends Functor<A> {
    /**
     * extend (<<=).
     */
    extend<B>(f: (ex: Extend<A>) => B): Extend<B>;
}
