/**
 * The record module provides functions for manipulating ES objects used
 * as records.
 *
 * Some of the functions provided here are inherently unsafe (the compiler 
 * would not be able to verify the runtime value) and may result in crashes
 * if not used carefully.
 */

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
