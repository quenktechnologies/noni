import { Either, left, right } from '../data/either';

/**
 * raise the supplied Error.
 *
 * This function exists to maintain a functional style in situations where 
 * you may actually want to throw an error.
 */
export const raise = (e: Error) => { throw e; }

/**
 * attempt a synchronous computation that may throw an exception.
 */
export const attempt = <A>(f: () => A): Either<Error, A> => {

    try { return right(f()); } catch (e) { return left(e); }

}
