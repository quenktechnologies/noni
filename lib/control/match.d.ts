export declare type Cons<T> = {
    new (...args: any[]): T;
};
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
    caseOf<T, B>(pattern: Cons<T>, f: (value: T) => B): Result<A | B>;
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
    caseOf<T, B>(pattern: Cons<T>, f: (value: T) => B): Result<A | B>;
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
