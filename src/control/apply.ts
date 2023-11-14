import { Functor } from "../data/functor";

/**
 * Apply a function to an argument inside a constructor.
 */
export interface Apply<A> extends Functor<A> {
  /**
   * ap (apply).
   */
  ap<B>(b: Apply<(a: A) => B>): Apply<B>;
}
