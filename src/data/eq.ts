
/**
 * Eq provides an interface for equality checking of types that 
 * are typically wrappers for other values. (e.g. Monads).
 */
export interface Eq<A> {

    /**
     * eq (equality test).
     */
    eq(e: A): boolean;

}

/**
 * valueEq preforms the equality test on two objects
 * that have a property called 'value'.
 */
export const valueEq = 
  <A>(l: { value: A }) => (r: { value: A }) => l.value === r.value;
