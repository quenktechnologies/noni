/**
 * Bifunctor allows map functions to be applied to type that consits of
 * two types.
 *
 * See https://en.wikipedia.org/wiki/Functor#Bifunctors_and_multifunctors
 * for a detailed explanation.
 */
export interface Bifunctor<A, B> {
  /**
   * bimap applies f when the left type or g when the right type.
   */
  bimap<C, D>(f: (a: A) => C, g: (b: B) => C): Bifunctor<C, D>;

  /**
   * lmap maps over the left type if the value is the correct type.
   */
  lmap<C>(f: (a: A) => B): Bifunctor<C, B>;
}
