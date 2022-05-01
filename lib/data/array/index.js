"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compact = exports.flatten = exports.combine = exports.make = exports.removeAt = exports.remove = exports.dedupe = exports.distribute = exports.group = exports.partition = exports.concat = exports.flatMap = exports.map = exports.contains = exports.empty = exports.tail = exports.head = void 0;
/**
 * The array module provides helper functions
 * for working with JS arrays.
 */
const record_1 = require("../record");
const math_1 = require("../../math");
/**
 * head returns the item at index 0 of an array
 */
const head = (list) => list[0];
exports.head = head;
/**
 * tail returns the last item in an array
 */
const tail = (list) => list[list.length - 1];
exports.tail = tail;
/**
 * empty indicates whether an array is empty or not.
 */
const empty = (list) => (list.length === 0);
exports.empty = empty;
/**
 * contains indicates whether an element exists in an array.
 */
const contains = (list, a) => (list.indexOf(a) > -1);
exports.contains = contains;
/**
 * map is a curried version of the Array#map method.
 */
const map = (list) => (f) => list.map(f);
exports.map = map;
/**
 * flatMap allows a function to produce a combined set of arrays from a map
 * operation over each member of a list.
 */
const flatMap = (list, f) => list.reduce((p, c, i) => p.concat(f(c, i, list)), []);
exports.flatMap = flatMap;
/**
 * concat concatenates elements to the end of an array without flattening
 * if any of the elements are an array.
 *
 * This function also ignores null and undefined.
 */
const concat = (list, ...items) => [...list, ...items.filter(item => item != null)];
exports.concat = concat;
/**
 * partition an array into two using a partitioning function.
 *
 * The first array contains values that return true and the second false.
 */
const partition = (list, f) => (0, exports.empty)(list) ?
    [[], []] :
    list.reduce(([yes, no], c, i) => (f(c, i, list) ?
        [(0, exports.concat)(yes, c), no] :
        [yes, (0, exports.concat)(no, c)]), [[], []]);
exports.partition = partition;
/**
 * group the elements of an array into a Record where each property
 * is an array of elements assigned to it's property name.
 */
const group = (list, f) => list.reduce((p, c, i) => {
    let g = f(c, i, list);
    return (0, record_1.merge)(p, {
        [g]: Array.isArray(p[g]) ?
            (0, exports.concat)(p[g], c) : [c]
    });
}, {});
exports.group = group;
/**
 * distribute breaks an array into an array of equally (approximate) sized
 * smaller arrays.
 */
const distribute = (list, size) => {
    let r = list.reduce((p, c, i) => (0, math_1.isMultipleOf)(size, i + 1) ?
        [(0, exports.concat)(p[0], (0, exports.concat)(p[1], c)), []] :
        [p[0], (0, exports.concat)(p[1], c)], [[], []]);
    return (r[1].length === 0) ? r[0] : (0, exports.concat)(r[0], r[1]);
};
exports.distribute = distribute;
/**
 * dedupe an array by filtering out elements
 * that appear twice.
 */
const dedupe = (list) => list.filter((e, i, l) => l.indexOf(e) === i);
exports.dedupe = dedupe;
/**
 * remove an element from an array returning a new copy with the element
 * removed.
 */
const remove = (list, target) => {
    let idx = list.indexOf(target);
    if (idx === -1) {
        return list.slice();
    }
    else {
        let a = list.slice();
        a.splice(idx, 1);
        return a;
    }
};
exports.remove = remove;
/**
 * removeAt removes an element at the specified index returning a copy
 * of the original array with the element removed.
 */
const removeAt = (list, idx) => {
    if ((list.length > idx) && (idx > -1)) {
        let a = list.slice();
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
const make = (size, f) => {
    let a = new Array(size);
    for (let i = 0; i < size; i++)
        a[i] = f(i);
    return a;
};
exports.make = make;
/**
 * combine a list of of lists into one list.
 */
const combine = (list) => list.reduce((p, c) => p.concat(c), []);
exports.combine = combine;
/**
 * flatten a list of items that may be multi-dimensional.
 *
 * This function may not be stack safe.
 */
const flatten = (list) => list.reduce((p, c) => p.concat(Array.isArray(c) ? (0, exports.flatten)(c) : c), []);
exports.flatten = flatten;
/**
 * compact removes any occurences of null or undefined in the list.
 */
const compact = (list) => list.filter(v => (v != null));
exports.compact = compact;
//# sourceMappingURL=index.js.map