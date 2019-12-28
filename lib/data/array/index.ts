/**
 * The array module provides helper functions 
 * for working with JS arrays.
 */
import { Record, merge } from '../record';
import { isMultipleOf } from '../../math';

/**
 * PartitionFunc type.
 */
export type PartitionFunc<A> = (a: A, i: number, l: A[]) => boolean;

/**
 * GroupFunc type.
 */
export type GroupFunc<A> = (a: A, i: number, r: A[]) => string;

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
export const partition = <A>(list: A[], f: PartitionFunc<A>)
    : [A[], A[]] => empty(list) ?
        [[], []] :
        list.reduce(([yes, no]: [A[], A[]], c: A, i: number) =>
            <[A[], A[]]>(f(c, i, list) ?
                [concat(yes, c), no] :
                [yes, concat(no, c)]), [[], []]);

/**
 * group the elements of an array into a Record where each property 
 * is an array of elements assigned to it's property name.
 */
export const group = <A>(list: A[], f: GroupFunc<A>): Record<A[]> =>
    list.reduce((p, c, i) => {

        let g = f(<A>c, i, list);

        return merge(p, {
            [g]: Array.isArray(p[g]) ?
                concat(<A[]>p[g], c) : [c]
        });

    }, <Record<A[]>>{});

/**
 * distribute breaks an array into an array of equally (approximate) sized
 * smaller arrays.
 */
export const distribute = <A>(list: A[], size: number): A[][] => {

    let r = list.reduce((p: [A[][], A[]], c: A, i: number): [A[][], A[]] =>
        isMultipleOf(size, i + 1) ?
            [concat(p[0], concat(p[1], c)), []] :
            [p[0], concat(p[1], c)], (<[A[][], A[]]>[[], []]));

    return (r[1].length === 0) ? r[0] : concat(r[0], r[1]);

}

/**
 * dedupe an array by filtering out elements
 * that appear twice.
 */
export const dedupe = <A>(list: A[]): A[] =>
    list.filter((e, i, l) => l.indexOf(e) === i);

/**
 * remove an element from an array returning a new copy with the element
 * removed.
 */
export const remove = <A>(list: A[], target: A): A[] => {

    let idx = list.indexOf(target);

    if (idx === -1) {

        return list.slice();

    } else {

        let a = list.slice();

        a.splice(idx, 1);

        return a;

    }

}

/**
 * removeAt removes an element at the specified index returning a copy 
 * of the original array with the element removed.
 */
export const removeAt = <A>(list: A[], idx: number): A[] => {

    if ((list.length > idx) && (idx > -1)) {

        let a = list.slice();

        a.splice(idx, 1);

        return a;

    } else {

        return list.slice();

    }

}

/**
 * make an array of elements of a given size using a function to provide
 * each element.
 *
 * The function receives the index number for each step.
 */
export const make = <A>(size: number, f: (n: number) => A) => {

    let a = new Array(size);

    for (let i = 0; i < size; i++)
        a[i] = f(i);

    return a;

}

/**
 * combine a list of of lists into one list.
 */
export const combine = <A>(list: A[][]): A[] =>
    list.reduce((p, c) => p.concat(c), []);

/**
 * compact removes any occurences of null or undefined in the list.
 */
export const compact = <A>(list: A[]): A[] =>
    list.filter(v => (v != null));
