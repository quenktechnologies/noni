/**
 * The record module provides functions for manipulating ES objects used
 * as records.
 *
 * Some of the functions provided here are inherently unsafe (the compiler 
 * would not be able to verify the runtime value) and may result in crashes
 * if not used carefully.
 */
import { isObject } from '../data/type';
import {concat} from './array';

/**
 * Record is simply a plain old ES object with an index signature.
 */
export interface Record<A> {

    [key: string]: A

}

/**
 * isRecord tests whether a value is a record.
 *
 * Note: This function is also an unsafe type guard.
 * Use with caution.
 */
export const isRecord = <A>(value: any): value is Record<A> =>
    (typeof value === 'object') && (!Array.isArray(value));

/**
 * keys produces a list of property names. of a Record.
 */
export const keys = <A, R extends Record<A>>(value: R) => Object.keys(value);

/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
export const map = <A, R extends Record<A>, B, S extends Record<B>>
    (o: R, f: (value: A, key: string, rec: R) => B): S =>
    <S>keys(o).reduce((p, k) => merge(p, { [k]: f(o[k], k, o) }), <Record<B>>{});

/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properites on the Record.
 * The order of keys processed is not guaranteed.
 */
export const reduce = <A, R extends Record<A>, S>
    (o: R, accum: S, f: (pre: S, curr: A, key: string) => S) =>
    keys(o).reduce((p, k) => f(p, o[k], k), accum);

/**
 * merge two or more objects into one returning the value.
 *
 * The return value's type is the product of the two types supplied.
 * This function may be unsafe.
 */
export const merge = <A, R extends Record<A>, B, S extends Record<B>>
    (left: R, right: S): R & S => (<any>Object).assign({}, left, right);

/**
 * rmerge merges nested records recursively.
 *
 * This function may be unsafe.
 */
export const rmerge = <A, R extends Record<A>, B, S extends Record<B>>
    (left: R, right: S): R & S =>
    reduce(right, (<any>left), (pre: R & S, curr: A | B, key: string) =>
        isRecord(curr) ?
            merge(pre, {

                [key]: isRecord(pre[key]) ?
                    rmerge((<any>pre[key]), curr) :
                    curr

            }) :
            merge((<any>pre), { [key]: curr }));

/**
 * exclude removes the specified properties from a Record.
 */
export const exclude = <A, R extends Record<A>>(o: R, ...keys: string[]) =>
    reduce(o, {}, (p, c, k) => keys.indexOf(k) > -1 ? p : merge(p, { [k]: c }));

/**
 * flatten an object into a map of key value pairs.
 *
 * The keys are the paths on the objects where the value would have been
 * found. 
 * 
 * Note: This function does not give special treatment to properties
 * with dots in them.
 */
export const flatten = <A, R extends Record<A>>(r: R): Record<A> =>
    (flatImpl<A, R>('')({})(r));

const flatImpl = <A, R extends Record<A>>
    (pfix: string) => (prev: Record<any>) => (r: R): Record<A> =>
        reduce(r, prev, (p, c, k) => isObject(c) ?
            (flatImpl(prefix(pfix, k))(p)(<Record<any>>c)) :
            merge(p, { [prefix(pfix, k)]: c }));

const prefix = (pfix: string, key: string) => (pfix === '') ?
    key : `${pfix}.${key}`;

/**
 * partition a Record into two sub-records using a separating function.
 *
 * This function produces an array where the first element is a record
 * of passing values and the second the failing values.
 */
export const partition = <A, R extends Record<A>>
    (r: R) => (f: (a: A, k: string, r: R) => boolean): [Record<A>, Record<A>] =>
        <[Record<A>, Record<A>]>reduce(r, [{}, {}], ([yes, no], c, k) =>
            f(<A>c, k, r) ?
                [merge(yes, { [k]: c }), no] :
                [yes, merge(no, { [k]: c })]);

/**
 * group the properties of a Record into another Record using a grouping 
 * function.
 */
export const group = <A, R extends Record<A>>
    (r: R) => (f: (a: A, k: string, r: R) => string): Record<Record<A>> =>
        reduce(r, <Record<Record<A>>>{}, (p, c, k) => {

            let g = f(<A>c, k, r);

            return merge(p, {
                [g]: isRecord(p[g]) ?
                    merge(p[g], { [k]: c }) : { [k]: c }
            });

        });

/**
 * values returns a shallow array of the values of a record.
 */
export const values = <A, R extends Record<A>>(r: R): A[] =>
    reduce(r, [], (p: A[], c) => concat(p)(<A>c));
