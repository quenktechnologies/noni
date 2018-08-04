/**
 * Record is simply a plain old ES object with an index signature.
 */
export interface Record<A> {
    [key: string]: A;
}
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
