/**
 * This module provides functions and types to make dealing with ES errors
 * easier.
 */

/** imports */
import { Either, left, right } from '../data/either';

/**
 * Except type represents a value that may fail with an error.
 *
 * It is a specific version of Either.
 */
export type Except<A> = Either<Err, A>;

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
    message: string

    /**
     * stack contains the call stack on platforms where available.
     */
    stack?: string

}

/** 
 * convert an Err to an Error.
 */
export const convert = (e: Err): Error =>   (e instanceof Error) ?
        e :
        new Error(e ? e.message ? e.message : undefined : undefined);

/**
 * raise the supplied Error.
 *
 * This function exists to maintain a functional style in situations where 
 * you may actually want to throw an error.
 */
export const raise = (e: Err) => {

    if (e instanceof Error) {

        throw e;

    } else {

        throw new Error(e.message);

    }

}

/**
 * attempt a synchronous computation that may throw an exception.
 */
export const attempt = <A>(f: () => A): Except<A> => {

    try {

        return right(f());

    } catch (e) {

        return <Except<A>>left(e);

    }

}
