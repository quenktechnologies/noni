/**
 * Function represented as a type.
 */
export declare type Function<A, B> = (a: A) => B;
/**
 * compose two functions into one.
 */
export declare const compose: <A, B, C>(f: Function<A, B>, g: Function<B, C>) => (a: A) => C;
/**
 * compose3 functions into one.
 */
export declare const compose3: <A, B, C, D>(f: Function<A, B>, g: Function<B, C>, h: Function<C, D>) => (a: A) => D;
/**
 * compose4 functions into one.
 */
export declare const compose4: <A, B, C, D, E>(f: Function<A, B>, g: Function<B, C>, h: Function<C, D>, i: Function<D, E>) => (a: A) => E;
/**
 * compose5 functions into one.
 */
export declare const compose5: <A, B, C, D, E, F>(f: Function<A, B>, g: Function<B, C>, h: Function<C, D>, i: Function<D, E>, j: Function<E, F>) => (a: A) => F;
/**
 * cons given two values, ignore the second and always return the first.
 */
export declare const cons: <A, B>(a: A) => (_: B) => A;
/**
 * flip the order of arguments to a curried function that takes 2 arguments.
 */
export declare const flip: <A, B, C>(f: (a: A) => (b: B) => C) => (b: B) => (a: A) => C;
/**
 * identity function.
 */
export declare const identity: <A>(a: A) => A;
export declare const id: <A>(a: A) => A;
/**
 * curry an ES function that accepts 2 parameters.
 */
export declare const curry: <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => C;
/**
 * curry3 curries an ES function that accepts 3 parameters.
 */
export declare const curry3: <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (a: A) => (b: B) => (c: C) => D;
/**
 * curry4 curries an ES function that accepts 4 parameters.
 */
export declare const curry4: <A, B, C, D, E>(f: (a: A, b: B, c: C, d: D) => E) => (a: A) => (b: B) => (c: C) => (d: D) => E;
/**
 * curry5 curries an ES function that accepts 5 parameters.
 */
export declare const curry5: <A, B, C, D, E, F>(f: (a: A, b: B, c: C, d: D, e: E) => F) => (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F;
