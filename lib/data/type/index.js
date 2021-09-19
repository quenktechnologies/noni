"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toString = exports.show = exports.test = exports.is = exports.isPrim = exports.isFunction = exports.isBoolean = exports.isNumber = exports.isString = exports.isArray = exports.isObject = exports.Any = void 0;
var prims = ['string', 'number', 'boolean'];
/**
 * Any is a class used to represent typescript's "any" type.
 */
var Any = /** @class */ (function () {
    function Any() {
    }
    return Any;
}());
exports.Any = Any;
/**
 * isObject test.
 *
 * Does not consider an Array an object.
 */
var isObject = function (value) {
    return (typeof value === 'object') && (!(0, exports.isArray)(value));
};
exports.isObject = isObject;
/**
 * isArray test.
 */
exports.isArray = Array.isArray;
/**
 * isString test.
 */
var isString = function (value) {
    return typeof value === 'string';
};
exports.isString = isString;
/**
 * isNumber test.
 */
var isNumber = function (value) {
    return (typeof value === 'number') && (!isNaN(value));
};
exports.isNumber = isNumber;
/**
 * isBoolean test.
 */
var isBoolean = function (value) {
    return typeof value === 'boolean';
};
exports.isBoolean = isBoolean;
/**
 * isFunction test.
 */
var isFunction = function (value) {
    return typeof value === 'function';
};
exports.isFunction = isFunction;
/**
 * isPrim test.
 */
var isPrim = function (value) {
    return !((0, exports.isObject)(value) ||
        (0, exports.isArray)(value) ||
        (0, exports.isFunction)(value));
};
exports.isPrim = isPrim;
/**
 * is performs a typeof of check on a type.
 */
var is = function (expected) { return function (value) {
    return typeof (value) === expected;
}; };
exports.is = is;
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
var test = function (value, t) {
    if ((prims.indexOf(typeof t) > -1) && (value === t))
        return true;
    else if ((typeof t === 'function') &&
        (((t === String) && (typeof value === 'string')) ||
            ((t === Number) && (typeof value === 'number')) ||
            ((t === Boolean) && (typeof value === 'boolean')) ||
            ((t === Array) && (Array.isArray(value))) ||
            (t === Any) ||
            (value instanceof t)))
        return true;
    else if ((t instanceof RegExp) &&
        ((typeof value === 'string') &&
            t.test(value)))
        return true;
    else if ((typeof t === 'object') && (typeof value === 'object'))
        return Object
            .keys(t)
            .every(function (k) { return Object.hasOwnProperty.call(value, k) ?
            (0, exports.test)(value[k], t[k]) : false; });
    return false;
};
exports.test = test;
/**
 * show the type of a value.
 *
 * Note: This may crash if the value is an
 * object literal with recursive references.
 */
var show = function (value) {
    if (typeof value === 'object') {
        if (Array.isArray(value))
            return "[" + value.map(exports.show) + "];";
        else if (value.constructor !== Object)
            return (value.constructor.name ||
                value.constructor);
        else
            return JSON.stringify(value);
    }
    else {
        return '' + value;
    }
};
exports.show = show;
/**
 * toString casts a value to a string.
 *
 * If the value is null or undefined an empty string is returned instead of
 * the default.
 */
var toString = function (val) {
    return (val == null) ? '' : String(val);
};
exports.toString = toString;
//# sourceMappingURL=index.js.map