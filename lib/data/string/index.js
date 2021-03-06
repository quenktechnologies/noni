"use strict";
/**
 *  Common functions used to manipulate strings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.alphanumeric = exports.numeric = exports.alpha = exports.interpolate = exports.uncapitalize = exports.capitalize = exports.propercase = exports.modulecase = exports.classcase = exports.camelcase = exports.contains = exports.endsWith = exports.startsWith = void 0;
/** imports */
var path_1 = require("../record/path");
var record_1 = require("../record");
;
/**
 * startsWith polyfill.
 */
var startsWith = function (str, search, pos) {
    if (pos === void 0) { pos = 0; }
    return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
};
exports.startsWith = startsWith;
/**
 * endsWith polyfill.
 */
var endsWith = function (str, search, this_len) {
    if (this_len === void 0) { this_len = str.length; }
    return (this_len === undefined || this_len > str.length) ?
        this_len = str.length :
        str.substring(this_len - search.length, this_len) === search;
};
exports.endsWith = endsWith;
/**
 * contains uses String#indexOf to determine if a substring occurs
 * in a string.
 */
var contains = function (str, match) {
    return (str.indexOf(match) > -1);
};
exports.contains = contains;
var seperator = /([\\\/._-]|\s)+/g;
/**
 * camelcase transforms a string into camelCase.
 */
var camelcase = function (str) {
    var i = 0;
    var curr = '';
    var prev = '';
    var buf = '';
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
var classcase = function (str) {
    return (str === '') ? '' : str[0].toUpperCase().concat(exports.camelcase(str).slice(1));
};
exports.classcase = classcase;
/**
 * modulecase transforms a string into module-case.
 */
var modulecase = function (str) {
    var i = 0;
    var prev = '';
    var curr = '';
    var next = '';
    var buf = '';
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
var propercase = function (str) {
    return str
        .trim()
        .toLowerCase()
        .split(' ')
        .map(function (tok) { return (tok.length > 0) ?
        "" + tok[0].toUpperCase() + tok.slice(1) : tok; })
        .join(' ');
};
exports.propercase = propercase;
/**
 * capitalize a string.
 *
 * Note: spaces are treated as part of the string.
 */
var capitalize = function (str) {
    return (str === '') ? '' : "" + str[0].toUpperCase() + str.slice(1);
};
exports.capitalize = capitalize;
/**
 * uncapitalize a string.
 *
 * Note: spaces are treated as part of the string.
 */
var uncapitalize = function (str) {
    return (str === '') ? '' : "" + str[0].toLowerCase() + str.slice(1);
};
exports.uncapitalize = uncapitalize;
var interpolateDefaults = {
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
var interpolate = function (str, data, opts) {
    if (opts === void 0) { opts = {}; }
    var options = record_1.assign({}, interpolateDefaults, opts);
    var reg = new RegExp("" + options.start + options.regex + options.end, 'g');
    return str.replace(reg, function (_, k) {
        return path_1.get(k, data)
            .map(function (v) {
            if (typeof v === 'function')
                return v(k);
            else
                return '' + v;
        })
            .orJust(function () {
            if (opts.leaveMissing)
                return k;
            else
                return '';
        })
            .get();
    });
};
exports.interpolate = interpolate;
/**
 * alpha omits characters in a string not found in the English alphabet.
 */
var alpha = function (str) {
    return str.replace(/[^a-zA-Z]/g, '');
};
exports.alpha = alpha;
/**
 * numeric omits characters in a string that are decimal digits.
 */
var numeric = function (str) {
    return str.replace(/[^0-9]/g, '');
};
exports.numeric = numeric;
/**
 * alhpanumeric omits characters not found in the English alphabet and not
 * decimal digits.
 */
var alphanumeric = function (str) {
    return str.replace(/[\W]|[_]/g, '');
};
exports.alphanumeric = alphanumeric;
//# sourceMappingURL=index.js.map