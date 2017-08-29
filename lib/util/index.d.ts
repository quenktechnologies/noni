export interface GenericFunction<A, B> {
    (a: A): B;
}
export interface Hash<A> {
    [key: string]: A;
}
export interface ObjectReducer<A, B> {
    (accum?: B, value?: A, key?: string, hash?: Hash<A>): B;
}
export interface ObjectMapper<A, B> {
    (value?: A, key?: string, hash?: Hash<A>): B;
}
/**
 * identity is the famed identity function.
 */
export declare const identity: <A>(a: A) => A;
export interface O<A> {
    [key: string]: A;
}
/**
 * merge two objects easily
 */
export declare const merge: <A, B>(...o: A[]) => B;
/**
 * reduce an object's keys (in no guaranteed order)
 */
export declare const reduce: <A, B>(o: Hash<A>, f: ObjectReducer<A, B>, accum?: B) => B;
/**
 * map over an object (in no guaranteed oreder)
 */
export declare const map: <A, B>(o: Hash<A>, f: ObjectMapper<A, B>) => B[];
/**
 * compose two functions into one.
 */
export declare const compose: <A, B, C>(f: (a: B) => C, g: (a: A) => B) => (x: A) => C;
/**
 * fling removes a key from an object
 * @param {string} key
 * @param {object} object
 * @return {Object}
 * @summary {(string,Object) →  Object}
 */
export declare const fling: <A>(s: string, o: Hash<A>) => {};
/**
 * head returns the item at index 0 of an array
 * @param {Array} list
 * @return {*}
 * @summary { Array →  * }
 */
export declare const head: <A>(list: A[]) => A;
/**
 * tail returns the last item in an array
 * @param {Array} list
 * @return {*}
 * @summary {Array →  *}
 */
export declare const tail: <A>(list: A[]) => A;
/**
 * constant given a value, return a function that always returns this value.
 * @summary constant X →  * →  X
 *
 */
export declare const constant: <A>(a: A) => (_: any) => A;
