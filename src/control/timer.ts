
/**
 * tick runs a function in the "next tick" using process.nextTick in node
 * or setTimeout(f, 0) elsewhere.
 */
export const tick = (f: ()=>void) => (window == null) ?
    setTimeout(f, 0) :
    process.nextTick(f)

