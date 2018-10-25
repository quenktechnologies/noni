import { Either } from '../data/either';
/**
 * raise the supplied Error.
 *
 * This function exists to maintain a functional style in situations where
 * you may actually want to throw an error.
 */
export declare const raise: (e: Error) => never;
/**
 * attempt a synchronous computation that may throw an exception.
 */
export declare const attempt: <A>(f: () => A) => Either<Error, A>;
