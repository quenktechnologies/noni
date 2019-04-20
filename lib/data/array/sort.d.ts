/**
 * Useful functions for sorting data in an array.
 *
 * The functions are expected to be passed to Array#sort.
 * Defaults to ascending order unless specified otherwise.
 */
/**
 * Rank type.
 */
export declare type Rank = 1 | 0 | -1;
/**
 * Sorter function type.
 */
export declare type Sorter<A> = (a: A, b: A) => Rank;
/**
 * date sorts two strings representing dates.
 *
 * The dates are passed to the date constructor.
 */
export declare const date: (a: string, b: string) => Rank;
/**
 * string sorts two strings by first lower casing them.
 */
export declare const string: (a: string, b: string) => Rank;
/**
 * number sort
 */
export declare const number: (a: any, b: any) => Rank;
/**
 * natural sort impelmentation.
 */
export declare const natural: (a?: any, b?: any) => Rank;
