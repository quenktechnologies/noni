import { Apply } from "./apply";

/**
 * ChainFunc function type.
 */
export type ChainFunc<A, B> = (a: A) => Chain<B>;

/**
 * Chain extends Apply to provide the "chain" method
 * for sequencing computations.
 */
export interface Chain<A> extends Apply<A> {
  /**
   * chain (bind/flatMap/>>=).
   */
  chain<B>(f: ChainFunc<A, B>): Chain<B>;
}
