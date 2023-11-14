/**
 * Functor is any class that supports a map operation.
 *
 * Functors allow a computational context to be retained while
 * modifying some underlying value.
 */
export interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>;
}
