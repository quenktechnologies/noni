"use strict";
/**
 *  Common functions used to manipulate strings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.alphanumeric = exports.numeric = exports.alpha = exports.interp = exports.interpolate = exports.uncapitalize = exports.capitalize = exports.propercase = exports.modulecase = exports.classcase = exports.camelcase = exports.contains = exports.endsWith = exports.startsWith = void 0;
/** imports */
const path_1 = require("../record/path");
const record_1 = require("../record");
const function_1 = require("../function");
;
/**
 * startsWith polyfill.
 */
const startsWith = (str, search, pos = 0) => str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
exports.startsWith = startsWith;
/**
 * endsWith polyfill.
 */
const endsWith = (str, search, this_len = str.length) => (this_len === undefined || this_len > str.length) ?
    this_len = str.length :
    str.substring(this_len - search.length, this_len) === search;
exports.endsWith = endsWith;
/**
 * contains uses String#indexOf to determine if a substring occurs
 * in a string.
 */
const contains = (str, match) => (str.indexOf(match) > -1);
exports.contains = contains;
const seperator = /([\\\/._-]|\s)+/g;
/**
 * camelcase transforms a string into camelCase.
 */
const camelcase = (str) => {
    let i = 0;
    let curr = '';
    let prev = '';
    let buf = '';
    while (true) {
        if (i === str.length)
            return buf;
        curr = (i === 0) ? str[i].toLowerCase() : str[i];
        if (curr.match(seperator)) {
            prev = '-';
        }
        else {
            buf = buf.concat((prev === '-') ?
                curr.toUpperCase() :
                curr.toLowerCase());
            prev = '';
        }
        i++;
    }
};
exports.camelcase = camelcase;
/**
 * classcase is like camelCase except the first letter of the string is
 * upper case.
 */
const classcase = (str) => (str === '') ? '' : str[0].toUpperCase().concat((0, exports.camelcase)(str).slice(1));
exports.classcase = classcase;
/**
 * modulecase transforms a string into module-case.
 */
const modulecase = (str) => {
    let i = 0;
    let prev = '';
    let curr = '';
    let next = '';
    let buf = '';
    while (true) {
        if (i === str.length)
            return buf;
        curr = str[i];
        next = str[i + 1];
        if (curr.match(/[A-Z]/) && (i > 0)) {
            if (prev !== '-')
                buf = buf.concat('-');
            prev = curr.toLowerCase();
            buf = buf.concat(prev);
        }
        else if (curr.match(seperator)) {
            if ((prev !== '-') && next && !seperator.test(next)) {
                prev = '-';
                buf = buf.concat(prev);
            }
        }
        else {
            prev = curr.toLowerCase();
            buf = buf.concat(prev);
        }
        i++;
    }
};
exports.modulecase = modulecase;
/**
 * propercase converts a string into Proper Case.
 */
const propercase = (str) => str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(tok => (tok.length > 0) ?
    `${tok[0].toUpperCase()}${tok.slice(1)}` : tok)
    .join(' ');
exports.propercase = propercase;
/**
 * capitalize a string.
 *
 * Note: spaces are treated as part of the string.
 */
const capitalize = (str) => (str === '') ? '' : `${str[0].toUpperCase()}${str.slice(1)}`;
exports.capitalize = capitalize;
/**
 * uncapitalize a string.
 *
 * Note: spaces are treated as part of the string.
 */
const uncapitalize = (str) => (str === '') ? '' : `${str[0].toLowerCase()}${str.slice(1)}`;
exports.uncapitalize = uncapitalize;
const interpolateDefaults = {
    start: '\{',
    end: '\}',
    regex: '([\\w\$\.\-]+)',
    leaveMissing: true,
    applyFunctions: false,
    transform: function_1.identity,
    getter: (data, path) => (0, path_1.unsafeGet)(path, data)
};
/**
 * interpolate a template string replacing variable paths with values
 * in the data object.
 */
const interpolate = (str, data, opts = {}) => {
    let options = (0, record_1.assign)({}, interpolateDefaults, opts);
    let { getter, transform, start, regex, end } = options;
    let reg = new RegExp(`${start}${regex}${end}`, 'g');
    return str.replace(reg, (_, k) => {
        let value = getter(data, k);
        if (value != null) {
            if (typeof value === 'function')
                value = options.applyFunctions ? value(k) :
                    opts.leaveMissing ? k : '';
            else
                value = value + '';
        }
        else {
            value = opts.leaveMissing ? k : '';
        }
        return transform(value);
    });
};
exports.interpolate = interpolate;
exports.interp = exports.interpolate;
/**
 * alpha omits characters in a string not found in the English alphabet.
 */
const alpha = (str) => str.replace(/[^a-zA-Z]/g, '');
exports.alpha = alpha;
/**
 * numeric omits characters in a string that are decimal digits.
 */
const numeric = (str) => str.replace(/[^0-9]/g, '');
exports.numeric = numeric;
/**
 * alhpanumeric omits characters not found in the English alphabet and not
 * decimal digits.
 */
const alphanumeric = (str) => str.replace(/[\W]|[_]/g, '');
exports.alphanumeric = alphanumeric;
//# sourceMappingURL=index.js.map