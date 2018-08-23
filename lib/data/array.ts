/**
 * The array module provides helper functions 
 * for working with JS arrays.
 */

/**
 * head returns the item at index 0 of an array
 */
export const head = <A>(list: A[]) => list[0];

/**
 * tail returns the last item in an array
 */
export const tail = <A>(list: A[]) => list[list.length - 1];

/**
 * map is a curried version of the Array#map method.
 */
export const map = <A, B>(list: A[]) => (f: (a: A) => B): B[] => list.map(f);
