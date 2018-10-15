/// <reference types="node" />
/**
 * tick runs a function in the "next tick" using process.nextTick in node
 * or setTimeout(f, 0) elsewhere.
 */
export declare const tick: (f: () => void) => void | NodeJS.Timer;
