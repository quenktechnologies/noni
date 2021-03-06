
/**
 * Type is an alias for <any>.
 */
export type Type = any;

/**
 * Pattern is the value used to match expressions.
 */
export type Pattern<T>
    = string
    | number
    | boolean
    | object
    | { new(...args: Type[]): T }
    ;

const prims = ['string', 'number', 'boolean'];

/**
 * Any is a class used to represent typescript's "any" type.
 */
export class Any { }

/**
 * isObject test.
 *
 * Does not consider an Array an object.
 */
export const isObject = (value: Type): value is object =>
    (typeof value === 'object') && (!isArray(value));

/**
 * isArray test.
 */
export const isArray = Array.isArray;

/**
 * isString test.
 */
export const isString = (value: Type): value is string =>
    typeof value === 'string';

/**
 * isNumber test.
 */
export const isNumber = (value: Type): value is number =>
    (typeof value === 'number') && (!isNaN(value))

/**
 * isBoolean test.
 */
export const isBoolean = (value: Type): value is boolean =>
    typeof value === 'boolean';

/**
 * isFunction test.
 */
export const isFunction = (value: Type): value is (<A, B>(a: A) => B) =>
    typeof value === 'function';

/**
 * isPrim test.
 */
export const isPrim = (value: Type) =>
    !(isObject(value) ||
        isArray(value) ||
        isFunction(value))

/**
 * is performs a typeof of check on a type.
 */
export const is = <A>(expected: string) => (value: A) =>
    typeof (value) === expected;

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
export const test = <V, T>(value: V, t: Pattern<T>): boolean => {

    if ((prims.indexOf(typeof t) > -1) && (<Type>value === t))

        return true;

    else if ((typeof t === 'function') &&
        (((<Function>t === String) && (typeof value === 'string')) ||
            ((<Function>t === Number) && (typeof value === 'number')) ||
            ((<Function>t === Boolean) && (typeof value === 'boolean')) ||
            ((<Function>t === Array) && (Array.isArray(value))) ||
            (<Function>t === Any) ||
            (value instanceof <Function>t)))

        return true;

    else if ((t instanceof RegExp) &&
        ((typeof value === 'string') &&
            t.test(value)))

        return true;

    else if ((typeof t === 'object') && (typeof value === 'object'))
        return Object
            .keys(t)
            .every(k => Object.hasOwnProperty.call(value, k) ?
                test((<{ [key: string]: Type }>value)[k],
                    (<{ [key: string]: Type }>t)[k]) : false)
    return false;

}

/**
 * show the type of a value.
 *
 * Note: This may crash if the value is an
 * object literal with recursive references.
 */
export const show = <A>(value: A): string => {

    if (typeof value === 'object') {

        if (Array.isArray(value))
            return `[${(<Type>value).map(show)}];`
        else if ((<Type>value).constructor !== Object)
            return ((<Type>(<Type>value).constructor).name ||
                (<Type>value).constructor);
        else
            return JSON.stringify(value);

    } else {

        return '' + value;

    }

}

/**
 * toString casts a value to a string.
 *
 * If the value is null or undefined an empty string is returned instead of
 * the default.
 */
export const toString = (val: Type): string =>
    (val == null) ? '' : String(val);
