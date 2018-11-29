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
 * camelCase transforms a string into CamelCase.
 */
export declare const camelCase: (str: string) => string;
