import { Monad } from '../../src/control/monad';

export type Eq<A> = (m: Monad<A>) => (g: Monad<A>) => boolean;

/**
 * leftIdentity
 *
 * Monad m => m.of(a).chain(f) = f(a)
 */
export const leftIdentity =
    <A>(pure: <X>(x: X) => Monad<X>) => (eq: Eq<A>) =>
        (f: (a: A) => Monad<A>) => (x: A) => {

            let a = <Monad<A>>pure(x).chain(f);
            let b = f(x);

            return (eq(a)(b));

        }

/**
 * rightIdentity
 *
 * Monad m => m.chain(m.of) = m
 */
export const rightIdentity =
    <A>(pure: <X>(x: X) => Monad<X>) => (eq: Eq<A>) => (x: A) => {

        let a = <Monad<A>>pure(x).chain(pure);
        let b = pure(x);

        return (eq(a)(b));

    }

