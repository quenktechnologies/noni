/**
 * The record module provides functions for treating ES objects as records.
 *
 * Some of the functions provided here are not type safe and may result in
 * runtime errors if not used carefully.
 */
import { concat } from '../array';
import { isArray } from '../type';
import { nothing, just, Maybe } from '../maybe';

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
 * Dots should not be considered path separators by functions.
 */
export type Key = string;

/**
 * MapFunc used by map.
 */
export type MapFunc<A, B> = (value: A, key: string, rec: Record<A>) => B;

/**
 * ForEachFunction used by forEach.
 */
export type ForEachFunction<A, B> = (value: A, key: string, rec: Record<A>) => B;

/**
 * FilterFunc used by filter.
 */
export type FilterFunc<A> = (value: A, key: string, rec: Record<A>) => boolean;

/**
 * ReduceFunc used by filter.
 */
export type ReduceFunc<A, B> = (pre: B, curr: A, key: string) => B;

/**
 * PartitionFunc
 */
export type PartitionFunc<A, R extends Record<A>>
    = (a: A, k: string, r: R) => boolean
    ;

/**
 * GroupFunc used by group.
 */
export type GroupFunc<A, R extends Record<A>>
    = (a: A, k: string, r: R) => string
    ;

/**
 * PickFunc used by pickKey and pickValue.
 */
export type PickFunc<A> = (value: A, key: string, rec: Record<A>) => boolean;

/**
 * Record is an object with an index signature.
 */
export interface Record<A> {

    [key: string]: A
}

/**
 * assign is an Object.assign polyfill.
 *
 * It is used internally and should probably not be used directly elsewhere.
 */
export function assign(target: any, ..._varArgs: any[]): any {

    let to = Object(target);

    for (let index = 1; index < arguments.length; index++) {
        let nextSource = arguments[index];

        if (nextSource != null)
            for (let nextKey in nextSource)
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey))
                    set(to, nextKey, nextSource[nextKey]);
    }

    return to;

}

/**
 * isRecord tests whether a value is a record.
 *
 * To be a Record, a value must be an object and:
 * 1. must not be null
 * 2. must not be an Array
 * 2. must not be an instance of Date
 * 3. must not be an instance of RegExp
 */
export const isRecord = <A>(value: any): value is Record<A> =>
    (typeof value === 'object') &&
    (value != null) &&
    (!Array.isArray(value)) &&
    (!(value instanceof Date)) &&
    (!(value instanceof RegExp));

/**
 * keys is an Object.keys shortcut.
 */
export const keys = (obj: object) => Object.keys(obj);

/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
export const map = <A, B>(rec: Record<A>, f: MapFunc<A, B>): Record<B> =>
    keys(rec)
        .reduce((p, k) => merge(p, set({}, k, f(rec[k], k, rec))), {});

/**
 * mapTo an array the properties of the provided Record.
 *
 * The elements of the array are the result of applying the function provided
 * to each property. The order of elements is not guaranteed.
 */
export const mapTo = <A, B>(rec: Record<A>, f: MapFunc<A, B>): B[] =>
    keys(rec).map(k => f(rec[k], k, rec));

/**
 * forEach is similar to map only the result of each function call is not kept.
 *
 * The order of keys processed is not guaranteed.
 */
export const forEach = <A, B>(rec: Record<A>, f: ForEachFunction<A, B>): void =>
    keys(rec).forEach(k => f(rec[k], k, rec));

/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properties on the Record. The order of keys processed is
 * not guaranteed.
 */
export const reduce = <A, B>(rec: Record<A>, accum: B, f: ReduceFunc<A, B>): B =>
    keys(rec).reduce((p, k) => f(p, rec[k], k), accum);

/**
 * filter the keys of a Record using a filter function.
 */
export const filter = <A>(rec: Record<A>, f: FilterFunc<A>): Record<A> =>
    keys(rec)
        .reduce((p, k) => f(rec[k], k, rec) ?
            merge(p, set({}, k, rec[k])) : p, {});

/**
 * merge two objects (shallow) into one new object.
 *
 * The return value's type is the product of the two objects provided.
 */
export const merge = <L extends object, R extends object>
    (left: L, right: R): L & R => assign({}, left, right);

/**
 * merge3 
 */
export const merge3 = <A extends object, B extends object, C extends object>
    (a: A, b: B, c: C): A & B & C => assign({}, a, b, c);

/**
 * merge4 
 */
export const merge4 =
    <A extends object,
        B extends object,
        C extends object,
        D extends object>(a: A, b: B, c: C, d: D): A & B & C & D =>
        assign({}, a, b, c, d);

/**
 * merge5 
 */
export const merge5 =
    <A extends object,
        B extends object,
        C extends Object,
        D extends object,
        E extends object>(a: A, b: B, c: C, d: D, e: E) =>
        assign({}, a, b, c, d, e);

/**
 * rmerge merges 2 records recursively.
 *
 * This function may violate type safety.
 */
export const rmerge = <A, R extends Record<A>, B, S extends Record<B>>
    (left: R, right: S): R & S =>
    reduce(right, <any>left, deepMerge);

/**
 * rmerge3
 */
export const rmerge3 =
    <A,
        R extends Record<A>,
        B,
        S extends Record<B>,
        C,
        T extends Record<C>>(r: R, s: S, t: T): R & S & T =>
        [s, t]
            .reduce((p: R & S & T, c: S | T) =>
                reduce(<Record<A | B>>c, (p), deepMerge), <any>r);

/**
 * rmerge4 
 */
export const rmerge4 =
    <A,
        R extends Record<A>,
        B,
        S extends Record<B>,
        C,
        T extends Record<C>,
        D,
        U extends Record<D>>(r: R, s: S, t: T, u: U): R & S & T & U =>
        [s, t, u]
            .reduce((p: R & S & T & U, c: S | T | U) =>
                reduce(<Record<A | B | C | D>>c, (p), deepMerge), <any>r);

/**
 * rmerge5
 */
export const rmerge5 =
    <A,
        R extends Record<A>,
        B,
        S extends Record<B>,
        C,
        T extends Record<C>,
        D,
        U extends Record<D>,
        E,
        V extends Record<E>>(r: R, s: S, t: T, u: U, v: V): R & S & T & U & V =>
        [s, t, u, v]
            .reduce((p: R & S & T & U & V, c: S | T | U | V) =>
                reduce(<Record<A | B | C | D | E>>c, (p), deepMerge), <any>r);

const deepMerge = <A, R extends Record<A>>(pre: R, curr: A, key: string) =>
    isRecord(curr) ?
        merge(pre, set({}, key, isRecord(pre[key]) ?
            rmerge((<any>pre[key]), curr) :
            merge({}, curr)
        )) :
        merge((<any>pre), set({}, key, curr));

/**
 * exclude removes the specified properties from a Record.
 */
export const exclude = <A, R extends Record<A>>
    (rec: R, keys: string | string[]): Record<A> => {

    let list: string[] = Array.isArray(keys) ? keys : [keys];

    return reduce(rec, {}, (p, c, k) =>
        list.indexOf(k) > -1 ? p : merge(p, set({}, k, c)));

}

/**
 * partition a Record into two sub-records using a PartitionFunc function.
 *
 * This function produces an array where the first element is a Record
 * of values that return true and the second, false.
 */
export const partition = <A, R extends Record<A>>
    (r: R, f: PartitionFunc<A, R>): [Record<A>, Record<A>] =>
    <[Record<A>, Record<A>]>reduce(r, [{}, {}], ([yes, no], c, k) =>
        f(<A>c, k, r) ?
            [merge(yes, set({}, k, c)), no] :
            [yes, merge(no, set({}, k, c))]);

/**
 * group the properties of a Record into another Record using a GroupFunc 
 * function.
 */
export const group = <A, R extends Record<A>>
    (rec: R, f: GroupFunc<A, R>): Record<Record<A>> =>
    reduce(rec, <Record<Record<A>>>{}, (prev, curr, key) => {

        let category = f(<A>curr, key, rec);

        let value = isRecord(prev[category]) ?
            merge(prev[category], set({}, key, curr)) :
            set({}, key, curr);

        return merge(prev, set({}, category, value));

    });

/**
 * values returns a shallow array of the values of a record.
 */
export const values = <A>(r: Record<A>): A[] =>
    reduce(r, [], (p: A[], c) => concat(p, <A>c));

/**
 * hasKey indicates whether a Record has a given key.
 */
export const hasKey = (r: object, key: string): boolean =>
    Object.hasOwnProperty.call(r, key);

/**
 * clone a Record.
 * 
 * Breaks references and deep clones arrays.
 * This function should only be used on Records or objects that
 * are not class instances. This function may violate type safety.
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
export const some = <A>(o: Record<A>, f: MapFunc<A, boolean>): boolean =>
    keys(o).some(k => f(o[k], k, o));

/**
 * every tests whether each property of a Record passes the
 * test implemented by the provided function.
 */
export const every = <A>(o: Record<A>, f: MapFunc<A, boolean>): boolean =>
    keys(o).every(k => f(o[k], k, o));

/**
 * set the value of a key on a Record ignoring problematic keys.
 *
 * This function exists to avoid unintentionally setting problem keys such
 * as __proto__ on an object.
 *
 * Even though this function mutates the provided record, it should be used
 * as though it does not.
 *
 * Don't:
 * set(obj, key, value);
 *
 * Do:
 * obj = set(obj, key, value);
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

/**
 * compact a Record by removing any properties that == null.
 */
export const compact = <A>(rec: Record<A | null | undefined>): Record<A> => {

    let result: Record<A> = {};

    for (let key in rec)
        if (rec.hasOwnProperty(key))
            if (rec[key] != null)
                result = set(result, key, rec[key]);

    return result;

}

/**
 * rcompact recursively compacts a Record.
 */
export const rcompact = <A>(rec: Record<A>): Record<A> =>
    compact(<Record<A>>map(rec, val => isRecord(val) ? rcompact(val) : val));

/**
 * make creates a new instance of a Record optionally using the provided
 * value as an initializer.
 *
 * This function is intended to assist with curbing prototype pollution by
 * configuring a setter for __proto__ that ignores changes.
 */
export const make = <A>(init: Record<A> = {}): Record<A> => {

    let rec: any = {};

    Object.defineProperty(rec, '__proto__', {

        configurable: false,

        enumerable: false,

        set() { }

    });

    for (let key in init)
        if (init.hasOwnProperty(key))
            rec[key] = init[key];

    return <Record<A>>rec;

}

/**
 * pickKey selects the value of the first property in a Record that passes the
 * provided test.
 */
export const pickKey = <A>(rec: Record<A>, test: PickFunc<A>): Maybe<string> =>
    reduce(rec, nothing(), (p, c, k) =>
        p.isJust() ? p : test(c, k, rec) ? just(k) : p);

/**
 * pickValue selects the value of the first property in a Record that passes the
 * provided test.
 */
export const pickValue = <A>(rec: Record<A>, test: PickFunc<A>): Maybe<A> =>
    reduce(rec, nothing(), (p, c, k) =>
        p.isJust() ? p : test(c, k, rec) ? just(c) : p);
