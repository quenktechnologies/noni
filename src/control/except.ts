import { Either, left, right } from '../data/either';
import { Err, ErrorMessage, toError } from './err';

/**
 * Except type represents a value that may fail with an error.
 *
 * It is a version of Either specialized with an Err type on the left-hand side.
 */
export type Except<A> = Either<Err, A>;

/**
 * raise an Except.
 *
 * This promotes a value to an Error wrapped inside a left.
 */
export const raise = <A>(msg: ErrorMessage | Err | Error): Except<A> =>
    left(toError(msg));

/**
 * attempt a synchronous computation that may throw an exception.
 */
export const attempt = <A>(f: () => A): Except<A> => {
    try {
        return right(f());
    } catch (e) {
        return <Except<A>>left(e);
    }
};
