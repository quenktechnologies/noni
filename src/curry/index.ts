/**
 * Functions and types for currying and partial application with
 * typescript code.
 */
export type F1<A, B> = (a: A) => B;
export type F2<A, B, C> = (a: A, b: B) => C;
export type F3<A, B, C, D> = (a: A, b: B, c: C) => C;
export type F4<A, B, C, D, E> = (a: A, b: B, c: C, d: D) => E;
export type F5<A, B, C, D, E, F> = (a: A, b: B, c: C, d: D, e: E) => F;
export type F6<A, B, C, D, E, F, G> = (a: A, b: B, c: C, d: D, e: E, f: F) => G;

export const f1 = <A, B>(f: F1<A, B>) => f;

export const f2 = <A, B, C>(f: F2<A, B, C>) => (a: A) => (b: B) => f(a, b);

export const f3 = <A, B, C, D>(f: F3<A, B, C, D>) =>
  (a: A) => (b: B) => (c: C) => f(a, b, c);

export const f4 = <A, B, C, D, E>(f: F4<A, B, C, D, E>) =>
    (a: A) => (b: B) => (c: C) => (d: D) => f(a, b, c, d);

export const f5 = <A, B, C, D, E, F>(f: F5<A, B, C, D, E, F>) =>
    (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => f(a, b, c, d, e);

export const f6 = <A, B, C, D, E, F, G>(f: F6<A, B, C, D, E, F, G>) =>
    (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (_f: F) => f(a, b, c, d, e, _f);
