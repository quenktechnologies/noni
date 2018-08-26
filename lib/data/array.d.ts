/**
 * The array module provides helper functions
 * for working with JS arrays.
 */
/**
 * head returns the item at index 0 of an array
 */
export declare const head: <A>(list: A[]) => A;
/**
 * tail returns the last item in an array
 */
export declare const tail: <A>(list: A[]) => A;
/**
 * map is a curried version of the Array#map method.
 */
export declare const map: <A, B>(list: A[]) => (f: (a: A) => B) => B[];
/**
 * partition an array into two using a partitioning function.
 *
 * The first array contains values that return true and the second false.
 */
export declare const partition: <A>(list: A[]) => (f: (a: A) => boolean) => [A[], A[]];
