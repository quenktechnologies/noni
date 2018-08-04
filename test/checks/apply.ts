import { Apply } from '../../src/control/apply';

type F<A> = (a: A) => A;

export type Eq<A> = (f: Apply<A>) => (g: Apply<A>) => boolean;

/**
 * composition law.
 *
 * Apply a, b, c => a.ap(b.ap(c.map(f => g => x => f(g(x))))) = a.ap(b).ap(c)
 *
 */
export const composition =
  <A>(pure: <X>(x: X) => Apply<X>) => (eq: Eq<A>) => (f: F<A>) => 
  (g: F<A>) =>      (x: A) => {

            let a = pure(x);
            let b: Apply<F<A>> = pure(f);
            let c: Apply<F<A>> = pure(g);

            let l = a.ap(b.ap(
                <Apply<(a: F<A>) => (x: A) => A>>c
              .map(f => (g:(x:A)=>A) => (x: A) => f(g(x)))));

            let r = a.ap(b).ap(c);

            return (eq(l)(r));

        }
