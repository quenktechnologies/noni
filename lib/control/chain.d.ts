import { Apply } from './apply';
/**
 * Chain extends Apply to provide the "chain" method
 * for sequencing computations.
 */
export interface Chain<A> extends Apply<A> {
    /**
     * chain (bind/flatMap/>>=).
     */
    chain<B>(f: (a: A) => Chain<B>): Chain<B>;
}
