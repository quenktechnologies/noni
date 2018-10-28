import { Either } from '../data/either';
/**
 * Err describes the JS Error interface independant
 * of the default Error machinery.
 *
 * This is done to avoid hacks required when extending the Error constructor.
 */
export interface Err {
    /**
     * message describing the error that occured.
     */
    message: string;
    /**
     * stack contains the call stack on platforms where available.
     */
    stack?: string;
}
/**
 * raise the supplied Error.
 *
 * This function exists to maintain a functional style in situations where
 * you may actually want to throw an error.
 */
export declare const raise: (e: Err) => never;
/**
 * attempt a synchronous computation that may throw an exception.
 */
export declare const attempt: <A>(f: () => A) => Either<Error, A>;
