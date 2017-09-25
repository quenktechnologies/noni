
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
export const merge = <A, B>(...o: A[]): B =>

    Object.assign.apply(Object, [{}].concat(o));

/**
 * fuse is the deep version of merge
 */
export const fuse = <A, B>(...args: A[]): B =>
    args.reduce<any>((o: B, c: A = (<any>{})) =>
        reduce(c, (co: B, cc: any, k: string) =>
            Array.isArray(cc) ?
                (Array.isArray((<any>co)[k]) ?
                    merge(co, { [k]: ((<any>co)[k]).map(copy).concat(cc.map(copy)) }) :
                    merge<any, B>(co, { [k]: cc.map(copy) })) :
                typeof cc !== 'object' ?
                    merge(co, { [k]: cc }) :
                    merge<any, B>(co, {
                        [k]: (typeof (<any>co)[k] !== 'object') ?
                            merge((<any>co)[k], cc) :
                            fuse((<any>co)[k], cc)
                    }), o), {})

export const copy = <A, B>(o: A): B =>
    (Array.isArray(o)) ?
        o.map(copy) :
        (typeof o === 'object') ?
            reduce<any, any>(o, (p, c, k) =>
                merge<any, any>(p, { [k]: copy(c) }), {}) : o;

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

export type F<A, B> = (a: A) => B;

/**
 * f1 partial application.
 */
export const f1 =
    <A, B>(f: F<A, B>, ...args: A[]) => (a: A) => f.apply(null, args.concat(a));

/**
 * f2 partial application
 */
export const f2 =
    <A, B>(f: F<A, B>, ...args: A[]) => (a: A) => (aa: A) => f.apply(null, args.concat(a, aa));

/**
 * f3 partial application
 */
export const f3 =
    <A, B>(f: F<A, B>, ...args: A[]) => (a: A) => (aa: A) => (aaa: A) => f.apply(null, args.concat(a, aa, aaa));

/**
 * f4 partial application
 */
export const f4 =
    <A, B>(f: F<A, B>, ...args: A[]) => (a: A) => (aa: A) => (aaa: A) => (aaaa: A) =>
        f.apply(null, args.concat(a, aa, aaa, aaaa));

/**
 * f5 partial application
 */
export const f5 =
    <A, B>(f: F<A, B>, ...args: A[]) => (a: A) => (aa: A) => (aaa: A) => (aaaa: A) => (aaaaa: A) =>
        f.apply(null, args.concat(a, aa, aaa, aaaa, aaaaa));

/**
 * except copies an object removing a single key.
 */
export const except = <O extends Hash<V>, V>(keys: string[], o: O): O =>
    reduce(o, (p, c, k) => keys.indexOf(k) > -1 ? p : merge(p, { [k]: c }), <any>{});

