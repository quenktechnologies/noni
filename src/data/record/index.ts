/**
 * The record module provides functions for treating ES objects as records.
 *
 * Some of the functions provided here are inherently unsafe (tsc will not
 * be able track integrity and may result in runtime errors if not used carefully.
 */
import { concat } from '../array';
import { isArray } from '../type';

/**
 * badKeys is a list of keys we don't want to copy around between objects.
 *
 * Mostly due to prototype pollution but who knows what other keys may become
 * a problem as the language matures.
 */
export const badKeys = ['__proto__'];

/**
 * Key is a single level path on a record.
 *
 * Dots are not treated as path separators but rather literal dots.
 */
export type Key = string;

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
 * assign is an Object.assign polyfill.
 *
 * It is used internally and should probably never be used directly in 
 * production code.
 */
export function assign(target: any, ..._varArgs: any[]): any {

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null)
            for (var nextKey in nextSource)
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey))
                    // TODO: Should this clone the value to break references?
                    set(to, nextKey, nextSource[nextKey]);
    }

    return to;

}

/**
 * isRecord tests whether a value is a record.
 *
 * The following are not considered records:
 * 1. Array
 * 2. Date
 * 3. RegExp
 *
 * This function is unsafe.
 */
export const isRecord = <A>(value: any): value is Record<A> =>
    (typeof value === 'object') &&
    (value != null) &&
    (!Array.isArray(value)) &&
    (!(value instanceof Date)) &&
    (!(value instanceof RegExp));

/**
 * keys produces a list of property names from a Record.
 */
export const keys = (value: object) => Object.keys(value);

/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
export const map = <A, B>(o: Record<A>, f: MapFunc<A, B>): Record<B> =>
    keys(o).reduce((p, k) => merge(p, { [k]: f(o[k], k, o) }), {});

/**
 * mapTo maps over a Record's properties producing an array of each result.
 *
 * The order of elements in the array is not guaranteed.
 */
export const mapTo = <A, B>(o: Record<A>, f: MapFunc<A, B>): B[] =>
    keys(o).map(k => f(o[k], k, o));

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
                curr // TODO: this should be cloned to break references.

        }) :
        merge((<any>pre), { [key]: curr });

/**
 * exclude removes the specified properties from a Record.
 */
export const exclude = <A, R extends Record<A>>
    (o: R, keys: string | string[]): Record<A> => {

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
    (rec: R, f: GroupFunc<A, R>): Record<Record<A>> =>
    reduce(rec, <Record<Record<A>>>{}, (prev, curr, key) => {

        let category = f(<A>curr, key, rec);

        return merge(prev, {
            [category]: isRecord(prev[category]) ?
                merge(prev[category], { [key]: curr }) :
                set({}, key, curr)
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
export const contains = (r: object, key: string): boolean =>
    Object.hasOwnProperty.call(r, key);

/**
 * clone a Record.
 * 
 * Breaks references and deep clones arrays.
 * This function should only be used on Records or objects that
 * are not class instances.
 */
export const clone = <A, R extends Record<A>>(r: R): R =>
    <R><any>reduce(r, <Record<A>>{},
        (p, c, k) => { set(p, k, _clone(c)); return p; });

const _clone = (a: any): any => {

    if (isArray(a))
        return a.map(_clone);
    else if (isRecord(a))
        return clone(a);
    else
        return a;

};

/**
 * count how many properties exist on the record.
 */
export const count = (r: object): number => keys(r).length;

/**
 * empty tests whether the object has any properties or not.
 */
export const empty = (r: object): boolean => count(r) === 0;

/**
 * some tests whether at least one property of a Record passes the
 * test implemented by the provided function.
 */
export const some = <A, B>(o: Record<A>, f: MapFunc<A, B>): boolean =>
    keys(o).some(k => f(o[k], k, o));

/**
 * every tests whether each property of a Record passes the
 * test implemented by the provided function.
 */
export const every = <A, B>(o: Record<A>, f: MapFunc<A, B>): boolean =>
    keys(o).every(k => f(o[k], k, o));

/**
 * set the value of a key on a Record ignoring problematic keys.
 *
 * This function exists to avoid unintentionally setting problem keys such
 * as __proto__ on an object.
 *
 * The function modifies the passed record.
 */
export const set = <A, R extends Record<A>>(r: R, k: Key, value: A): R => {

    if (!isBadKey(k))
        (<Record<A>>r)[k] = value;

    return r;

}

/**
 * isBadKey tests whether a key is problematic (Like __proto__).
 */
export const isBadKey = (key: string): boolean =>
    badKeys.indexOf(key) !== -1;
