import { isString } from '../data/type';

/**
 * ErrorMessage is a string indicating the nature of an error.
 */
export type ErrorMessage = string;

/**
 * ErrorStack is string where each line is an entry into a stack trace.
 */
export type ErrorStack = string;

/**
 * Err describes the JS Error interface independent
 * of the default Error machinery.
 *
 * This is done to avoid hacks required when extending the Error constructor.
 */
export interface Err {
    /**
     * message describing the error that occurred.
     */
    message: ErrorMessage;

    /**
     * stack contains the call stack on platforms where available.
     */
    stack?: ErrorStack;
}

/**
 * toError converts a string or an Err to an error.
 */
export const toError = (e: ErrorMessage | Err | Error): Error => {
    if (isString(e)) return new Error(e);
    else if (!(e instanceof Error))
        return new Error(e ? (e.message ? e.message : undefined) : undefined);
    return e;
};

// @deprecated
export { toError as convert };

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
};
