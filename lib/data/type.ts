/**
 * test provides basic type tests common when working with ECMAScript.
 */

/**
 * Pattern is the value used to match expressions.
 */
export type Pattern
    = string
    | number
    | boolean
    | object
    | { new(...args: any[]): object }
    ;

const prims = ['string', 'number', 'boolean'];

/**
 * isObject test.
 *
 * Does not consider an Array an object.
 */
export const isObject = (value: any): value is object =>
    (typeof value === 'object') && (!isArray(value));

/**
 * isArray test.
 */
export const isArray = Array.isArray;

/**
 * isString test.
 */
export const isString = (value: any): value is string => typeof value === 'string';

/**
 * isNumber test.
 */
export const isNumber = (value: any): value is Number =>
    (typeof value === 'number') && (!isNaN(value))

/**
 * isBoolean test.
 */
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';

/**
 * isFunction test.
 */
export const isFunction = (value: any): value is (<A, B>(a: A) => B) => typeof value === 'function';

/**
 * isPrim test.
 */
export const isPrim = (value: any) =>
    !(isObject(value) ||
        isArray(value) ||
        isFunction(value))

/**
 * is performs a typeof of check on a type.
 */
export const is = <A>(expected: string) => (value: A) => typeof (value) === expected;

/**
 * test whether a value conforms to some pattern.
 *
 * This function is made available mainly for a crude pattern matching 
 * machinery that works as followss:
 * string   -> Matches on the value of the string.
 * number   -> Matches on the value of the number.
 * boolean  -> Matches on the value of the boolean.
 * object   -> Each key of the object is matched on the value, all must match.
 * function -> Treated as a constructor and results in an instanceof check or
 *             for String,Number and Boolean, this uses the typeof check. If
 *             the function is RegExp then we uses the RegExp.test function
 *             instead.
 */
export const test = <V>(value: V, t: Pattern): boolean =>
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
                            test((<{ [key: string]: any }>value)[k],
                                (<{ [key: string]: any }>t)[k]) : false) :
                    false;

/**
 * show the type of a value.
 *
 * Note: This may crash if the value is an
 * object literal with recursive references.
 */
export const show = <A>(value: A): string => {

    if (typeof value === 'object') {

        if (Array.isArray(value))
            return `[${value.map(show)}]`
        else if (value.constructor !== Object)
            return ((<any>value.constructor).name || value.constructor);
        else
            return JSON.stringify(value);

    } else {

        return '' + value;

    }

}
