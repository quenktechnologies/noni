/**
 * Functions and types for currying and partial application with
 * typescript code.
 */
export declare type F1<A, B> = (a: A) => B;
export declare type F2<A, B, C> = (a: A, b: B) => C;
export declare type F3<A, B, C, D> = (a: A, b: B, c: C) => C;
export declare type F4<A, B, C, D, E> = (a: A, b: B, c: C, d: D) => E;
export declare type F5<A, B, C, D, E, F> = (a: A, b: B, c: C, d: D, e: E) => F;
export declare type F6<A, B, C, D, E, F, G> = (a: A, b: B, c: C, d: D, e: E, f: F) => G;
export declare const f1: <A, B>(f: F1<A, B>) => F1<A, B>;
export declare const f2: <A, B, C>(f: F2<A, B, C>) => (a: A) => (b: B) => C;
export declare const f3: <A, B, C, D>(f: F3<A, B, C, D>) => (a: A) => (b: B) => (c: C) => C;
export declare const f4: <A, B, C, D, E>(f: F4<A, B, C, D, E>) => (a: A) => (b: B) => (c: C) => (d: D) => E;
export declare const f5: <A, B, C, D, E, F>(f: F5<A, B, C, D, E, F>) => (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F;
export declare const f6: <A, B, C, D, E, F, G>(f: F6<A, B, C, D, E, F, G>) => (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (_f: F) => G;
