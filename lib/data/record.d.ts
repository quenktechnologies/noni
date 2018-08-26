/**
 * Record is simply a plain old ES object with an index signature.
 */
export interface Record<A> {
    [key: string]: A;
}
/**
 * isRecord tests whether a value is a record.
 *
 * Note: This function is also an unsafe type guard.
 * Use with caution.
 */
export declare const isRecord: <A>(value: any) => value is Record<A>;
/**
 * keys produces a list of property names. of a Record.
 */
export declare const keys: <A, R extends Record<A>>(value: R) => string[];
/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
export declare const map: <A, R extends Record<A>, B, S extends Record<B>>(o: R, f: (value: A, key: string, rec: R) => B) => S;
/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properites on the Record.
 * The order of keys processed is not guaranteed.
 */
export declare const reduce: <A, R extends Record<A>, S>(o: R, accum: S, f: (pre: S, curr: A, key: string) => S) => S;
/**
 * merge two or more objects into one returning the value.
 *
 * The return value's type is the product of the two types supplied.
 * This function may be unsafe.
 */
export declare const merge: <A, R extends Record<A>, B, S extends Record<B>>(left: R, right: S) => R & S;
/**
 * rmerge merges nested records recursively.
 *
 * This function may be unsafe.
 */
export declare const rmerge: <A, R extends Record<A>, B, S extends Record<B>>(left: R, right: S) => R & S;
/**
 * exclude removes the specified properties from a Record.
 */
export declare const exclude: <A, R extends Record<A>>(o: R, ...keys: string[]) => {};
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
