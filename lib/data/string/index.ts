/**
 *  Common functions used to manipulate strings.
 */

/** imports */
import { get } from '../record/path';
import { Record, assign } from '../record';

export interface InterpolateOptions {
    start?: string,
    end?: string,
    regex?: string,
    leaveMissing?: boolean,
    applyFunctions?: boolean
};

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
    (str === '') ? '' :
        [str[0].toUpperCase()]
            .concat(str
                .split(str[0])
                .slice(1)
                .join(str[0]))
            .join('')
            .replace(/(\-|_|\s)+(.)?/g, (_, __, c) =>
                (c ? c.toUpperCase() : ''));

/**
 * capitalize a string.
 *
 * Note: spaces are treated as part of the string.
 */
export const capitalize = (str: string): string =>
    (str === '') ? '' : `${str[0].toUpperCase()}${str.slice(1)}`;

/**
 * uncapitalize a string.
 *
 * Note: spaces are treated as part of the string.
 */
export const uncapitalize = (str: string): string =>
  (str === '') ? '' :     `${str[0].toLowerCase()}${str.slice(1)}`;

const interpolateDefaults: InterpolateOptions = {

    start: '\{',
    end: '\}',
    regex: '([\\w\$\.\-]+)',
    leaveMissing: true,
    applyFunctions: false

};

/**
 * interpolate a template string replacing variable paths with values
 * in the data object.
 */
export const interpolate = (
    str: string,
    data: Record<any>,
    opts: InterpolateOptions = {}): string => {

    let options = assign({}, interpolateDefaults, opts);
    let reg = new RegExp(`${options.start}${options.regex}${options.end}`, 'g');

    return str.replace(reg, (_, k) =>
        get(k, data)
            .map(v => {

                if (typeof v === 'function')
                    return v(k);
                else
                    return '' + v;

            })
            .orJust(() => {

                if (opts.leaveMissing)
                    return k;
                else
                    return '';

            })
            .get());

}

/**
 * propercase converts a string into Proper Case.
 */
export const propercase = (str: string): string =>
    str
        .trim()
        .toLowerCase()
        .split(' ')
        .map(tok => (tok.length > 0) ?
            `${tok[0].toUpperCase()}${tok.slice(1)}` : tok)
        .join(' ');
