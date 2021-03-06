import { Maybe } from '../maybe';
/**
 * badKeys is a list of keys we don't want to copy around between objects.
 *
 * Mostly due to prototype pollution but who knows what other keys may become
 * a problem as the language matures.
 */
export declare const badKeys: string[];
/**
 * Key is a single level path on a record.
 *
 * Dots should not be considered path separators by functions.
 */
export declare type Key = string;
/**
 * MapFunc used by map.
 */
export declare type MapFunc<A, B> = (value: A, key: string, rec: Record<A>) => B;
/**
 * ForEachFunction used by forEach.
 */
export declare type ForEachFunction<A, B> = (value: A, key: string, rec: Record<A>) => B;
/**
 * FilterFunc used by filter.
 */
export declare type FilterFunc<A> = (value: A, key: string, rec: Record<A>) => boolean;
/**
 * ReduceFunc used by filter.
 */
export declare type ReduceFunc<A, B> = (pre: B, curr: A, key: string) => B;
/**
 * PartitionFunc
 */
export declare type PartitionFunc<A, R extends Record<A>> = (a: A, k: string, r: R) => boolean;
/**
 * GroupFunc used by group.
 */
export declare type GroupFunc<A, R extends Record<A>> = (a: A, k: string, r: R) => string;
/**
 * PickFunc used by pickKey and pickValue.
 */
export declare type PickFunc<A> = (value: A, key: string, rec: Record<A>) => boolean;
/**
 * Record is an object with an index signature.
 */
export interface Record<A> {
    [key: string]: A;
}
/**
 * assign is an Object.assign polyfill.
 *
 * It is used internally and should probably not be used directly elsewhere.
 */
export declare function assign(target: any, ..._varArgs: any[]): any;
/**
 * isRecord tests whether a value is a record.
 *
 * To be a Record, a value must be an object and:
 * 1. must not be null
 * 2. must not be an Array
 * 2. must not be an instance of Date
 * 3. must not be an instance of RegExp
 */
export declare const isRecord: <A>(value: any) => value is Record<A>;
/**
 * keys is an Object.keys shortcut.
 */
export declare const keys: (obj: object) => string[];
/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
export declare const map: <A, B>(rec: Record<A>, f: MapFunc<A, B>) => Record<B>;
/**
 * mapTo an array the properties of the provided Record.
 *
 * The elements of the array are the result of applying the function provided
 * to each property. The order of elements is not guaranteed.
 */
export declare const mapTo: <A, B>(rec: Record<A>, f: MapFunc<A, B>) => B[];
/**
 * forEach is similar to map only the result of each function call is not kept.
 *
 * The order of keys processed is not guaranteed.
 */
export declare const forEach: <A, B>(rec: Record<A>, f: ForEachFunction<A, B>) => void;
/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properties on the Record. The order of keys processed is
 * not guaranteed.
 */
export declare const reduce: <A, B>(rec: Record<A>, accum: B, f: ReduceFunc<A, B>) => B;
/**
 * filter the keys of a Record using a filter function.
 */
export declare const filter: <A>(rec: Record<A>, f: FilterFunc<A>) => Record<A>;
/**
 * merge two objects (shallow) into one new object.
 *
 * The return value's type is the product of the two objects provided.
 */
export declare const merge: <L extends object, R extends object>(left: L, right: R) => L & R;
/**
 * merge3
 */
export declare const merge3: <A extends object, B extends object, C extends object>(a: A, b: B, c: C) => A & B & C;
/**
 * merge4
 */
export declare const merge4: <A extends object, B extends object, C extends object, D extends object>(a: A, b: B, c: C, d: D) => A & B & C & D;
/**
 * merge5
 */
export declare const merge5: <A extends object, B extends object, C extends Object, D extends object, E extends object>(a: A, b: B, c: C, d: D, e: E) => any;
/**
 * rmerge merges 2 records recursively.
 *
 * This function may violate type safety.
 */
export declare const rmerge: <A, R extends Record<A>, B, S extends Record<B>>(left: R, right: S) => R & S;
/**
 * rmerge3
 */
export declare const rmerge3: <A, R extends Record<A>, B, S extends Record<B>, C, T extends Record<C>>(r: R, s: S, t: T) => R & S & T;
/**
 * rmerge4
 */
export declare const rmerge4: <A, R extends Record<A>, B, S extends Record<B>, C, T extends Record<C>, D, U extends Record<D>>(r: R, s: S, t: T, u: U) => R & S & T & U;
/**
 * rmerge5
 */
export declare const rmerge5: <A, R extends Record<A>, B, S extends Record<B>, C, T extends Record<C>, D, U extends Record<D>, E, V extends Record<E>>(r: R, s: S, t: T, u: U, v: V) => R & S & T & U & V;
/**
 * exclude removes the specified properties from a Record.
 */
export declare const exclude: <A, R extends Record<A>>(rec: R, keys: string | string[]) => Record<A>;
/**
 * partition a Record into two sub-records using a PartitionFunc function.
 *
 * This function produces an array where the first element is a Record
 * of values that return true and the second, false.
 */
export declare const partition: <A, R extends Record<A>>(r: R, f: PartitionFunc<A, R>) => [Record<A>, Record<A>];
/**
 * group the properties of a Record into another Record using a GroupFunc
 * function.
 */
export declare const group: <A, R extends Record<A>>(rec: R, f: GroupFunc<A, R>) => Record<Record<A>>;
/**
 * values returns a shallow array of the values of a record.
 */
export declare const values: <A>(r: Record<A>) => A[];
/**
 * hasKey indicates whether a Record has a given key.
 */
export declare const hasKey: (r: object, key: string) => boolean;
/**
 * clone a Record.
 *
 * Breaks references and deep clones arrays.
 * This function should only be used on Records or objects that
 * are not class instances. This function may violate type safety.
 */
export declare const clone: <A, R extends Record<A>>(r: R) => R;
/**
 * count how many properties exist on the record.
 */
export declare const count: (r: object) => number;
/**
 * empty tests whether the object has any properties or not.
 */
export declare const empty: (r: object) => boolean;
/**
 * some tests whether at least one property of a Record passes the
 * test implemented by the provided function.
 */
export declare const some: <A>(o: Record<A>, f: MapFunc<A, boolean>) => boolean;
/**
 * every tests whether each property of a Record passes the
 * test implemented by the provided function.
 */
export declare const every: <A>(o: Record<A>, f: MapFunc<A, boolean>) => boolean;
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
export declare const set: <A, R extends Record<A>>(r: R, k: Key, value: A) => R;
/**
 * isBadKey tests whether a key is problematic (Like __proto__).
 */
export declare const isBadKey: (key: string) => boolean;
/**
 * compact a Record by removing any properties that == null.
 */
export declare const compact: <A>(rec: Record<A | null | undefined>) => Record<A>;
/**
 * rcompact recursively compacts a Record.
 */
export declare const rcompact: <A>(rec: Record<A>) => Record<A>;
/**
 * make creates a new instance of a Record optionally using the provided
 * value as an initializer.
 *
 * This function is intended to assist with curbing prototype pollution by
 * configuring a setter for __proto__ that ignores changes.
 */
export declare const make: <A>(init?: Record<A>) => Record<A>;
/**
 * pickKey selects the value of the first property in a Record that passes the
 * provided test.
 */
export declare const pickKey: <A>(rec: Record<A>, test: PickFunc<A>) => Maybe<string>;
/**
 * pickValue selects the value of the first property in a Record that passes the
 * provided test.
 */
export declare const pickValue: <A>(rec: Record<A>, test: PickFunc<A>) => Maybe<A>;
