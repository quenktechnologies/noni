/**
 * test provides basic type tests common when working with ES.
 */
import { Record } from './record';
/**
 * Pattern is the value used to match expressions.
 */
export declare type Pattern = string | number | boolean | object | Record<any> | {
    new (...args: any[]): object;
};
/**
 * isRecord test.
 *
 * An array is not considered Record.
 */
export declare const isRecord: <A>(value: any) => value is Record<A>;
/**
 * isArray test.
 */
export declare const isArray: (arg: any) => arg is any[];
/**
 * is performs a typeof of check on a type.
 */
export declare const is: <A>(expected: string) => (value: A) => boolean;
/**
 * isNumber test.
 */
export declare const isNumber: (value: any) => value is Number;
/**
 * isObject test.
 */
export declare const isObject: (value: any) => value is object;
/**
 * isString test.
 */
export declare const isString: (value: any) => value is string;
/**
 * isBoolean test.
 */
export declare const isBoolean: (value: any) => value is boolean;
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
export declare const typeOf: <V>(value: V, t: Pattern) => boolean;
