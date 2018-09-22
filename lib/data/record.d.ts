/**
 * Record is an ES object with an index signature.
 */
export interface Record<A> {
    [key: string]: A;
}
/**
 * isRecord tests whether a value is a record.
 *
 * This is a typeof check that excludes arrays.
 *
 * Unsafe.
 */
export declare const isRecord: <A>(value: any) => value is Record<A>;
/**
 * keys produces a list of property names from a Record.
 */
export declare const keys: <A>(value: Record<A>) => string[];
/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
export declare const map: <A, B, R extends Record<B>>(o: Record<A>, f: (value: A, key: string, rec: Record<A>) => B) => R;
/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properites on the Record.
 * The order of keys processed is not guaranteed.
 */
export declare const reduce: <A, B>(o: Record<A>, accum: B, f: (pre: B, curr: A, key: string) => B) => B;
/**
 * merge two objects into one.
 *
 * The return value's type is the product of the two types supplied.
 * This function may be unsafe.
 */
export declare const merge: <A, R extends Record<A>, B, S extends Record<B>>(left: R, right: S) => R & S;
/**
 * merge3 merges 3 records into one.
 */
export declare const merge3: <A, R extends Record<A>, B, S extends Record<B>, C, T extends Record<C>>(r: R, s: S, t: T) => any;
/**
 * merge4 merges 4 records into one.
 */
export declare const merge4: <A, R extends Record<A>, B, S extends Record<B>, C, T extends Record<C>, D, U extends Record<D>>(r: R, s: S, t: T, u: U) => any;
/**
 * merge5 merges 5 records into one.
 */
export declare const merge5: <A, R extends Record<A>, B, S extends Record<B>, C, T extends Record<C>, D, U extends Record<D>, E, V extends Record<E>>(r: R, s: S, t: T, u: U, v: V) => any;
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
export declare const exclude: <A, R extends Record<A>>(o: R, keys: string | string[]) => {};
/**
 * flatten an object into a map of key value pairs.
 *
 * The keys are the paths on the objects where the value would have been
 * found.
 *
 * Note: This function does not give special treatment to properties
 * with dots in them.
 */
export declare const flatten: <A, R extends Record<A>>(r: R) => Record<A>;
/**
 * partition a Record into two sub-records using a separating function.
 *
 * This function produces an array where the first element is a record
 * of passing values and the second the failing values.
 */
export declare const partition: <A, R extends Record<A>>(r: R) => (f: (a: A, k: string, r: R) => boolean) => [Record<A>, Record<A>];
/**
 * group the properties of a Record into another Record using a grouping
 * function.
 */
export declare const group: <A, R extends Record<A>>(r: R) => (f: (a: A, k: string, r: R) => string) => Record<Record<A>>;
/**
 * values returns a shallow array of the values of a record.
 */
export declare const values: <A, R extends Record<A>>(r: R) => A[];
