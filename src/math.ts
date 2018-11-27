/**
 * Commonly used math functions as well as types to avoid confusion in
 * arithmetic heavy applications.
 */
/**
 * Integer is a whole number including zero and natural numbers.
 */
export type Integer = number;

/**
 * isMultipleOf tests whether the Integer 'y' is a multiple of x.
 */
export const isMultipleOf = (x: Integer, y: Integer) => ((y % x) === 0);
