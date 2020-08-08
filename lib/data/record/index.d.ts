/**
 * Key is a single level path on a record.
 *
 * Dots are not treated as path separators but rather literal dots.
 */
export declare type Key = string;
/**
 * MapFunc
 */
export declare type MapFunc<A, B> = (value: A, key: string, rec: Record<A>) => B;
/**
 * FilterFunc
 */
export declare type FilterFunc<A> = (value: A, key: string, rec: Record<A>) => boolean;
/**
 * ReduceFunc
 */
export declare type ReduceFunc<A, B> = (pre: B, curr: A, key: string) => B;
/**
 * PartitionFunc
 */
export declare type PartitionFunc<A, R extends Record<A>> = (a: A, k: string, r: R) => boolean;
/**
 * GroupFunc
 */
export declare type GroupFunc<A, R extends Record<A>> = (a: A, k: string, r: R) => string;
/**
 * Record is an ES object with an index signature.
 */
export interface Record<A> {
    [key: string]: A;
}
/**
 * assign is an Object.assign polyfill.
 *
 * It is used internally and should probably never be used directly in
 * production code.
 */
export declare function assign(target: any, ..._varArgs: any[]): any;
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
export declare const isRecord: <A>(value: any) => value is Record<A>;
/**
 * keys produces a list of property names from a Record.
 */
export declare const keys: (value: object) => string[];
/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
export declare const map: <A, B>(o: Record<A>, f: MapFunc<A, B>) => Record<B>;
/**
 * mapTo maps over a Record's properties producing an array of each result.
 *
 * The order of elements in the array is not guaranteed.
 */
export declare const mapTo: <A, B>(o: Record<A>, f: MapFunc<A, B>) => B[];
/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properites on the Record.
 * The order of keys processed is not guaranteed.
 */
export declare const reduce: <A, B>(o: Record<A>, accum: B, f: ReduceFunc<A, B>) => B;
/**
 * filter the keys of a record using a filter function.
 */
export declare const filter: <A>(o: Record<A>, f: FilterFunc<A>) => Record<A>;
/**
 * merge two objects into one.
 *
 * The return value's type is the product of the two types supplied.
 * This function may be unsafe.
 */
export declare const merge: <L extends object, R extends object>(left: L, right: R) => L & R;
/**
 * merge3 merges 3 records into one.
 */
export declare const merge3: <A extends object, B extends object, C extends object>(a: A, b: B, c: C) => A & B & C;
/**
 * merge4 merges 4 records into one.
 */
export declare const merge4: <A extends object, B extends object, C extends object, D extends object>(a: A, b: B, c: C, d: D) => A & B & C & D;
/**
 * merge5 merges 5 records into one.
 */
export declare const merge5: <A extends object, B extends object, C extends Object, D extends object, E extends object>(a: A, b: B, c: C, d: D, e: E) => any;
/**
 * rmerge merges 2 records recursively.
 *
 * This function may be unsafe.
 */
export declare const rmerge: <A, R extends Record<A>, B, S extends Record<B>>(left: R, right: S) => R & S;
/**
 * rmerge3 merges 3 records recursively.
 */
export declare const rmerge3: <A, R extends Record<A>, B, S extends Record<B>, C, T extends Record<C>>(r: R, s: S, t: T) => R & S & T;
/**
 * rmerge4 merges 4 records recursively.
 */
export declare const rmerge4: <A, R extends Record<A>, B, S extends Record<B>, C, T extends Record<C>, D, U extends Record<D>>(r: R, s: S, t: T, u: U) => R & S & T & U;
/**
 * rmerge5 merges 5 records recursively.
 */
export declare const rmerge5: <A, R extends Record<A>, B, S extends Record<B>, C, T extends Record<C>, D, U extends Record<D>, E, V extends Record<E>>(r: R, s: S, t: T, u: U, v: V) => R & S & T & U & V;
/**
 * exclude removes the specified properties from a Record.
 */
export declare const exclude: <A, R extends Record<A>>(o: R, keys: string | string[]) => Record<A>;
/**
 * partition a Record into two sub-records using a separating function.
 *
 * This function produces an array where the first element is a record
 * of passing values and the second the failing values.
 */
export declare const partition: <A, R extends Record<A>>(r: R, f: PartitionFunc<A, R>) => [Record<A>, Record<A>];
/**
 * group the properties of a Record into another Record using a grouping
 * function.
 */
export declare const group: <A, R extends Record<A>>(rec: R, f: GroupFunc<A, R>) => Record<Record<A>>;
/**
 * values returns a shallow array of the values of a record.
 */
export declare const values: <A>(r: Record<A>) => A[];
/**
 * contains indicates whether a Record has a given key.
 */
export declare const contains: (r: object, key: string) => boolean;
/**
 * clone a Record.
 *
 * Breaks references and deep clones arrays.
 * This function should only be used on Records or objects that
 * are not class instances.
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
export declare const some: <A, B>(o: Record<A>, f: MapFunc<A, B>) => boolean;
/**
 * every tests whether each property of a Record passes the
 * test implemented by the provided function.
 */
export declare const every: <A, B>(o: Record<A>, f: MapFunc<A, B>) => boolean;
/**
 * set the value of a key on a Record ignoring problematic keys.
 *
 * This function exists to avoid unintentionally setting problem keys such
 * as __proto__ on an object.
 *
 * The function modifies the passed record.
 */
export declare const set: <A, R extends Record<A>>(r: R, k: Key, value: A) => R;
