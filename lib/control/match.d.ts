import { Pattern } from '../data/type';
/**
 * Result represents the state of applying pattern matching to a value.
 *
 * It is either matched or unmatched.
 */
export interface Result<V> {
    caseOf<A, B>(t: Pattern, f: (a: A | V) => B): Result<V | B>;
    orElse<A, B>(f: (a: A | V) => B): Result<V | B>;
    end(): V;
}
/**
 * UnMatchedResult represents a yet to be matched pattern.
 */
export declare class UnMatchedResult<V> implements Result<V> {
    value: V;
    constructor(value: V);
    caseOf<A, B>(p: Pattern, f: (a: A | V) => B): Result<V | B>;
    orElse<B>(f: (a: V) => B): Result<B>;
    end(): V;
}
/**
 * MatchedResult indicates a successful pattern match.
 */
export declare class MatchedResult<V> implements Result<V> {
    value: V;
    constructor(value: V);
    caseOf<A, B>(_p: Pattern, _f: (x: A | V) => B): Result<V>;
    orElse<A, B>(_f: (x: V | A) => B): Result<V>;
    end(): V;
}
/**
 * match expression.
 */
export declare const match: <V>(value: any) => Result<V>;
