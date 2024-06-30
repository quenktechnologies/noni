/**
 * Option is a value that may or may not exist.
 *
 * This is different to Maybe in that a missing value is actually no value
 * rather than a type that represents a missing value.
 */
export type Option<T> = T | void;

/**
 * readOrThrow is a helper function that throws an error if the value is null or
 * undefined.
 */
export const readOrThrow = <T>(value: Option<T>, message?: string): T => {
    if (value == null) {
        throw new Error(message || 'Value is null or undefined!');
    }
    return value;
};
