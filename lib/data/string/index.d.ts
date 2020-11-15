/**
 *  Common functions used to manipulate strings.
 */
import { Record } from '../record';
export interface InterpolateOptions {
    start?: string;
    end?: string;
    regex?: string;
    leaveMissing?: boolean;
    applyFunctions?: boolean;
}
/**
 * startsWith polyfill.
 */
export declare const startsWith: (str: string, search: string, pos?: number) => boolean;
/**
 * endsWith polyfill.
 */
export declare const endsWith: (str: string, search: string, this_len?: number) => number | boolean;
/**
 * contains uses String#indexOf to determine if a substring occurs
 * in a string.
 */
export declare const contains: (str: string, match: string) => boolean;
/**
 * camelCase transforms a string into camelCase.
 */
export declare const camelCase: (str: string) => string;
/**
 * classCase is like camelCase except the first letter of the string is
 * upper case.
 */
export declare const classCase: (str: string) => string;
/**
 * capitalize a string.
 *
 * Note: spaces are treated as part of the string.
 */
export declare const capitalize: (str: string) => string;
/**
 * uncapitalize a string.
 *
 * Note: spaces are treated as part of the string.
 */
export declare const uncapitalize: (str: string) => string;
/**
 * interpolate a template string replacing variable paths with values
 * in the data object.
 */
export declare const interpolate: (str: string, data: Record<any>, opts?: InterpolateOptions) => string;
/**
 * propercase converts a string into Proper Case.
 */
export declare const propercase: (str: string) => string;
/**
 * alpha omits characters in a string not found in the english alphabet.
 */
export declare const alpha: (str: string) => string;
/**
 * numeric omits characters in a string that are decimal digits.
 */
export declare const numeric: (str: string) => string;
/**
 * alhpaNumeric omits characters not found in the english alhpabet and not
 * decimal digits.
 */
export declare const alphaNumeric: (str: string) => string;
