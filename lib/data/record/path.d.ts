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
 * If you need to use a dot or square brackets in your paths, prefix them with
 * the "\" (backslash) character.
 */
/** imports **/
import { Maybe } from '../maybe';
import { Record } from './';
/**
 * Path representing a path to a value in an object.
 */
export declare type Path = string;
/**
 * FlatRecord represents a flat Record where the keys are actually
 * paths to a more complex one.
 */
export interface FlatRecord<A> {
    [key: string]: A;
}
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
 * getDefault is like get but takes a default value to return if
 * the path is not found.
 */
export declare const getDefault: <A>(path: string, src: Record<A>, def: A) => A;
/**
 * getString casts the resulting value to a string.
 *
 * An empty string is provided if the path is not found.
 */
export declare const getString: <A>(path: string, src: Record<A>) => string;
/**
 * set sets a value on an object given a path.
 */
export declare const set: <A, R extends Record<A>>(p: string, v: A, r: R) => R;
/**
 * escape a path so that occurences of dots are not interpreted as paths.
 *
 * This function escapes dots and dots only.
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
/**
 * flatten an object into a Record where each key is a path to a non-complex
 * value or array.
 *
 * If any of the paths contain dots, they will be escaped.
 */
export declare const flatten: <A>(r: Record<A>) => FlatRecord<A>;
/**
 * unflatten a flattened Record so that any nested paths are expanded
 * to their full representation.
 */
export declare const unflatten: <A>(r: FlatRecord<A>) => Record<A>;
/**
 * intersect set operation between the keys of two records.
 *
 * All the properties of the left record that have matching property
 * names in the right are retained.
 */
export declare const intersect: <A, B>(a: Record<A>, b: Record<B>) => Record<A>;
/**
 * difference set operation between the keys of two records.
 *
 * All the properties on the left record that do not have matching
 * property names in the right are retained.
 */
export declare const difference: <A, B>(a: Record<A>, b: Record<B>) => Record<A>;
/**
 * map over the property names of a record.
 */
export declare const map: <A>(a: Record<A>, f: (s: string) => string) => Record<A>;
/**
 * project a Record according to the field specification given.
 *
 * Only properties that appear in the spec and set to true will be retained.
 * This function is not safe. It may leave undefined values in the resulting
 * record.
 */
export declare const project: <A>(spec: FlatRecord<boolean>, rec: Record<A>) => Record<A>;
