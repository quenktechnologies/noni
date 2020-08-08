"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBadKey = exports.set = exports.every = exports.some = exports.empty = exports.count = exports.clone = exports.contains = exports.values = exports.group = exports.partition = exports.exclude = exports.rmerge5 = exports.rmerge4 = exports.rmerge3 = exports.rmerge = exports.merge5 = exports.merge4 = exports.merge3 = exports.merge = exports.filter = exports.reduce = exports.mapTo = exports.map = exports.keys = exports.isRecord = exports.assign = exports.badKeys = void 0;
/**
 * The record module provides functions for treating ES objects as records.
 *
 * Some of the functions provided here are inherently unsafe (tsc will not
 * be able track integrity and may result in runtime errors if not used carefully.
 */
var array_1 = require("../array");
var type_1 = require("../type");
/**
 * badKeys is a list of keys we don't want to copy around between objects.
 *
 * Mostly due to prototype pollution but who knows what other keys may become
 * a problem as the language matures.
 */
exports.badKeys = ['__proto__'];
/**
 * assign is an Object.assign polyfill.
 *
 * It is used internally and should probably never be used directly in
 * production code.
 */
function assign(target) {
    var _varArgs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _varArgs[_i - 1] = arguments[_i];
    }
    var to = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null)
            for (var nextKey in nextSource)
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey))
                    // TODO: Should this clone the value to break references?
                    exports.set(to, nextKey, nextSource[nextKey]);
    }
    return to;
}
exports.assign = assign;
/**
 * isRecord tests whether a value is a record.
 *
 * The following are not considered records:
 * 1. Array
 * 2. Date
 * 3. RegExp
 *
 * This function is unsafe.
 */
exports.isRecord = function (value) {
    return (typeof value === 'object') &&
        (value != null) &&
        (!Array.isArray(value)) &&
        (!(value instanceof Date)) &&
        (!(value instanceof RegExp));
};
/**
 * keys produces a list of property names from a Record.
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
 * mapTo maps over a Record's properties producing an array of each result.
 *
 * The order of elements in the array is not guaranteed.
 */
exports.mapTo = function (o, f) {
    return exports.keys(o).map(function (k) { return f(o[k], k, o); });
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
 * filter the keys of a record using a filter function.
 */
exports.filter = function (o, f) {
    return exports.keys(o).reduce(function (p, k) {
        var _a;
        return f(o[k], k, o) ? exports.merge(p, (_a = {}, _a[k] = o[k], _a)) : p;
    }, {});
};
/**
 * merge two objects into one.
 *
 * The return value's type is the product of the two types supplied.
 * This function may be unsafe.
 */
exports.merge = function (left, right) { return assign({}, left, right); };
/**
 * merge3 merges 3 records into one.
 */
exports.merge3 = function (a, b, c) { return assign({}, a, b, c); };
/**
 * merge4 merges 4 records into one.
 */
exports.merge4 = function (a, b, c, d) {
    return assign({}, a, b, c, d);
};
/**
 * merge5 merges 5 records into one.
 */
exports.merge5 = function (a, b, c, d, e) { return assign({}, a, b, c, d, e); };
/**
 * rmerge merges 2 records recursively.
 *
 * This function may be unsafe.
 */
exports.rmerge = function (left, right) {
    return exports.reduce(right, left, deepMerge);
};
/**
 * rmerge3 merges 3 records recursively.
 */
exports.rmerge3 = function (r, s, t) {
    return [s, t]
        .reduce(function (p, c) {
        return exports.reduce(c, (p), deepMerge);
    }, r);
};
/**
 * rmerge4 merges 4 records recursively.
 */
exports.rmerge4 = function (r, s, t, u) {
    return [s, t, u]
        .reduce(function (p, c) {
        return exports.reduce(c, (p), deepMerge);
    }, r);
};
/**
 * rmerge5 merges 5 records recursively.
 */
exports.rmerge5 = function (r, s, t, u, v) {
    return [s, t, u, v]
        .reduce(function (p, c) {
        return exports.reduce(c, (p), deepMerge);
    }, r);
};
var deepMerge = function (pre, curr, key) {
    var _a, _b;
    return exports.isRecord(curr) ?
        exports.merge(pre, (_a = {},
            _a[key] = exports.isRecord(pre[key]) ?
                exports.rmerge(pre[key], curr) :
                curr // TODO: this should be cloned to break references.
        ,
            _a)) :
        exports.merge(pre, (_b = {}, _b[key] = curr, _b));
};
/**
 * exclude removes the specified properties from a Record.
 */
exports.exclude = function (o, keys) {
    var list = Array.isArray(keys) ? keys : [keys];
    return exports.reduce(o, {}, function (p, c, k) {
        var _a;
        return list.indexOf(k) > -1 ? p : exports.merge(p, (_a = {}, _a[k] = c, _a));
    });
};
/**
 * partition a Record into two sub-records using a separating function.
 *
 * This function produces an array where the first element is a record
 * of passing values and the second the failing values.
 */
exports.partition = function (r, f) {
    return exports.reduce(r, [{}, {}], function (_a, c, k) {
        var _b, _c;
        var yes = _a[0], no = _a[1];
        return f(c, k, r) ?
            [exports.merge(yes, (_b = {}, _b[k] = c, _b)), no] :
            [yes, exports.merge(no, (_c = {}, _c[k] = c, _c))];
    });
};
/**
 * group the properties of a Record into another Record using a grouping
 * function.
 */
exports.group = function (rec, f) {
    return exports.reduce(rec, {}, function (prev, curr, key) {
        var _a, _b;
        var category = f(curr, key, rec);
        return exports.merge(prev, (_a = {},
            _a[category] = exports.isRecord(prev[category]) ?
                exports.merge(prev[category], (_b = {}, _b[key] = curr, _b)) :
                exports.set({}, key, curr),
            _a));
    });
};
/**
 * values returns a shallow array of the values of a record.
 */
exports.values = function (r) {
    return exports.reduce(r, [], function (p, c) { return array_1.concat(p, c); });
};
/**
 * contains indicates whether a Record has a given key.
 */
exports.contains = function (r, key) {
    return Object.hasOwnProperty.call(r, key);
};
/**
 * clone a Record.
 *
 * Breaks references and deep clones arrays.
 * This function should only be used on Records or objects that
 * are not class instances.
 */
exports.clone = function (r) {
    return exports.reduce(r, {}, function (p, c, k) { exports.set(p, k, _clone(c)); return p; });
};
var _clone = function (a) {
    if (type_1.isArray(a))
        return a.map(_clone);
    else if (exports.isRecord(a))
        return exports.clone(a);
    else
        return a;
};
/**
 * count how many properties exist on the record.
 */
exports.count = function (r) { return exports.keys(r).length; };
/**
 * empty tests whether the object has any properties or not.
 */
exports.empty = function (r) { return exports.count(r) === 0; };
/**
 * some tests whether at least one property of a Record passes the
 * test implemented by the provided function.
 */
exports.some = function (o, f) {
    return exports.keys(o).some(function (k) { return f(o[k], k, o); });
};
/**
 * every tests whether each property of a Record passes the
 * test implemented by the provided function.
 */
exports.every = function (o, f) {
    return exports.keys(o).every(function (k) { return f(o[k], k, o); });
};
/**
 * set the value of a key on a Record ignoring problematic keys.
 *
 * This function exists to avoid unintentionally setting problem keys such
 * as __proto__ on an object.
 *
 * The function modifies the passed record.
 */
exports.set = function (r, k, value) {
    if (!exports.isBadKey(k))
        r[k] = value;
    return r;
};
/**
 * isBadKey tests whether a key is problematic (Like __proto__).
 */
exports.isBadKey = function (key) {
    return exports.badKeys.indexOf(key) !== -1;
};
//# sourceMappingURL=index.js.map