/**
 * Commonly used math functions as well as types to avoid confusion in
 * arithmetic heavy applications.
 */
/**
 * Integer is a whole number including zero and natural numbers.
 */
export type Integer = number;

/**
 * PositiveInteger is an Integer that is > 0.
 */
export type PositiveInteger = number;

/**
 * NegativeInteger is an Integer that is < 0.
 */
export type NegativeInteger = number;

/**
 * isMultipleOf tests whether the Integer 'y' is a multiple of x.
 */
export const isMultipleOf = (x: Integer, y: Integer) => y % x === 0;

/**
 * round a number "x" to "n" places (n defaults to 0 places).
 *
 * This uses the Math.round(x * n) / n method however we take into
 * consideration the Math.round(1.005 * 100) / 100 === 1 issue by use of an
 * offset:
 *
 * sign * (round((abs(x) * 10^n) + (1 / 10^n+1)) / 10^n)
 *
 * Where:
 *
 * sign is the sign of x
 * round is Math.round
 * abs is Math.abs
 * (1 / 10^n+1) is the offset.
 *
 * The offset is only used if n is more than zero. The absolute value of x
 * is used in the calculation to avoid JavaScript idiosyncracies when rounding
 * 0.5:
 * (Math.round((1.005 * 100)+0.001) / 100) === 1.01
 *
 * whereas
 * (Math.round((-1.005 * 100)+0.001) / 100) === -1
 *
 * See the description [here]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round)
 * for more details.
 *
 */
export const round = (x: number, n: PositiveInteger = 0): number => {
  let exp = Math.pow(10, n);
  let sign = x >= 0 ? 1 : -1;
  let offset = n > 0 ? 1 / Math.pow(10, n + 1) : 0;

  return sign * (Math.round(Math.abs(x) * exp + offset) / exp);
};
