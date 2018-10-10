import { Function } from '../data/function';

/**
 * tick runs a function in the "next tick" using process.nextTick in node
 * or setTimeout(f, 0) elsewhere.
 */
export const tick = <A, B>(f: Function<A, B>) => (window == null) ?
    setTimeout(f, 0) :
    process.nextTick(f)

