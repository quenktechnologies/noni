
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

/**
 * contains uses String#indexOf to determine if a substring occurs
 * in a string.
 */
export const contains = (str: string, match: string) =>
    (str.indexOf(match) > - 1);

/**
 * camelCase transforms a string into CamelCase.
 */
export const camelCase = (str: string): string =>
    [str[0].toUpperCase()]
        .concat(str
            .split(str[0])
            .slice(1)
            .join(str[0]))
        .join('')
        .replace(/(\-|_|\s)+(.)?/g, (_, __, c) =>
            (c ? c.toUpperCase() : ''));

console.log(camel(process.argv[2]));


