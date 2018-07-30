import { Applicative } from '../../src/control/applicative';

export type Eq<A> = (f: Applicative<A>) => (g: Applicative<A>) => boolean;

/**
 * identity law
 *
 * Applicative a => a.ap(a.of(x=>x)) = a
 */
export const identity =
    <A>(pure: <X>(x: X) => Applicative<X>) => (eq: Eq<A>) => (x: A) => {

        let a = <Applicative<A>>pure(x).ap(pure((x: A) => x));
        let b = pure(x);

        return (eq(b)(a));

    }

/**
 * homomorphism law
 *
 * Applicative a => a.of(x).ap(a.of(f)) = a.of(f(x))
 */
export const homomorphism =
    <A>(pure: <X>(x: X) => Applicative<X>) => (eq: Eq<A>) => (x: A) => {

        let a = <Applicative<A>>pure(x).ap(pure((x: A) => x));
        let b = pure(x);

        return (eq(a)(b));

    }

/**
 * interchange law
 *
 * Applicative a => a.of(y).ap(u) = u.ap(a.of(f=>f(y)))
 */
export const interchange =
    <A>(pure: <X>(x: X) => Applicative<X>) => (eq: Eq<A>) => (x: A) => {

        let u = pure((a: A) => a);
        let a = <Applicative<A>>pure(x).ap(u);
        let b = <Applicative<A>>u.ap(pure((f:any) => f((a: A) => a)));

        return (eq(a)(b));

    }
