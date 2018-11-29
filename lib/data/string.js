"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * startsWith polyfill.
 */
exports.startsWith = function (str, search, pos) {
    if (pos === void 0) { pos = 0; }
    return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
};
/**
 * endsWith polyfill.
 */
exports.endsWith = function (str, search, this_len) {
    if (this_len === void 0) { this_len = str.length; }
    return (this_len === undefined || this_len > str.length) ?
        this_len = str.length :
        str.substring(this_len - search.length, this_len) === search;
};
/**
 * contains uses String#indexOf to determine if a substring occurs
 * in a string.
 */
exports.contains = function (str, match) {
    return (str.indexOf(match) > -1);
};
/**
 * camelCase transforms a string into CamelCase.
 */
exports.camelCase = function (str) {
    return [str[0].toUpperCase()]
        .concat(str
        .split(str[0])
        .slice(1)
        .join(str[0]))
        .join('')
        .replace(/(\-|_|\s)+(.)?/g, function (_, __, c) {
        return (c ? c.toUpperCase() : '');
    });
};
console.log(camel(process.argv[2]));
//# sourceMappingURL=string.js.map