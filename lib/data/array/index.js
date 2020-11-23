"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compact = exports.flatten = exports.combine = exports.make = exports.removeAt = exports.remove = exports.dedupe = exports.distribute = exports.group = exports.partition = exports.concat = exports.flatMap = exports.map = exports.contains = exports.empty = exports.tail = exports.head = void 0;
/**
 * The array module provides helper functions
 * for working with JS arrays.
 */
var record_1 = require("../record");
var math_1 = require("../../math");
/**
 * head returns the item at index 0 of an array
 */
var head = function (list) { return list[0]; };
exports.head = head;
/**
 * tail returns the last item in an array
 */
var tail = function (list) { return list[list.length - 1]; };
exports.tail = tail;
/**
 * empty indicates whether an array is empty or not.
 */
var empty = function (list) { return (list.length === 0); };
exports.empty = empty;
/**
 * contains indicates whether an element exists in an array.
 */
var contains = function (list, a) { return (list.indexOf(a) > -1); };
exports.contains = contains;
/**
 * map is a curried version of the Array#map method.
 */
var map = function (list) { return function (f) { return list.map(f); }; };
exports.map = map;
/**
 * flatMap allows a function to produce a combined set of arrays from a map
 * operation over each member of a list.
 */
var flatMap = function (list, f) {
    return list.reduce(function (p, c, i) { return p.concat(f(c, i, list)); }, []);
};
exports.flatMap = flatMap;
/**
 * concat concatenates an element to an array without destructuring
 * the element if itself is an array.
 */
var concat = function (list, a) { return __spreadArrays(list, [a]); };
exports.concat = concat;
/**
 * partition an array into two using a partitioning function.
 *
 * The first array contains values that return true and the second false.
 */
var partition = function (list, f) { return exports.empty(list) ?
    [[], []] :
    list.reduce(function (_a, c, i) {
        var yes = _a[0], no = _a[1];
        return (f(c, i, list) ?
            [exports.concat(yes, c), no] :
            [yes, exports.concat(no, c)]);
    }, [[], []]); };
exports.partition = partition;
/**
 * group the elements of an array into a Record where each property
 * is an array of elements assigned to it's property name.
 */
var group = function (list, f) {
    return list.reduce(function (p, c, i) {
        var _a;
        var g = f(c, i, list);
        return record_1.merge(p, (_a = {},
            _a[g] = Array.isArray(p[g]) ?
                exports.concat(p[g], c) : [c],
            _a));
    }, {});
};
exports.group = group;
/**
 * distribute breaks an array into an array of equally (approximate) sized
 * smaller arrays.
 */
var distribute = function (list, size) {
    var r = list.reduce(function (p, c, i) {
        return math_1.isMultipleOf(size, i + 1) ?
            [exports.concat(p[0], exports.concat(p[1], c)), []] :
            [p[0], exports.concat(p[1], c)];
    }, [[], []]);
    return (r[1].length === 0) ? r[0] : exports.concat(r[0], r[1]);
};
exports.distribute = distribute;
/**
 * dedupe an array by filtering out elements
 * that appear twice.
 */
var dedupe = function (list) {
    return list.filter(function (e, i, l) { return l.indexOf(e) === i; });
};
exports.dedupe = dedupe;
/**
 * remove an element from an array returning a new copy with the element
 * removed.
 */
var remove = function (list, target) {
    var idx = list.indexOf(target);
    if (idx === -1) {
        return list.slice();
    }
    else {
        var a = list.slice();
        a.splice(idx, 1);
        return a;
    }
};
exports.remove = remove;
/**
 * removeAt removes an element at the specified index returning a copy
 * of the original array with the element removed.
 */
var removeAt = function (list, idx) {
    if ((list.length > idx) && (idx > -1)) {
        var a = list.slice();
        a.splice(idx, 1);
        return a;
    }
    else {
        return list.slice();
    }
};
exports.removeAt = removeAt;
/**
 * make an array of elements of a given size using a function to provide
 * each element.
 *
 * The function receives the index number for each step.
 */
var make = function (size, f) {
    var a = new Array(size);
    for (var i = 0; i < size; i++)
        a[i] = f(i);
    return a;
};
exports.make = make;
/**
 * combine a list of of lists into one list.
 */
var combine = function (list) {
    return list.reduce(function (p, c) { return p.concat(c); }, []);
};
exports.combine = combine;
/**
 * flatten a list of items that may be multi-dimensional.
 *
 * This function may not be stack safe.
 */
var flatten = function (list) {
    return list.reduce(function (p, c) {
        return p.concat(Array.isArray(c) ? exports.flatten(c) : c);
    }, []);
};
exports.flatten = flatten;
/**
 * compact removes any occurences of null or undefined in the list.
 */
var compact = function (list) {
    return list.filter(function (v) { return (v != null); });
};
exports.compact = compact;
//# sourceMappingURL=index.js.map