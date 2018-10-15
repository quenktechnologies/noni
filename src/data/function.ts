/**
 * Function represented as a type.
 */
export type Function<A, B> = (a: A) => B;

/**
 * compose two functions into one.
 */
export const compose = <A, B, C>
    (f: Function<A, B>, g: Function<B, C>) => (a: A) => g(f(a));

/**
 * compose3 functions into one.
 */
export const compose3 = <A, B, C, D>
    (f: Function<A, B>, g: Function<B, C>, h: Function<C, D>) => (a: A) => h(g(f(a)));

/**
 * compose4 functions into one.
 */
export const compose4 = <A, B, C, D, E>
    (f: Function<A, B>, g: Function<B, C>, h: Function<C, D>, i: Function<D, E>) =>
    (a: A) => i(h(g(f(a))));

/**
 * compose5 functions into one.
 */
export const compose5 = <A, B, C, D, E, F>
    (f: Function<A, B>,
    g: Function<B, C>,
    h: Function<C, D>,
    i: Function<D, E>,
    j: Function<E, F>) => (a: A) => j(i(h(g(f(a)))));

/**
 * cons given two values, ignore the second and always return the first.
 */
export const cons = <A, B>(a: A) => (_: B) => a;

/**
 * flip the order of arguments to a curried function that takes 2 arguments.
 */
export const flip = <A, B, C>(f: (a: A) => (b: B) => C) => (b: B) => (a: A)
    : C => (f(a)(b));

/**
 * identity function.
 */
export const identity = <A>(a: A) => a;
export const id = identity;

/**
 * curry an ES function that accepts 2 parameters.
 */
export const curry = <A, B, C>
    (f: (a: A, b: B) => C) => (a: A) => (b: B) => f(a, b);

/**
 * curry3 curries an ES function that accepts 3 parameters.
 */
export const curry3 = <A, B, C, D>
    (f: (a: A, b: B, c: C) => D) => (a: A) => (b: B) => (c: C) => f(a, b, c);

/**
 * curry4 curries an ES function that accepts 4 parameters.
 */
export const curry4 = <A, B, C, D, E>
    (f: (a: A, b: B, c: C, d: D) => E) =>
    (a: A) => (b: B) => (c: C) => (d: D) => f(a, b, c, d);

/**
 * curry5 curries an ES function that accepts 5 parameters.
 */
export const curry5 = <A, B, C, D, E, F>
    (f: (a: A, b: B, c: C, d: D, e: E) => F) =>
    (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => f(a, b, c, d, e);

/**
 * noop function
 */
export const noop = () => void 0;
