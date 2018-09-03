/**
 * test provides basic type tests common when working with ECMAScript.
 */
/**
 * Pattern is the value used to match expressions.
 */
export declare type Pattern = string | number | boolean | object | {
    new (...args: any[]): object;
};
/**
 * isObject test.
 *
 * Does not consider an Array an object.
 */
export declare const isObject: (value: any) => value is object;
/**
 * isArray test.
 */
export declare const isArray: (arg: any) => arg is any[];
/**
 * isString test.
 */
export declare const isString: (value: any) => value is string;
/**
 * isNumber test.
 */
export declare const isNumber: (value: any) => value is Number;
/**
 * isBoolean test.
 */
export declare const isBoolean: (value: any) => value is boolean;
/**
 * is performs a typeof of check on a type.
 */
export declare const is: <A>(expected: string) => (value: A) => boolean;
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
export declare const test: <V>(value: V, t: Pattern) => boolean;
