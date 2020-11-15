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
 * camelcase transforms a string into camelCase.
 */
export declare const camelcase: (str: string) => string;
/**
 * classcase is like camelCase except the first letter of the string is
 * upper case.
 */
export declare const classcase: (str: string) => string;
/**
 * modulecase transforms a string into module-case.
 */
export declare const modulecase: (str: string) => string;
/**
 * propercase converts a string into Proper Case.
 */
export declare const propercase: (str: string) => string;
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
 * alpha omits characters in a string not found in the English alphabet.
 */
export declare const alpha: (str: string) => string;
/**
 * numeric omits characters in a string that are decimal digits.
 */
export declare const numeric: (str: string) => string;
/**
 * alhpanumeric omits characters not found in the English alphabet and not
 * decimal digits.
 */
export declare const alphanumeric: (str: string) => string;
