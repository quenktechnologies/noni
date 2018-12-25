/**
 * This module provides a syntax and associated functions for
 * getting and setting values on ES objects easily.
 *
 * Given a path, a value can either be retrieved or set on an object.
 *
 * The path syntax follows typical ES dot notation, bracket notation or a mixture
 * of both.
 *
 * Note that quotes are not used when describing a path via bracket notation.
 *
 * If you need to use the dots or square brackets in your paths, escape them
 * as follows:
 *
 * "." -> ".."
 * "[" -> "[["
 * "]" -> "]]"
 */
/** imports **/
import { Maybe } from '../maybe';
import { Record } from './';
/**
 * Path representing a path to a value in an object.
 */
export declare type Path = string;
/**
 * Token represents the name of a single property (not a path to one!).
 */
export declare type Token = string;
/**
 * tokenize a path into a list of sequential property names.
 */
export declare const tokenize: (str: string) => string[];
/**
 * unsafeGet retrieves a value at the specified path
 * on any ES object.
 *
 * This function does not check if getting the value succeeded or not.
 */
export declare const unsafeGet: <A>(path: string, src: Record<A>) => A;
/**
 * get a value from a Record given its path safely.
 */
export declare const get: <A>(path: string, src: Record<A>) => Maybe<A>;
/**
 * set sets a value on an object given a path.
 */
export declare const set: <A, R extends Record<A>>(p: string, v: A, r: R) => R;
/**
 * escape a path so that occurences of dots and brackets are not interpreted
 * as paths.
 */
export declare const escape: (p: string) => string;
/**
 * unescape a path that has been previously escaped.
 */
export declare const unescape: (p: string) => string;
/**
 * escapeRecord escapes each property of a record recursively.
 */
export declare const escapeRecord: <A>(r: Record<A>) => Record<A>;
/**
 * unescapeRecord unescapes each property of a record recursively.
 */
export declare const unescapeRecord: <A>(r: Record<A>) => Record<A>;
