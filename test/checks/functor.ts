import { Functor } from '../../src/data/functor';

export type Eq<A> = (f: Functor<A>) => (g: Functor<A>) => boolean;

/**
 * identity Law: 
 *
 * Functor f => f.map(x=>x) = f
 */
export const identity =
    <A>(pure: <X>(x: X) => Functor<X>) => (eq: Eq<A>) => (a: A) =>
        (eq(pure(a).map(x => x))(pure(a)));

/**
 * composition law.
 *
 * Functor u => u.map(x => f(g(x))) = u.map(g).map(f)
 *
 */
export const composition = <A>(pure: <X>(x: X) => Functor<X>) => (eq: Eq<A>) =>
    (f: (a: A) => A) => (g: (a: A) => A) => (x: A) => {

        let a = pure(x).map(x => f(g(x)));
        let b = pure(x).map(g).map(f);
        return (eq(a)(b));

    }

