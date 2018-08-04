"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prims = ['string', 'number', 'boolean'];
/**
 * isRecord test.
 *
 * An array is not considered Record.
 */
exports.isRecord = function (value) {
    return (typeof value === 'object') && (!Array.isArray(value));
};
/**
 * isArray test.
 */
exports.isArray = Array.isArray;
/**
 * is performs a typeof of check on a type.
 */
exports.is = function (expected) { return function (value) { return typeof (value) === expected; }; };
/**
 * isNumber test.
 */
exports.isNumber = function (value) {
    return (typeof value === 'number') && (!isNaN(value));
};
/**
 * isObject test.
 */
exports.isObject = function (value) { return typeof value === 'object'; };
/**
 * isString test.
 */
exports.isString = function (value) { return typeof value === 'string'; };
/**
 * isBoolean test.
 */
exports.isBoolean = function (value) { return typeof value === 'boolean'; };
/**
 * typeOf determines if some value loosely conforms to a specified type.
 *
 * It can be used to implement a sort of pattern matching and works as follows:
 * string   -> Matches on the value of the string.
 * number   -> Matches on the value of the number.
 * boolean  -> Matches on the value of the boolean.
 * object   -> Each key of the object is matched on the value, all must match.
 * function -> Treated as a constructor and results in an instanceof check or
 *             for String,Number and Boolean, this uses the typeof check.
 */
exports.typeOf = function (value, t) {
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
                        exports.typeOf(value[k], t[k]) : false; }) :
                    false;
};
//# sourceMappingURL=type.js.map