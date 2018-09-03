"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The array module provides helper functions
 * for working with JS arrays.
 */
var record_1 = require("./record");
/**
 * head returns the item at index 0 of an array
 */
exports.head = function (list) { return list[0]; };
/**
 * tail returns the last item in an array
 */
exports.tail = function (list) { return list[list.length - 1]; };
/**
 * empty indicates whether an array is empty or not.
 */
exports.empty = function (list) { return (list.length === 0); };
/**
 * contains indicates whether an element exists in an array.
 */
exports.contains = function (list) { return function (a) { return (list.indexOf(a) > -1); }; };
/**
 * map is a curried version of the Array#map method.
 */
exports.map = function (list) { return function (f) { return list.map(f); }; };
/**
 * concat concatenates an element to an array without destructuring
 * the element if itself is an array.
 */
exports.concat = function (list) { return function (a) { return list.concat([a]); }; };
/**
 * partition an array into two using a partitioning function.
 *
 * The first array contains values that return true and the second false.
 */
exports.partition = function (list) { return function (f) { return exports.empty(list) ?
    [[], []] :
    list.reduce(function (_a, c, i) {
        var yes = _a[0], no = _a[1];
        return (f(c, i, list) ?
            [exports.concat(yes)(c), no] :
            [yes, exports.concat(no)(c)]);
    }, [[], []]); }; };
/**
 * group the properties of a Record into another Record using a grouping
 * function.
 */
exports.group = function (list) { return function (f) {
    return list.reduce(function (p, c, i) {
        var _a;
        var g = f(c, i, list);
        return record_1.merge(p, (_a = {},
            _a[g] = Array.isArray(p[g]) ?
                exports.concat(p[g])(c) : [c],
            _a));
    }, {});
}; };
//# sourceMappingURL=array.js.map