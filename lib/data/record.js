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
var type_1 = require("../data/type");
var array_1 = require("./array");
/**
 * isRecord tests whether a value is a record.
 *
 * Note: This function is also an unsafe type guard.
 * Use with caution.
 */
exports.isRecord = function (value) {
    return (typeof value === 'object') && (!Array.isArray(value));
};
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
        return exports.isRecord(curr) ?
            exports.merge(pre, (_a = {},
                _a[key] = exports.isRecord(pre[key]) ?
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
/**
 * flatten an object into a map of key value pairs.
 *
 * The keys are the paths on the objects where the value would have been
 * found.
 *
 * Note: This function does not give special treatment to properties
 * with dots in them.
 */
exports.flatten = function (r) {
    return (flatImpl('')({})(r));
};
var flatImpl = function (pfix) { return function (prev) { return function (r) {
    return exports.reduce(r, prev, function (p, c, k) {
        var _a;
        return type_1.isObject(c) ?
            (flatImpl(prefix(pfix, k))(p)(c)) :
            exports.merge(p, (_a = {}, _a[prefix(pfix, k)] = c, _a));
    });
}; }; };
var prefix = function (pfix, key) { return (pfix === '') ?
    key : pfix + "." + key; };
/**
 * partition a Record into two sub-records using a separating function.
 *
 * This function produces an array where the first element is a record
 * of passing values and the second the failing values.
 */
exports.partition = function (r) { return function (f) {
    return exports.reduce(r, [{}, {}], function (_a, c, k) {
        var yes = _a[0], no = _a[1];
        var _b, _c;
        return f(c, k, r) ?
            [exports.merge(yes, (_b = {}, _b[k] = c, _b)), no] :
            [yes, exports.merge(no, (_c = {}, _c[k] = c, _c))];
    });
}; };
/**
 * group the properties of a Record into another Record using a grouping
 * function.
 */
exports.group = function (r) { return function (f) {
    return exports.reduce(r, {}, function (p, c, k) {
        var _a, _b, _c;
        var g = f(c, k, r);
        return exports.merge(p, (_a = {},
            _a[g] = exports.isRecord(p[g]) ?
                exports.merge(p[g], (_b = {}, _b[k] = c, _b)) : (_c = {}, _c[k] = c, _c),
            _a));
    });
}; };
/**
 * values returns a shallow array of the values of a record.
 */
exports.values = function (r) {
    return exports.reduce(r, [], function (p, c) { return array_1.concat(p)(c); });
};
//# sourceMappingURL=record.js.map