"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickValue = exports.pickKey = exports.make = exports.rcompact = exports.compact = exports.isBadKey = exports.set = exports.every = exports.some = exports.empty = exports.count = exports.clone = exports.hasKey = exports.values = exports.group = exports.partition = exports.exclude = exports.rmerge5 = exports.rmerge4 = exports.rmerge3 = exports.rmerge = exports.merge5 = exports.merge4 = exports.merge3 = exports.merge = exports.filter = exports.reduce = exports.forEach = exports.mapTo = exports.map = exports.keys = exports.isRecord = exports.assign = exports.badKeys = void 0;
/**
 * The record module provides functions for treating ES objects as records.
 *
 * Some of the functions provided here are not type safe and may result in
 * runtime errors if not used carefully.
 */
var array_1 = require("../array");
var type_1 = require("../type");
var maybe_1 = require("../maybe");
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
var isRecord = function (value) {
    return (typeof value === 'object') &&
        (value != null) &&
        (!Array.isArray(value)) &&
        (!(value instanceof Date)) &&
        (!(value instanceof RegExp));
};
exports.isRecord = isRecord;
/**
 * keys is an Object.keys shortcut.
 */
var keys = function (obj) { return Object.keys(obj); };
exports.keys = keys;
/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
var map = function (rec, f) {
    return exports.keys(rec)
        .reduce(function (p, k) { return exports.merge(p, exports.set({}, k, f(rec[k], k, rec))); }, {});
};
exports.map = map;
/**
 * mapTo an array the properties of the provided Record.
 *
 * The elements of the array are the result of applying the function provided
 * to each property. The order of elements is not guaranteed.
 */
var mapTo = function (rec, f) {
    return exports.keys(rec).map(function (k) { return f(rec[k], k, rec); });
};
exports.mapTo = mapTo;
/**
 * forEach is similar to map only the result of each function call is not kept.
 *
 * The order of keys processed is not guaranteed.
 */
var forEach = function (rec, f) {
    return exports.keys(rec).forEach(function (k) { return f(rec[k], k, rec); });
};
exports.forEach = forEach;
/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properties on the Record. The order of keys processed is
 * not guaranteed.
 */
var reduce = function (rec, accum, f) {
    return exports.keys(rec).reduce(function (p, k) { return f(p, rec[k], k); }, accum);
};
exports.reduce = reduce;
/**
 * filter the keys of a Record using a filter function.
 */
var filter = function (rec, f) {
    return exports.keys(rec)
        .reduce(function (p, k) { return f(rec[k], k, rec) ?
        exports.merge(p, exports.set({}, k, rec[k])) : p; }, {});
};
exports.filter = filter;
/**
 * merge two objects (shallow) into one new object.
 *
 * The return value's type is the product of the two objects provided.
 */
var merge = function (left, right) { return assign({}, left, right); };
exports.merge = merge;
/**
 * merge3
 */
var merge3 = function (a, b, c) { return assign({}, a, b, c); };
exports.merge3 = merge3;
/**
 * merge4
 */
var merge4 = function (a, b, c, d) {
    return assign({}, a, b, c, d);
};
exports.merge4 = merge4;
/**
 * merge5
 */
var merge5 = function (a, b, c, d, e) {
    return assign({}, a, b, c, d, e);
};
exports.merge5 = merge5;
/**
 * rmerge merges 2 records recursively.
 *
 * This function may violate type safety.
 */
var rmerge = function (left, right) {
    return exports.reduce(right, left, deepMerge);
};
exports.rmerge = rmerge;
/**
 * rmerge3
 */
var rmerge3 = function (r, s, t) {
    return [s, t]
        .reduce(function (p, c) {
        return exports.reduce(c, (p), deepMerge);
    }, r);
};
exports.rmerge3 = rmerge3;
/**
 * rmerge4
 */
var rmerge4 = function (r, s, t, u) {
    return [s, t, u]
        .reduce(function (p, c) {
        return exports.reduce(c, (p), deepMerge);
    }, r);
};
exports.rmerge4 = rmerge4;
/**
 * rmerge5
 */
var rmerge5 = function (r, s, t, u, v) {
    return [s, t, u, v]
        .reduce(function (p, c) {
        return exports.reduce(c, (p), deepMerge);
    }, r);
};
exports.rmerge5 = rmerge5;
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
var exclude = function (rec, keys) {
    var list = Array.isArray(keys) ? keys : [keys];
    return exports.reduce(rec, {}, function (p, c, k) {
        return list.indexOf(k) > -1 ? p : exports.merge(p, exports.set({}, k, c));
    });
};
exports.exclude = exclude;
/**
 * partition a Record into two sub-records using a PartitionFunc function.
 *
 * This function produces an array where the first element is a Record
 * of values that return true and the second, false.
 */
var partition = function (r, f) {
    return exports.reduce(r, [{}, {}], function (_a, c, k) {
        var yes = _a[0], no = _a[1];
        return f(c, k, r) ?
            [exports.merge(yes, exports.set({}, k, c)), no] :
            [yes, exports.merge(no, exports.set({}, k, c))];
    });
};
exports.partition = partition;
/**
 * group the properties of a Record into another Record using a GroupFunc
 * function.
 */
var group = function (rec, f) {
    return exports.reduce(rec, {}, function (prev, curr, key) {
        var category = f(curr, key, rec);
        var value = exports.isRecord(prev[category]) ?
            exports.merge(prev[category], exports.set({}, key, curr)) :
            exports.set({}, key, curr);
        return exports.merge(prev, exports.set({}, category, value));
    });
};
exports.group = group;
/**
 * values returns a shallow array of the values of a record.
 */
var values = function (r) {
    return exports.reduce(r, [], function (p, c) { return array_1.concat(p, c); });
};
exports.values = values;
/**
 * hasKey indicates whether a Record has a given key.
 */
var hasKey = function (r, key) {
    return Object.hasOwnProperty.call(r, key);
};
exports.hasKey = hasKey;
/**
 * clone a Record.
 *
 * Breaks references and deep clones arrays.
 * This function should only be used on Records or objects that
 * are not class instances. This function may violate type safety.
 */
var clone = function (r) {
    return exports.reduce(r, {}, function (p, c, k) { exports.set(p, k, _clone(c)); return p; });
};
exports.clone = clone;
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
var count = function (r) { return exports.keys(r).length; };
exports.count = count;
/**
 * empty tests whether the object has any properties or not.
 */
var empty = function (r) { return exports.count(r) === 0; };
exports.empty = empty;
/**
 * some tests whether at least one property of a Record passes the
 * test implemented by the provided function.
 */
var some = function (o, f) {
    return exports.keys(o).some(function (k) { return f(o[k], k, o); });
};
exports.some = some;
/**
 * every tests whether each property of a Record passes the
 * test implemented by the provided function.
 */
var every = function (o, f) {
    return exports.keys(o).every(function (k) { return f(o[k], k, o); });
};
exports.every = every;
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
var set = function (r, k, value) {
    if (!exports.isBadKey(k))
        r[k] = value;
    return r;
};
exports.set = set;
/**
 * isBadKey tests whether a key is problematic (Like __proto__).
 */
var isBadKey = function (key) {
    return exports.badKeys.indexOf(key) !== -1;
};
exports.isBadKey = isBadKey;
/**
 * compact a Record by removing any properties that == null.
 */
var compact = function (rec) {
    var result = {};
    for (var key in rec)
        if (rec.hasOwnProperty(key))
            if (rec[key] != null)
                result = exports.set(result, key, rec[key]);
    return result;
};
exports.compact = compact;
/**
 * rcompact recursively compacts a Record.
 */
var rcompact = function (rec) {
    return exports.compact(exports.map(rec, function (val) { return exports.isRecord(val) ? exports.rcompact(val) : val; }));
};
exports.rcompact = rcompact;
/**
 * make creates a new instance of a Record optionally using the provided
 * value as an initializer.
 *
 * This function is intended to assist with curbing prototype pollution by
 * configuring a setter for __proto__ that ignores changes.
 */
var make = function (init) {
    if (init === void 0) { init = {}; }
    var rec = {};
    Object.defineProperty(rec, '__proto__', {
        configurable: false,
        enumerable: false,
        set: function () { }
    });
    for (var key in init)
        if (init.hasOwnProperty(key))
            rec[key] = init[key];
    return rec;
};
exports.make = make;
/**
 * pickKey selects the value of the first property in a Record that passes the
 * provided test.
 */
var pickKey = function (rec, test) {
    return exports.reduce(rec, maybe_1.nothing(), function (p, c, k) {
        return p.isJust() ? p : test(c, k, rec) ? maybe_1.just(k) : p;
    });
};
exports.pickKey = pickKey;
/**
 * pickValue selects the value of the first property in a Record that passes the
 * provided test.
 */
var pickValue = function (rec, test) {
    return exports.reduce(rec, maybe_1.nothing(), function (p, c, k) {
        return p.isJust() ? p : test(c, k, rec) ? maybe_1.just(c) : p;
    });
};
exports.pickValue = pickValue;
//# sourceMappingURL=index.js.map