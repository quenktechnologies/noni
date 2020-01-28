import { Milliseconds } from './time';
import { Function } from '../data/function';

/**
 * tick runs a function in the "next tick" using process.nextTick in node
 * or setTimeout(f, 0) elsewhere.
 */
export const tick = (f: () => void) => (typeof window == 'undefined') ?
    setTimeout(f, 0) :
    process.nextTick(f);

/**
 * debounce delays the application of a function until the specified time
 * has passed.
 *
 * If multiple attempts to apply the function have occured, then each attempt
 * will restart the delay process. The function will only ever be applied once
 * after the delay, using the value of the final attempt for application.
 */
export const debounce =
    <A>(f: Function<A, void>, delay: Milliseconds): Function<A, void> => {

        let id: number = -1;

        return (a: A) => {

            if (id === -1) {

                id = <number><unknown>setTimeout(() => f(a), delay);

            } else {

                clearTimeout(id);

                id = <number><unknown>setTimeout(() => f(a), delay);

            }

        }

    }

/**
 * throttle limits the application of a function to occur only one within the
 * specified duration.
 *
 * The first application will execute immediately subsequent applications
 * will be ignored until the duration has passed.
 */
export const throttle =
    <A>(f: Function<A, void>, duration: Milliseconds): Function<A, void> => {

        let wait: boolean = false;

        return (a: A) => {

            if (wait === false) {

                f(a);

                wait = true;

                setTimeout(() => wait = false, duration);

            }

        }

    }
