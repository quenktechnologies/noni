/**
 * The array module provides helper functions 
 * for working with JS arrays.
 */
import { Record, merge } from './record';
import { isMultipleOf } from '../math';

/**
 * head returns the item at index 0 of an array
 */
export const head = <A>(list: A[]) => list[0];

/**
 * tail returns the last item in an array
 */
export const tail = <A>(list: A[]) => list[list.length - 1];

/**
 * empty indicates whether an array is empty or not.
 */
export const empty = <A>(list: A[]) => (list.length === 0);

/**
 * contains indicates whether an element exists in an array.
 */
export const contains = <A>(list: A[]) => (a: A) => (list.indexOf(a) > -1)

/**
 * map is a curried version of the Array#map method.
 */
export const map = <A, B>(list: A[]) => (f: (a: A) => B): B[] => list.map(f);

/**
 * concat concatenates an element to an array without destructuring
 * the element if itself is an array.
 */
export const concat = <A>(list: A[], a: A): A[] => [...list, a];

/**
 * partition an array into two using a partitioning function.
 *
 * The first array contains values that return true and the second false.
 */
export const partition = <A>(list: A[]) => (f: (a: A, i: number, l: A[]) => boolean)
    : [A[], A[]] => empty(list) ?
        [[], []] :
        list.reduce(([yes, no]: [A[], A[]], c: A, i: number) =>
            <[A[], A[]]>(f(c, i, list) ?
                [concat(yes, c), no] :
                [yes, concat(no, c)]), [[], []]);

/**
 * group the properties of a Record into another Record using a grouping 
 * function.
 */
export const group = <A>(list: A[]) => (f: (a: A, i: number, r: A[]) => string)
    : Record<A[]> =>
    list.reduce((p, c, i) => {

        let g = f(<A>c, i, list);

        return merge(p, {
            [g]: Array.isArray(p[g]) ?
                concat(p[g], c) : [c]
        });

    }, <Record<A[]>>{});

/**
 * distribute breaks an array into an array of equally (approximate) sized
 * smaller arrays.
 */
export const distribute = <A>(list: A[], size: number): A[][] => {
 
  let r =     list.reduce((p: [A[][], A[]], c: A, i: number): [A[][], A[]] =>
        isMultipleOf(size, i + 1) ?
            [concat(p[0], concat(p[1], c)), []] :
      [p[0], concat(p[1], c)], (<[A[][], A[]]>[[], []]));

  return (r[1].length === 0)  ? r[0] : concat(r[0], r[1]);

}

/**
 * dedupe an array by filtering out elements
 * that appear twice.
 */
export const dedupe = <A>(list: A[]) : A[] =>
  list.filter((e,i,l)=> l.indexOf(e) === i);
