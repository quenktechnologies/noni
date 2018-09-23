
/**
 * startsWith polyfill.
 */
export const startsWith = (str: string, search: string, pos: number = 0) =>
    str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;

/**
 * endsWith polyfill.
 */
export const endsWith = 
  (str: string, search: string, this_len: number = str.length) =>
    (this_len === undefined || this_len > str.length) ?
        this_len = str.length :
        str.substring(this_len - search.length, this_len) === search;
