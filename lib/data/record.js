"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The record module provides functions for manipulating ES objects used
 * as records.
 *
 * Some of the functions provided here are inherently unsafe (the compiler
 * would not be able to verify the runtime value) and may result in crashes
 * if not used carefully.
 */
var test_1 = require("./test");
/**
 * keys produces a list of property names. of a Record.
 */
exports.keys = function (value) { return Object.keys(value); };
/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
exports.map = function (o, f) {
    return exports.keys(o).reduce(function (p, k) {
        var _a;
        return exports.merge(p, (_a = {}, _a[k] = f(o[k], k, o), _a));
    }, {});
};
/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properites on the Record.
 * The order of keys processed is not guaranteed.
 */
exports.reduce = function (o, accum, f) {
    return exports.keys(o).reduce(function (p, k) { return f(p, o[k], k); }, accum);
};
/**
 * merge two or more objects into one returning the value.
 *
 * The return value's type is the product of the two types supplied.
 * This function may be unsafe.
 */
exports.merge = function (left, right) { return Object.assign({}, left, right); };
/**
 * rmerge merges nested records recursively.
 *
 * This function may be unsafe.
 */
exports.rmerge = function (left, right) {
    return exports.reduce(right, left, function (pre, curr, key) {
        var _a, _b;
        return test_1.isRecord(curr) ?
            exports.merge(pre, (_a = {},
                _a[key] = test_1.isRecord(pre[key]) ?
                    exports.rmerge(pre[key], curr) :
                    curr,
                _a)) :
            exports.merge(pre, (_b = {}, _b[key] = curr, _b));
    });
};
/**
 * exclude removes the specified properties from a Record.
 */
exports.exclude = function (o) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return exports.reduce(o, {}, function (p, c, k) {
        var _a;
        return keys.indexOf(k) > -1 ? p : exports.merge(p, (_a = {}, _a[k] = c, _a));
    });
};
//# sourceMappingURL=record.js.map