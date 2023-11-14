import { Type } from "./";

/**
 * Constructor interface.
 *
 * This definition exists for use in cases where we need to indicate
 * a type is a constructor but are not concerned with its parameters.
 */
export interface Constructor<T> {
  new (...args: Type[]): T;
}
