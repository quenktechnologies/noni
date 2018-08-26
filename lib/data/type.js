"use strict";
/**
 * test provides basic type tests common when working with ECMAScript.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var prims = ['string', 'number', 'boolean'];
/**
 * isObject test.
 *
 * Does not consider an Array an object.
 */
exports.isObject = function (value) {
    return (typeof value === 'object') && (!exports.isArray(value));
};
/**
 * isArray test.
 */
exports.isArray = Array.isArray;
/**
 * isString test.
 */
exports.isString = function (value) { return typeof value === 'string'; };
/**
 * isNumber test.
 */
exports.isNumber = function (value) {
    return (typeof value === 'number') && (!isNaN(value));
};
/**
 * isBoolean test.
 */
exports.isBoolean = function (value) { return typeof value === 'boolean'; };
/**
 * is performs a typeof of check on a type.
 */
exports.is = function (expected) { return function (value) { return typeof (value) === expected; }; };
/**
 * test whether a value conforms to some pattern.
 *
 * This function is made available mainly for a crude pattern matching
 * machinery that works as followss:
 * string   -> Matches on the value of the string.
 * number   -> Matches on the value of the number.
 * boolean  -> Matches on the value of the boolean.
 * object   -> Each key of the object is matched on the value, all must match.
 * function -> Treated as a constructor and results in an instanceof check or
 *             for String,Number and Boolean, this uses the typeof check. If
 *             the function is RegExp then we uses the RegExp.test function
 *             instead.
 */
exports.test = function (value, t) {
    return ((prims.indexOf(typeof t) > -1) && (value === t)) ?
        true :
        ((typeof t === 'function') &&
            (((t === String) && (typeof value === 'string')) ||
                ((t === Number) && (typeof value === 'number')) ||
                ((t === Boolean) && (typeof value === 'boolean')) ||
                ((t === Array) && (Array.isArray(value))) ||
                (value instanceof t))) ?
            true :
            ((t instanceof RegExp) && ((typeof value === 'string') && t.test(value))) ?
                true :
                ((typeof t === 'object') && (typeof value === 'object')) ?
                    Object
                        .keys(t)
                        .every(function (k) { return value.hasOwnProperty(k) ?
                        exports.test(value[k], t[k]) : false; }) :
                    false;
};
//# sourceMappingURL=type.js.map