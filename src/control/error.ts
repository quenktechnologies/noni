
/**
 * raise the supplied Error.
 *
 * This function exists to maintain a functional style in situations where 
 * you may actually want to throw an error.
 */
export const raise = (e:Error) => { throw e; }
