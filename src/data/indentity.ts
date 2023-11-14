import { Alt } from "../control/alt";
import { Eq } from "../data/eq";
import { Applicative } from "../control/applicative";
import { Monad } from "../control/monad";

/**
 * Identity monad.
 *
 * This class is here mostly for future iterations of this libary.
 * The Identity class typically returns the value supplied for most of its
 * operations.
 */
export class Identity<A>
  implements Alt<A>, Applicative<A>, Monad<A>, Eq<Identity<A>>
{
  constructor(public value: A) {}

  /**
   * of
   */
  of(a: A): Identity<A> {
    return new Identity(a);
  }

  /**
   * map
   */
  map<B>(f: (a: A) => B): Identity<B> {
    return new Identity(f(this.value));
  }

  /**
   * chain
   */
  chain<B>(f: (a: A) => Identity<B>): Identity<B> {
    return f(this.value);
  }

  /**
   * ap
   */
  ap<B>(i: Identity<(a: A) => B>): Identity<B> {
    return new Identity(i.value(this.value));
  }

  /**
   * alt will prefer whatever Maybe instance provided.
   */
  alt(a: Identity<A>): Identity<A> {
    return a;
  }

  /**
   * eq
   */
  eq(i: Identity<A>): boolean {
    return i.value === this.value;
  }
}

/**
 * pure wraps a value in an Identity.
 */
export const pure = <A>(value: A): Identity<A> => new Identity(value);
