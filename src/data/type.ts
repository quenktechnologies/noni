/**
 * test provides basic type tests common when working with ES.
 */
import { Record } from './record';

/**
 * Pattern is the value used to match expressions.
 */
export type Pattern
    = string
    | number
    | boolean
    | object
  | Record<any>
    | { new(...args: any[]): object }
    ;

const prims = ['string', 'number', 'boolean'];

/**
 * isRecord test.
 *
 * An array is not considered Record.
 */
export const isRecord = <A>(value: any): value is Record<A> =>
    (typeof value === 'object') && (!Array.isArray(value));

/**
 * isArray test.
 */
export const isArray = Array.isArray;

/**
 * is performs a typeof of check on a type.
 */
export const is = <A>(expected: string) => (value: A) => typeof (value) === expected;

/**
 * isNumber test.
 */
export const isNumber = (value: any): value is Number =>
    (typeof value === 'number') && (!isNaN(value))

/**
 * isObject test.
 */
export const isObject = (value: any): value is object => typeof value === 'object';

/**
 * isString test.
 */
export const isString = (value: any): value is string => typeof value === 'string';

/**
 * isBoolean test.
 */
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';

/**
 * typeOf determines if some value loosely conforms to a specified type.
 *
 * It can be used to implement a sort of pattern matching and works as follows:
 * string   -> Matches on the value of the string.
 * number   -> Matches on the value of the number.
 * boolean  -> Matches on the value of the boolean.
 * object   -> Each key of the object is matched on the value, all must match.
 * function -> Treated as a constructor and results in an instanceof check or
 *             for String,Number and Boolean, this uses the typeof check.
 */
export const typeOf = <V>(value: V, t: Pattern): boolean =>
  ((prims.indexOf(typeof t) > -1) && (<any>value === t)) ?
        true :
        ((typeof t === 'function') &&
            (((<Function>t === String) && (typeof value === 'string')) ||
                ((<Function>t === Number) && (typeof value === 'number')) ||
                ((<Function>t === Boolean) && (typeof value === 'boolean')) ||
                ((<Function>t === Array) && (Array.isArray(value))) ||
                (value instanceof <Function>t))) ?
            true :
            ((t instanceof RegExp) && ((typeof value === 'string') && t.test(value))) ?
                true :
                ((typeof t === 'object') && (typeof value === 'object')) ?
                    Object
                        .keys(t)
                        .every(k => value.hasOwnProperty(k) ?
                          typeOf((<Record<any>>value)[k], (<Record<any>>t)[k]) : false) :
                    false;


