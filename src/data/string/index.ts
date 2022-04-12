/**
 *  Common functions used to manipulate strings.
 */

/** imports */
import { get } from '../record/path';
import { Record, assign } from '../record';
import { identity } from '../function';

export interface InterpolateOptions {
    start?: string,
    end?: string,
    regex?: string,
    leaveMissing?: boolean,
    applyFunctions?: boolean,
    transform?: Function
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

const seperator = /([\\\/._-]|\s)+/g

/**
 * camelcase transforms a string into camelCase.
 */
export const camelcase = (str: string): string => {

    let i = 0;
    let curr = '';
    let prev = '';
    let buf = '';

    while (true) {

        if (i === str.length) return buf;

        curr = (i === 0) ? str[i].toLowerCase() : str[i];

        if (curr.match(seperator)) {

            prev = '-';

        } else {

            buf = buf.concat((prev === '-') ?
                curr.toUpperCase() :
                curr.toLowerCase()
            );

            prev = '';

        }

        i++;

    }

}

/**
 * classcase is like camelCase except the first letter of the string is 
 * upper case.
 */
export const classcase = (str: string): string =>
    (str === '') ? '' : str[0].toUpperCase().concat(camelcase(str).slice(1));

/**
 * modulecase transforms a string into module-case.
 */
export const modulecase = (str: string): string => {

    let i = 0;
    let prev = '';
    let curr = '';
    let next = '';
    let buf = '';

    while (true) {

        if (i === str.length) return buf;

        curr = str[i];
        next = str[i + 1];

        if (curr.match(/[A-Z]/) && (i > 0)) {

            if (prev !== '-')
                buf = buf.concat('-');

            prev = curr.toLowerCase();
            buf = buf.concat(prev);

        } else if (curr.match(seperator)) {

            if ((prev !== '-') && next && !seperator.test(next)) {
                prev = '-';
                buf = buf.concat(prev);
            }

        } else {

            prev = curr.toLowerCase();
            buf = buf.concat(prev);

        }

        i++;

    }

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
    (str === '') ? '' : `${str[0].toLowerCase()}${str.slice(1)}`;

const interpolateDefaults: InterpolateOptions = {

    start: '\{',
    end: '\}',
    regex: '([\\w\$\.\-]+)',
    leaveMissing: true,
    applyFunctions: false,
    transform: identity

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
    let transform = options.transform;

    return str.replace(reg, (_, k) =>
        transform(get(k, data)
            .map(v => {

                if (typeof v === 'function') 
                    return options.applyFunctions ? v(k) : 
                  opts.leaveMissing ? k : '';
                else
                    return '' + v;

            })
            .orJust(() => {

                if (opts.leaveMissing)
                    return k;
                else
                    return '';

            })
            .get()));

}

/**
 * alpha omits characters in a string not found in the English alphabet.
 */
export const alpha = (str: string): string =>
    str.replace(/[^a-zA-Z]/g, '');

/**
 * numeric omits characters in a string that are decimal digits.
 */
export const numeric = (str: string): string =>
    str.replace(/[^0-9]/g, '');

/**
 * alhpanumeric omits characters not found in the English alphabet and not
 * decimal digits.
 */
export const alphanumeric = (str: string): string =>
    str.replace(/[\W]|[_]/g, '');
