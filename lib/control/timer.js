"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = exports.debounce = exports.tick = void 0;
/**
 * tick runs a function in the "next tick" using process.nextTick in node
 * or setTimeout(f, 0) elsewhere.
 */
const tick = (f) => (typeof window == 'undefined') ?
    setTimeout(f, 0) :
    process.nextTick(f);
exports.tick = tick;
/**
 * debounce delays the application of a function until the specified time
 * has passed.
 *
 * If multiple attempts to apply the function have occured, then each attempt
 * will restart the delay process. The function will only ever be applied once
 * after the delay, using the value of the final attempt for application.
 */
const debounce = (f, delay) => {
    let id = -1;
    return (a) => {
        if (id === -1) {
            id = setTimeout(() => f(a), delay);
        }
        else {
            clearTimeout(id);
            id = setTimeout(() => f(a), delay);
        }
    };
};
exports.debounce = debounce;
/**
 * throttle limits the application of a function to occur only one within the
 * specified duration.
 *
 * The first application will execute immediately subsequent applications
 * will be ignored until the duration has passed.
 */
const throttle = (f, duration) => {
    let wait = false;
    return (a) => {
        if (wait === false) {
            f(a);
            wait = true;
            setTimeout(() => wait = false, duration);
        }
    };
};
exports.throttle = throttle;
//# sourceMappingURL=timer.js.map