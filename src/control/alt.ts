import { Functor } from '../data/functor';

/**
 * Alt interface.
 */
export interface Alt<A> extends Functor<A> {
    /**
     * alt (<|>)
     */
    alt(a: Alt<A>): Alt<A>;
}
