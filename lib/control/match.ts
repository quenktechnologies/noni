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
import { test,show } from '../data/type';

export type Cons<T> = { new(...args: any[]): T };

/**
 * Result is the sum of the UnMatched and Matched types.
 */
export type Result<A>
    = UnMatched<A>
    | Matched<A>
    ;

/**
 * UnMatched represents a value yet to have a successful match.
 */
export class UnMatched<A> {

    constructor(public value: A) { }

    /**
     * caseOf test.
     */
    caseOf<T, B>(pattern: Cons<T>, f: (value: T) => B): Result<A | B>
    caseOf<B>(pattern: String, f: (value: string) => B): Result<A | B>
    caseOf<B>(pattern: Number, f: (value: number) => B): Result<A | B>
    caseOf<B>(pattern: Boolean, f: (value: boolean) => B): Result<A | B>
    caseOf<T extends object, B>(pattern: T, f: (value: { [P in keyof T]: any }) => B): Result<A | B>
    caseOf<T extends string, B>(pattern: T, f: (value: T) => B): Result<A | B>
    caseOf<T extends number, B>(pattern: T, f: (value: T) => B): Result<A | B>
    caseOf<T extends boolean, B>(pattern: T, f: (value: T) => B): Result<A | B>
    caseOf<B>(pattern: any, f: (value: any) => B): Result<A | B> {

        return test(this.value, pattern) ?
            new Matched<B>(f(this.value)) : this;

    }

    /**
     * orElse produces the alternative value since no cases have been matched yet.
     */
    orElse<B>(f: (a: A) => B): Matched<A | B> {

        return new Matched<B>(f(this.value));

    }

    /**
     * end
     *
     * Calling end on an UnMatched is an error.
     */
    end(): A {

        throw new Error(`The pattern '${show(this.value)}' was not matched!`);

    }

}

/**
 * Matched represents a succefully matched case.
 */
export class Matched<A> {

    constructor(public value: A) { }

    /**
     * caseOf does nothing.
     */
    caseOf<T, B>(pattern: Cons<T>, f: (value: T) => B): Result<A | B>
    caseOf<B>(pattern: String, f: (value: string) => B): Result<A | B>
    caseOf<B>(pattern: Number, f: (value: number) => B): Result<A | B>
    caseOf<B>(pattern: Boolean, f: (value: boolean) => B): Result<A | B>
    caseOf<T extends object, B>(pattern: T, f: (value: { [P in keyof T]: any }) => B): Result<A | B>
    caseOf<T extends string, B>(pattern: T, f: (value: T) => B): Result<A | B>
    caseOf<T extends number, B>(pattern: T, f: (value: T) => B): Result<A | B>
    caseOf<T extends boolean, B>(pattern: T, f: (value: T) => B): Result<A | B>
    caseOf<B>(_: any, __: (value: any) => B): Result<A | B> {

        return this;

    }

    /**
     * orElse does nothing.
     */
    orElse<B>(_: (a: A) => B): Matched<A | B> {

        return this;

    }

    /**
     * end produces the value the Matched was created with.
     */
    end(): A {

        return this.value;

    }

}

/**
 * match wraps a value in an UnMatched so that case tests can be applied.
 */
export const match = <A>(value: A): Result<A> => new UnMatched<A>(value);
