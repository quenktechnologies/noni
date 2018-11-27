/**
 * The array module provides helper functions
 * for working with JS arrays.
 */
import { Record } from './record';
/**
 * head returns the item at index 0 of an array
 */
export declare const head: <A>(list: A[]) => A;
/**
 * tail returns the last item in an array
 */
export declare const tail: <A>(list: A[]) => A;
/**
 * empty indicates whether an array is empty or not.
 */
export declare const empty: <A>(list: A[]) => boolean;
/**
 * contains indicates whether an element exists in an array.
 */
export declare const contains: <A>(list: A[]) => (a: A) => boolean;
/**
 * map is a curried version of the Array#map method.
 */
export declare const map: <A, B>(list: A[]) => (f: (a: A) => B) => B[];
/**
 * concat concatenates an element to an array without destructuring
 * the element if itself is an array.
 */
export declare const concat: <A>(list: A[], a: A) => A[];
/**
 * partition an array into two using a partitioning function.
 *
 * The first array contains values that return true and the second false.
 */
export declare const partition: <A>(list: A[]) => (f: (a: A, i: number, l: A[]) => boolean) => [A[], A[]];
/**
 * group the properties of a Record into another Record using a grouping
 * function.
 */
export declare const group: <A>(list: A[]) => (f: (a: A, i: number, r: A[]) => string) => Record<A[]>;
/**
 * distribute breaks an array into an array of equally (approximate) sized
 * smaller arrays.
 */
export declare const distribute: <A>(list: A[], size: number) => A[][];
