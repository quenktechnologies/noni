"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rcompact = exports.compact = exports.isBadKey = exports.set = exports.every = exports.some = exports.empty = exports.count = exports.clone = exports.hasKey = exports.values = exports.group = exports.partition = exports.exclude = exports.rmerge5 = exports.rmerge4 = exports.rmerge3 = exports.rmerge = exports.merge5 = exports.merge4 = exports.merge3 = exports.merge = exports.filter = exports.reduce = exports.mapTo = exports.map = exports.keys = exports.isRecord = exports.assign = exports.badKeys = void 0;
/**
 * The record module provides functions for treating ES objects as records.
 *
 * Some of the functions provided here are not type safe and may result in
 * runtime errors if not used carefully.
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
 * It is used internally and should probably not be used directly elsewhere.
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
                    exports.set(to, nextKey, nextSource[nextKey]);
    }
    return to;
}
exports.assign = assign;
/**
 * isRecord tests whether a value is a record.
 *
 * To be a Record, a value must be an object and:
 * 1. must not be null
 * 2. must not be an Array
 * 2. must not be an instance of Date
 * 3. must not be an instance of RegExp
 */
exports.isRecord = function (value) {
    return (typeof value === 'object') &&
        (value != null) &&
        (!Array.isArray(value)) &&
        (!(value instanceof Date)) &&
        (!(value instanceof RegExp));
};
/**
 * keys is an Object.keys shortcut.
 */
exports.keys = function (obj) { return Object.keys(obj); };
/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
exports.map = function (rec, f) {
    return exports.keys(rec)
        .reduce(function (p, k) { return exports.merge(p, exports.set({}, k, f(rec[k], k, rec))); }, {});
};
/**
 * mapTo an array the properties of the provided Record.
 *
 * The elements of the array are the result of applying the function provided
 * to each property. The order of elements is not guaranteed.
 */
exports.mapTo = function (rec, f) {
    return exports.keys(rec).map(function (k) { return f(rec[k], k, rec); });
};
/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properites on the Record. The order of keys processed is
 * not guaranteed.
 */
exports.reduce = function (rec, accum, f) {
    return exports.keys(rec).reduce(function (p, k) { return f(p, rec[k], k); }, accum);
};
/**
 * filter the keys of a Record using a filter function.
 */
exports.filter = function (rec, f) {
    return exports.keys(rec)
        .reduce(function (p, k) { return f(rec[k], k, rec) ?
        exports.merge(p, exports.set({}, k, rec[k])) : p; }, {});
};
/**
 * merge two objects (shallow) into one new object.
 *
 * The return value's type is the product of the two objects provided.
 */
exports.merge = function (left, right) { return assign({}, left, right); };
/**
 * merge3
 */
exports.merge3 = function (a, b, c) { return assign({}, a, b, c); };
/**
 * merge4
 */
exports.merge4 = function (a, b, c, d) {
    return assign({}, a, b, c, d);
};
/**
 * merge5
 */
exports.merge5 = function (a, b, c, d, e) {
    return assign({}, a, b, c, d, e);
};
/**
 * rmerge merges 2 records recursively.
 *
 * This function may violate type safety.
 */
exports.rmerge = function (left, right) {
    return exports.reduce(right, left, deepMerge);
};
/**
 * rmerge3
 */
exports.rmerge3 = function (r, s, t) {
    return [s, t]
        .reduce(function (p, c) {
        return exports.reduce(c, (p), deepMerge);
    }, r);
};
/**
 * rmerge4
 */
exports.rmerge4 = function (r, s, t, u) {
    return [s, t, u]
        .reduce(function (p, c) {
        return exports.reduce(c, (p), deepMerge);
    }, r);
};
/**
 * rmerge5
 */
exports.rmerge5 = function (r, s, t, u, v) {
    return [s, t, u, v]
        .reduce(function (p, c) {
        return exports.reduce(c, (p), deepMerge);
    }, r);
};
var deepMerge = function (pre, curr, key) {
    return exports.isRecord(curr) ?
        exports.merge(pre, exports.set({}, key, exports.isRecord(pre[key]) ?
            exports.rmerge(pre[key], curr) :
            exports.merge({}, curr))) :
        exports.merge(pre, exports.set({}, key, curr));
};
/**
 * exclude removes the specified properties from a Record.
 */
exports.exclude = function (rec, keys) {
    var list = Array.isArray(keys) ? keys : [keys];
    return exports.reduce(rec, {}, function (p, c, k) {
        return list.indexOf(k) > -1 ? p : exports.merge(p, exports.set({}, k, c));
    });
};
/**
 * partition a Record into two sub-records using a PartitionFunc function.
 *
 * This function produces an array where the first element is a Record
 * of values that return true and the second, false.
 */
exports.partition = function (r, f) {
    return exports.reduce(r, [{}, {}], function (_a, c, k) {
        var yes = _a[0], no = _a[1];
        return f(c, k, r) ?
            [exports.merge(yes, exports.set({}, k, c)), no] :
            [yes, exports.merge(no, exports.set({}, k, c))];
    });
};
/**
 * group the properties of a Record into another Record using a GroupFunc
 * function.
 */
exports.group = function (rec, f) {
    return exports.reduce(rec, {}, function (prev, curr, key) {
        var category = f(curr, key, rec);
        var value = exports.isRecord(prev[category]) ?
            exports.merge(prev[category], exports.set({}, key, curr)) :
            exports.set({}, key, curr);
        return exports.merge(prev, exports.set({}, category, value));
    });
};
/**
 * values returns a shallow array of the values of a record.
 */
exports.values = function (r) {
    return exports.reduce(r, [], function (p, c) { return array_1.concat(p, c); });
};
/**
 * hasKey indicates whether a Record has a given key.
 */
exports.hasKey = function (r, key) {
    return Object.hasOwnProperty.call(r, key);
};
/**
 * clone a Record.
 *
 * Breaks references and deep clones arrays.
 * This function should only be used on Records or objects that
 * are not class instances. This function may violate type safety.
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
 * Even though this function mutates the provided record, it should be used
 * as though it does not.
 *
 * Don't:
 * set(obj, key, value);
 *
 * Do:
 * obj = set(obj, key, value);
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
/**
 * compact a Record by removing any properties that == null.
 */
exports.compact = function (rec) {
    var result = {};
    for (var key in rec)
        if (rec.hasOwnProperty(key))
            if (rec[key] != null)
                result = exports.set(result, key, rec[key]);
    return result;
};
/**
 * rcompact recursively compacts a Record.
 */
exports.rcompact = function (rec) {
    return exports.compact(exports.map(rec, function (val) { return exports.isRecord(val) ? exports.rcompact(val) : val; }));
};
//# sourceMappingURL=index.js.map