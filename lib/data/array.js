"use strict";
/**
 * The array module provides helper functions
 * for working with JS arrays.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * head returns the item at index 0 of an array
 */
exports.head = function (list) { return list[0]; };
/**
 * tail returns the last item in an array
 */
exports.tail = function (list) { return list[list.length - 1]; };
/**
 * map is a curried version of the Array#map method.
 */
exports.map = function (f) { return function (list) { return list.map(f); }; };
//# sourceMappingURL=array.js.map