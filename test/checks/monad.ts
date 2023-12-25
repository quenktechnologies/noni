import { Monad } from '../../src/control/monad';

export type Eq = (m: any) => (g: any) => any;

/**
 * leftIdentity
 *
 * Monad m => m.of(a).chain(f) = f(a)
 */
export const leftIdentity =
    <A>(pure: <X>(x: X) => Monad<X>) =>
    (eq: Eq) =>
    (f: (a: A) => Monad<A>) =>
    (x: A) => {
        let a = <Monad<A>>pure(x).chain(f);
        let b = f(x);

        return eq(a)(b);
    };

/**
 * rightIdentity
 *
 * Monad m => m.chain(m.of) = m
 */
export const rightIdentity =
    <A>(pure: <X>(x: X) => Monad<X>) =>
    (eq: Eq) =>
    (x: A) => {
        let a = <Monad<A>>pure(x).chain(pure);
        let b = pure(x);

        return eq(a)(b);
    };
