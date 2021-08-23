/**
 * The array module provides helper functions
 * for working with JS arrays.
 */
import { Record } from '../record';
/**
 * PartitionFunc type.
 */
export declare type PartitionFunc<A> = (a: A, i: number, l: A[]) => boolean;
/**
 * GroupFunc type.
 */
export declare type GroupFunc<A> = (a: A, i: number, r: A[]) => string;
/**
 * MapFunc type.
 */
export declare type MapFunc<A, B> = (elm: A, idx: number, all: A[]) => B[];
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
export declare const contains: <A>(list: A[], a: A) => boolean;
/**
 * map is a curried version of the Array#map method.
 */
export declare const map: <A, B>(list: A[]) => (f: (a: A) => B) => B[];
/**
 * flatMap allows a function to produce a combined set of arrays from a map
 * operation over each member of a list.
 */
export declare const flatMap: <A, B>(list: A[], f: MapFunc<A, B>) => B[];
/**
 * concat concatenates elements to the end of an array without flattening
 * if any of the elements are an array.
 *
 * This function also ignores null and undefined.
 */
export declare const concat: <A>(list: A[], ...items: A[]) => A[];
/**
 * partition an array into two using a partitioning function.
 *
 * The first array contains values that return true and the second false.
 */
export declare const partition: <A>(list: A[], f: PartitionFunc<A>) => [A[], A[]];
/**
 * group the elements of an array into a Record where each property
 * is an array of elements assigned to it's property name.
 */
export declare const group: <A>(list: A[], f: GroupFunc<A>) => Record<A[]>;
/**
 * distribute breaks an array into an array of equally (approximate) sized
 * smaller arrays.
 */
export declare const distribute: <A>(list: A[], size: number) => A[][];
/**
 * dedupe an array by filtering out elements
 * that appear twice.
 */
export declare const dedupe: <A>(list: A[]) => A[];
/**
 * remove an element from an array returning a new copy with the element
 * removed.
 */
export declare const remove: <A>(list: A[], target: A) => A[];
/**
 * removeAt removes an element at the specified index returning a copy
 * of the original array with the element removed.
 */
export declare const removeAt: <A>(list: A[], idx: number) => A[];
/**
 * make an array of elements of a given size using a function to provide
 * each element.
 *
 * The function receives the index number for each step.
 */
export declare const make: <A>(size: number, f: (n: number) => A) => any[];
/**
 * combine a list of of lists into one list.
 */
export declare const combine: <A>(list: A[][]) => A[];
/**
 * flatten a list of items that may be multi-dimensional.
 *
 * This function may not be stack safe.
 */
export declare const flatten: <A>(list: A[]) => A[];
/**
 * compact removes any occurences of null or undefined in the list.
 */
export declare const compact: <A>(list: (A | null | undefined)[]) => A[];
