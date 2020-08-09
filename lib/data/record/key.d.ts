/**
 * This module provides functions for operating on Records based on their
 * keys.
 */
/** imports */
import { Record } from './';
/**
 * MapFunc used by mapKeys
 */
export declare type MapFunc<A> = (key: string, value: A, rec: Record<A>) => string;
/**
 * map maps over the property names of a Record producing a new Record
 * with its keys produced by the MapFunc provided.
 */
export declare const map: <A>(rec: Record<A>, f: MapFunc<A>) => Record<A>;
/**
 * intersect set operation.
 *
 * Produces a new Record containing only the properties of the keys
 * that intersect the two records. The value of the properties are sourced
 * from the left Record.
 */
export declare const intersect: <A, B>(left: Record<A>, right: Record<B>) => Record<A>;
/**
 * difference set operation.
 *
 * Produces a new Record containing the propertiesof the left Record less
 * any keys appearing in the right one.
 */
export declare const difference: <A, B>(left: Record<A>, right: Record<B>) => Record<A>;
/**
 * project a Record according to the field specification given.
 *
 * This does not treat the keys of the spec object as paths.
 * For that, use the project function from the path submodule.
 */
export declare const project: <A>(spec: Record<boolean>, rec: Record<A>) => Record<A>;
