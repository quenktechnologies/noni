/**
 * The record module provides functions for treating ES objects as records.
 *
 * Some of the functions provided here are inherently unsafe (tsc will not
 * be able track integrity and may result in runtime errors if not used carefully.
 */
import { concat } from '../array';

/**
 * MapFunc
 */
export type MapFunc<A, B> = (value: A, key: string, rec: Record<A>) => B;

/**
 * FilterFunc
 */
export type FilterFunc<A> = (value: A, key: string, rec: Record<A>) => boolean;

/**
 * ReduceFunc
 */
export type ReduceFunc<A, B> = (pre: B, curr: A, key: string) => B;

/**
 * PartitionFunc
 */
export type PartitionFunc<A, R extends Record<A>>
    = (a: A, k: string, r: R) => boolean
    ;

/**
 * GroupFunc
 */
export type GroupFunc<A, R extends Record<A>>
    = (a: A, k: string, r: R) => string
    ;

/**
 * Record is an ES object with an index signature.
 */
export interface Record<A> {

    [key: string]: A
}

/**
 * assign polyfill.
 */
export function assign(target: any, ..._varArgs: any[]): any {

    if (target == null)
        throw new TypeError('Cannot convert undefined or null to object');

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {

            for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey))
                    to[nextKey] = nextSource[nextKey];

            }
        }
    }
    return to;
}

/**
 * isRecord tests whether a value is a record.
 *
 * This is a typeof check that excludes arrays.
 * 
 * Unsafe.
 */
export const isRecord = <A>(value: any): value is Record<A> =>
    (typeof value === 'object') && (!Array.isArray(value));

/**
 * keys produces a list of property names from a Record.
 */
export const keys = <A>(value: Record<A>) => Object.keys(value);

/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
export const map = <A, B>(o: Record<A>, f: MapFunc<A, B>): Record<B> =>
    keys(o).reduce((p, k) => merge(p, { [k]: f(o[k], k, o) }), {});

/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properites on the Record.
 * The order of keys processed is not guaranteed.
 */
export const reduce = <A, B>(o: Record<A>, accum: B, f: ReduceFunc<A, B>): B =>
    keys(o).reduce((p, k) => f(p, o[k], k), accum);

/**
 * filter the keys of a record using a filter function.
 */
export const filter = <A>(o: Record<A>, f: FilterFunc<A>): Record<A> =>
    keys(o).reduce((p, k) => f(o[k], k, o) ? merge(p, { [k]: o[k] }) : p, {});

/**
 * merge two objects into one.
 *
 * The return value's type is the product of the two types supplied.
 * This function may be unsafe.
 */
export const merge = <L extends object, R extends object>
    (left: L, right: R): L & R => assign({}, left, right);

/**
 * merge3 merges 3 records into one.
 */
export const merge3 = <A extends object, B extends object, C extends object>
    (a: A, b: B, c: C): A & B & C => assign({}, a, b, c);

/**
 * merge4 merges 4 records into one.
 */
export const merge4 = <A extends object, B extends object,
    C extends object, D extends object>
    (a: A, b: B, c: C, d: D): A & B & C & D =>
    assign({}, a, b, c, d);

/**
 * merge5 merges 5 records into one.
 */
export const merge5 = <A extends object, B extends object,
    C extends Object, D extends object, E extends object>
    (a: A, b: B, c: C, d: D, e: E) => assign({}, a, b, c, d, e);

/**
 * rmerge merges 2 records recursively.
 *
 * This function may be unsafe.
 */
export const rmerge = <A, R extends Record<A>, B, S extends Record<B>>
    (left: R, right: S): R & S =>
    reduce(right, (<any>left), deepMerge);

/**
 * rmerge3 merges 3 records recursively.
 */
export const rmerge3 =
    <A, R extends Record<A>,
        B, S extends Record<B>,
        C, T extends Record<C>>
        (r: R, s: S, t: T): R & S & T =>
        [s, t]
            .reduce((p: R & S & T, c: S | T) =>
                reduce(<Record<A | B>>c, (p), deepMerge), <any>r);

/**
 * rmerge4 merges 4 records recursively.
 */
export const rmerge4 =
    <A, R extends Record<A>,
        B, S extends Record<B>,
        C, T extends Record<C>,
        D, U extends Record<D>>
        (r: R, s: S, t: T, u: U): R & S & T & U =>
        [s, t, u]
            .reduce((p: R & S & T & U, c: S | T | U) =>
                reduce(<Record<A | B | C | D>>c, (p), deepMerge), <any>r);

/**
 * rmerge5 merges 5 records recursively.
 */
export const rmerge5 =
    <A, R extends Record<A>,
        B, S extends Record<B>,
        C, T extends Record<C>,
        D, U extends Record<D>,
        E, V extends Record<E>>
        (r: R, s: S, t: T, u: U, v: V): R & S & T & U & V =>
        [s, t, u, v]
            .reduce((p: R & S & T & U & V, c: S | T | U | V) =>
                reduce(<Record<A | B | C | D | E>>c, (p), deepMerge), <any>r);

const deepMerge = <A, R extends Record<A>>(pre: R, curr: A, key: string) =>
    isRecord(curr) ?
        merge(pre, {

            [key]: isRecord(pre[key]) ?
                rmerge((<any>pre[key]), curr) :
                curr

        }) :
        merge((<any>pre), { [key]: curr });

/**
 * exclude removes the specified properties from a Record.
 */
export const exclude = <A, R extends Record<A>>(o: R, keys: string | string[]) => {

    let list: string[] = Array.isArray(keys) ? keys : [keys];

    return reduce(o, {}, (p, c, k) =>
        list.indexOf(k) > -1 ? p : merge(p, { [k]: c }));

}

/**
 * partition a Record into two sub-records using a separating function.
 *
 * This function produces an array where the first element is a record
 * of passing values and the second the failing values.
 */
export const partition = <A, R extends Record<A>>
    (r: R, f: PartitionFunc<A, R>): [Record<A>, Record<A>] =>
    <[Record<A>, Record<A>]>reduce(r, [{}, {}], ([yes, no], c, k) =>
        f(<A>c, k, r) ?
            [merge(yes, { [k]: c }), no] :
            [yes, merge(no, { [k]: c })]);

/**
 * group the properties of a Record into another Record using a grouping 
 * function.
 */
export const group = <A, R extends Record<A>>
    (r: R, f: GroupFunc<A, R>): Record<Record<A>> =>
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
export const values = <A>(r: Record<A>): A[] =>
    reduce(r, [], (p: A[], c) => concat(p, <A>c));

/**
 * contains indicates whether a Record has a given key.
 */
export const contains = <A>(r: Record<A>, key: string): boolean =>
    Object.hasOwnProperty.call(r, key);

/**
 * clone a Record.
 * 
 * Breaks references and deep clones arrays.
 * This function should only be used on Records or objects that
 * are not class instances.
 */
export const clone = <A, R extends Record<A>>(r: R): R =>
    <R><any>reduce(r, <Record<A>>{}, (p, c, k) => { p[k] = _clone(c); return p; });

const _clone = (a: any): any => {

    if (Array.isArray(a))
        return a.map(_clone);
    else if (typeof a === 'object')
        return clone(a);
    else
        return a;

};
