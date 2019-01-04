/**
 * The match module provides a best effort pattern runtime pattern matching
 * framework for ECMAScript.
 *
 * Example:
 * ```ts
 *
 *    let r:string = match(window.global)
 *                   .caseOf(1, (_:number) => 'one')
 *                   .caseOf('one', (n:string) => n)
 *                   .orElse(()=> 'N/A')
 *                   .end();
 *
 * ```
 * This framework uses the data/type#test function to do the actual
 * pattern matching and attention must be paid to the rules of that
 * function to avoid unexpected errors.
 *
 * Great effort was made to try and make the `caseOf` methods as
 * type safe as possible however it is still possible to evade the compiler
 * especially when the first argument is a shape (object with keys describing
 * allowed types).
 *
 */
import { Constructor } from '../data/type/constructor';
/**
 * Result is the sum of the UnMatched and Matched types.
 */
export declare type Result<A> = UnMatched<A> | Matched<A>;
/**
 * UnMatched represents a value yet to have a successful match.
 */
export declare class UnMatched<A> {
    value: A;
    constructor(value: A);
    /**
     * caseOf test.
     */
    caseOf<T, B>(pattern: Constructor<T>, f: (value: T) => B): Result<A | B>;
    caseOf<B>(pattern: String, f: (value: string) => B): Result<A | B>;
    caseOf<B>(pattern: Number, f: (value: number) => B): Result<A | B>;
    caseOf<B>(pattern: Boolean, f: (value: boolean) => B): Result<A | B>;
    caseOf<T extends object, B>(pattern: T, f: (value: {
        [P in keyof T]: any;
    }) => B): Result<A | B>;
    caseOf<T extends string, B>(pattern: T, f: (value: T) => B): Result<A | B>;
    caseOf<T extends number, B>(pattern: T, f: (value: T) => B): Result<A | B>;
    caseOf<T extends boolean, B>(pattern: T, f: (value: T) => B): Result<A | B>;
    /**
     * orElse produces the alternative value since no cases have been matched yet.
     */
    orElse<B>(f: (a: A) => B): Matched<A | B>;
    /**
     * end
     *
     * Calling end on an UnMatched is an error.
     */
    end(): A;
}
/**
 * Matched represents a succefully matched case.
 */
export declare class Matched<A> {
    value: A;
    constructor(value: A);
    /**
     * caseOf does nothing.
     */
    caseOf<T, B>(pattern: Constructor<T>, f: (value: T) => B): Result<A | B>;
    caseOf<B>(pattern: String, f: (value: string) => B): Result<A | B>;
    caseOf<B>(pattern: Number, f: (value: number) => B): Result<A | B>;
    caseOf<B>(pattern: Boolean, f: (value: boolean) => B): Result<A | B>;
    caseOf<T extends object, B>(pattern: T, f: (value: {
        [P in keyof T]: any;
    }) => B): Result<A | B>;
    caseOf<T extends string, B>(pattern: T, f: (value: T) => B): Result<A | B>;
    caseOf<T extends number, B>(pattern: T, f: (value: T) => B): Result<A | B>;
    caseOf<T extends boolean, B>(pattern: T, f: (value: T) => B): Result<A | B>;
    /**
     * orElse does nothing.
     */
    orElse<B>(_: (a: A) => B): Matched<A | B>;
    /**
     * end produces the value the Matched was created with.
     */
    end(): A;
}
/**
 * match wraps a value in an UnMatched so that case tests can be applied.
 */
export declare const match: <A>(value: A) => Result<A>;
