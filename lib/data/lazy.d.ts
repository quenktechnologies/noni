/**
 * This module provides APIs for delayed retrieval of values.
 *
 * Occasionally we need to provide a value to a function or constructor that
 * may not yet be initialized. In such cases, a function usually does the trick
 * but then valid types of our value are restricted to a function.
 *
 * By using the Lazy type in combination with the evaluate() function, we can
 * accept both raw values and delayed ones via a function.
 */
/**
 * Lazy is a type of a value that may be provided directly or via a getter
 * function.
 */
export declare type Lazy<A> = A | (() => A);
/**
 * evaluate a potentially lazy value provided its actual value.
 */
export declare const evaluate: <A>(value: Lazy<A>) => A;
