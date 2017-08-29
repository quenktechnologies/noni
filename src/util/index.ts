
export interface GenericFunction<A, B> {
    (a: A): B
}

export interface Hash<A> {

    [key: string]: A

};

export interface ObjectReducer<A, B> {

    (accum?: B, value?: A, key?: string, hash?: Hash<A>): B

}

export interface ObjectMapper<A, B> {

    (value?: A, key?: string, hash?: Hash<A>): B

}

/**
 * identity is the famed identity function.
 */
export const identity = <A>(a: A): A => a;

export interface O<A> {

    [key: string]: A

}

/**
 * merge two objects easily
 */
export const merge = <A>(...o: A[]): O<A> =>
    Object.assign.apply(Object, o);

/**
 * reduce an object's keys (in no guaranteed order)
 */
export const reduce = <A, B>(o: Hash<A>, f: ObjectReducer<A, B>, accum?: B) =>
    Object.keys(o).reduce((p, k) => f(p, o[k], k, o), accum);

/**
 * map over an object (in no guaranteed oreder)
 */
export const map = <A, B>(o: Hash<A>, f: ObjectMapper<A, B>) =>
    Object.keys(o).map((k => f(o[k], k, o)));

/**
 * compose two functions into one.
 */
export const compose = <A, B, C>(f: (a: B) => C, g: (a: A) => B) => (x: A) => f(g(x));

/**
 * fling removes a key from an object
 * @param {string} key
 * @param {object} object
 * @return {Object}
 * @summary {(string,Object) →  Object}
 */
export const fling = <A>(s: string, o: Hash<A>) => {

    if ((o == null) || (o.constructor !== Object))
        throw new TypeError('fling(): only works with object literals!');

    return Object.keys(o).reduce((o2, k) => k === s ? o2 : merge(o2, {
        [k]: o[k]
    }), {});

}

/**
 * head returns the item at index 0 of an array
 * @param {Array} list
 * @return {*}
 * @summary { Array →  * }
 */
export const head = <A>(list: A[]) => list[0];

/**
 * tail returns the last item in an array
 * @param {Array} list
 * @return {*}
 * @summary {Array →  *}
 */
export const tail = <A>(list: A[]) => list[list.length - 1];

/**
 * constant given a value, return a function that always returns this value.
 * @summary constant X →  * →  X
 *
 */
export const constant = <A>(a: A): ((_: any) => A) => () => a;
