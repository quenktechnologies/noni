/// <reference types="node" />
import { Milliseconds } from './time';
import { Function } from '../data/function';
/**
 * tick runs a function in the "next tick" using process.nextTick in node
 * or setTimeout(f, 0) elsewhere.
 */
export declare const tick: (f: () => void) => void | NodeJS.Timeout;
/**
 * debounce delays the application of a function until the specified time
 * has passed.
 *
 * If multiple attempts to apply the function have occured, then each attempt
 * will restart the delay process. The function will only ever be applied once
 * after the delay, using the value of the final attempt for application.
 */
export declare const debounce: <A>(f: Function<A, void>, delay: Milliseconds) => Function<A, void>;
/**
 * throttle limits the application of a function to occur only one within the
 * specified duration.
 *
 * The first application will execute immediately subsequent applications
 * will be ignored until the duration has passed.
 */
export declare const throttle: <A>(f: Function<A, void>, duration: Milliseconds) => Function<A, void>;
