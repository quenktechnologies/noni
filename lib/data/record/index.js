"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEqual = exports.pickValue = exports.pickKey = exports.make = exports.rcompact = exports.compact = exports.isBadKey = exports.set = exports.every = exports.some = exports.empty = exports.count = exports.clone = exports.hasKey = exports.values = exports.group = exports.partition = exports.exclude = exports.rmerge5 = exports.rmerge4 = exports.rmerge3 = exports.rmerge = exports.merge5 = exports.merge4 = exports.merge3 = exports.merge = exports.filter = exports.reduce = exports.forEach = exports.mapTo = exports.map = exports.keys = exports.isRecord = exports.assign = exports.badKeys = void 0;
/**
 * The record module provides functions for treating ES objects as records.
 *
 * Some of the functions provided here are not type safe and may result in
 * runtime errors if not used carefully.
 */
const array_1 = require("../array");
const type_1 = require("../type");
const maybe_1 = require("../maybe");
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
function assign(target, ..._varArgs) {
    let to = Object(target);
    for (let index = 1; index < arguments.length; index++) {
        let nextSource = arguments[index];
        if (nextSource != null)
            for (let nextKey in nextSource)
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey))
                    (0, exports.set)(to, nextKey, nextSource[nextKey]);
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
const isRecord = (value) => (typeof value === 'object') &&
    (value != null) &&
    (!Array.isArray(value)) &&
    (!(value instanceof Date)) &&
    (!(value instanceof RegExp));
exports.isRecord = isRecord;
/**
 * keys is an Object.keys shortcut.
 */
const keys = (obj) => Object.keys(obj);
exports.keys = keys;
/**
 * map over a Record's properties producing a new record.
 *
 * The order of keys processed is not guaranteed.
 */
const map = (rec, f) => (0, exports.keys)(rec)
    .reduce((p, k) => (0, exports.merge)(p, (0, exports.set)({}, k, f(rec[k], k, rec))), {});
exports.map = map;
/**
 * mapTo an array the properties of the provided Record.
 *
 * The elements of the array are the result of applying the function provided
 * to each property. The order of elements is not guaranteed.
 */
const mapTo = (rec, f) => (0, exports.keys)(rec).map(k => f(rec[k], k, rec));
exports.mapTo = mapTo;
/**
 * forEach is similar to map only the result of each function call is not kept.
 *
 * The order of keys processed is not guaranteed.
 */
const forEach = (rec, f) => (0, exports.keys)(rec).forEach(k => f(rec[k], k, rec));
exports.forEach = forEach;
/**
 * reduce a Record's keys to a single value.
 *
 * The initial value (accum) must be supplied to avoid errors when
 * there are no properties on the Record. The order of keys processed is
 * not guaranteed.
 */
const reduce = (rec, accum, f) => (0, exports.keys)(rec).reduce((p, k) => f(p, rec[k], k), accum);
exports.reduce = reduce;
/**
 * filter the keys of a Record using a filter function.
 */
const filter = (rec, f) => (0, exports.keys)(rec)
    .reduce((p, k) => f(rec[k], k, rec) ?
    (0, exports.merge)(p, (0, exports.set)({}, k, rec[k])) : p, {});
exports.filter = filter;
/**
 * merge two objects (shallow) into one new object.
 *
 * The return value's type is the product of the two objects provided.
 */
const merge = (left, right) => assign({}, left, right);
exports.merge = merge;
/**
 * merge3
 */
const merge3 = (a, b, c) => assign({}, a, b, c);
exports.merge3 = merge3;
/**
 * merge4
 */
const merge4 = (a, b, c, d) => assign({}, a, b, c, d);
exports.merge4 = merge4;
/**
 * merge5
 */
const merge5 = (a, b, c, d, e) => assign({}, a, b, c, d, e);
exports.merge5 = merge5;
/**
 * rmerge merges 2 records recursively.
 *
 * This function may violate type safety.
 */
const rmerge = (left, right) => (0, exports.reduce)(right, left, deepMerge);
exports.rmerge = rmerge;
/**
 * rmerge3
 */
const rmerge3 = (r, s, t) => [s, t]
    .reduce((p, c) => (0, exports.reduce)(c, (p), deepMerge), r);
exports.rmerge3 = rmerge3;
/**
 * rmerge4
 */
const rmerge4 = (r, s, t, u) => [s, t, u]
    .reduce((p, c) => (0, exports.reduce)(c, (p), deepMerge), r);
exports.rmerge4 = rmerge4;
/**
 * rmerge5
 */
const rmerge5 = (r, s, t, u, v) => [s, t, u, v]
    .reduce((p, c) => (0, exports.reduce)(c, (p), deepMerge), r);
exports.rmerge5 = rmerge5;
const deepMerge = (pre, curr, key) => (0, exports.isRecord)(curr) ?
    (0, exports.merge)(pre, (0, exports.set)({}, key, (0, exports.isRecord)(pre[key]) ?
        (0, exports.rmerge)(pre[key], curr) :
        (0, exports.merge)({}, curr))) :
    (0, exports.merge)(pre, (0, exports.set)({}, key, curr));
/**
 * exclude removes the specified properties from a Record.
 */
const exclude = (rec, keys) => {
    let list = Array.isArray(keys) ? keys : [keys];
    return (0, exports.reduce)(rec, {}, (p, c, k) => list.indexOf(k) > -1 ? p : (0, exports.merge)(p, (0, exports.set)({}, k, c)));
};
exports.exclude = exclude;
/**
 * partition a Record into two sub-records using a PartitionFunc function.
 *
 * This function produces an array where the first element is a Record
 * of values that return true and the second, false.
 */
const partition = (r, f) => (0, exports.reduce)(r, [{}, {}], ([yes, no], c, k) => f(c, k, r) ?
    [(0, exports.merge)(yes, (0, exports.set)({}, k, c)), no] :
    [yes, (0, exports.merge)(no, (0, exports.set)({}, k, c))]);
exports.partition = partition;
/**
 * group the properties of a Record into another Record using a GroupFunc
 * function.
 */
const group = (rec, f) => (0, exports.reduce)(rec, {}, (prev, curr, key) => {
    let category = f(curr, key, rec);
    let value = (0, exports.isRecord)(prev[category]) ?
        (0, exports.merge)(prev[category], (0, exports.set)({}, key, curr)) :
        (0, exports.set)({}, key, curr);
    return (0, exports.merge)(prev, (0, exports.set)({}, category, value));
});
exports.group = group;
/**
 * values returns a shallow array of the values of a record.
 */
const values = (r) => (0, exports.reduce)(r, [], (p, c) => (0, array_1.concat)(p, c));
exports.values = values;
/**
 * hasKey indicates whether a Record has a given key.
 */
const hasKey = (r, key) => Object.hasOwnProperty.call(r, key);
exports.hasKey = hasKey;
/**
 * clone a Record.
 *
 * Breaks references and deep clones arrays.
 * This function should only be used on Records or objects that
 * are not class instances. This function may violate type safety.
 */
const clone = (r) => (0, exports.reduce)(r, {}, (p, c, k) => { (0, exports.set)(p, k, _clone(c)); return p; });
exports.clone = clone;
const _clone = (a) => {
    if ((0, type_1.isArray)(a))
        return a.map(_clone);
    else if ((0, exports.isRecord)(a))
        return (0, exports.clone)(a);
    else
        return a;
};
/**
 * count how many properties exist on the record.
 */
const count = (r) => (0, exports.keys)(r).length;
exports.count = count;
/**
 * empty tests whether the object has any properties or not.
 */
const empty = (r) => (0, exports.count)(r) === 0;
exports.empty = empty;
/**
 * some tests whether at least one property of a Record passes the
 * test implemented by the provided function.
 */
const some = (o, f) => (0, exports.keys)(o).some(k => f(o[k], k, o));
exports.some = some;
/**
 * every tests whether each property of a Record passes the
 * test implemented by the provided function.
 */
const every = (o, f) => (0, exports.keys)(o).every(k => f(o[k], k, o));
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
const set = (r, k, value) => {
    if (!(0, exports.isBadKey)(k))
        r[k] = value;
    return r;
};
exports.set = set;
/**
 * isBadKey tests whether a key is problematic (Like __proto__).
 */
const isBadKey = (key) => exports.badKeys.indexOf(key) !== -1;
exports.isBadKey = isBadKey;
/**
 * compact a Record by removing any properties that == null.
 */
const compact = (rec) => {
    let result = {};
    for (let key in rec)
        if (rec.hasOwnProperty(key))
            if (rec[key] != null)
                result = (0, exports.set)(result, key, rec[key]);
    return result;
};
exports.compact = compact;
/**
 * rcompact recursively compacts a Record.
 */
const rcompact = (rec) => (0, exports.compact)((0, exports.map)(rec, val => (0, exports.isRecord)(val) ? (0, exports.rcompact)(val) : val));
exports.rcompact = rcompact;
/**
 * make creates a new instance of a Record optionally using the provided
 * value as an initializer.
 *
 * This function is intended to assist with curbing prototype pollution by
 * configuring a setter for __proto__ that ignores changes.
 */
const make = (init = {}) => {
    let rec = {};
    Object.defineProperty(rec, '__proto__', {
        configurable: false,
        enumerable: false,
        set() { }
    });
    for (let key in init)
        if (init.hasOwnProperty(key))
            rec[key] = init[key];
    return rec;
};
exports.make = make;
/**
 * pickKey selects the value of the first property in a Record that passes the
 * provided test.
 */
const pickKey = (rec, test) => (0, exports.reduce)(rec, (0, maybe_1.nothing)(), (p, c, k) => p.isJust() ? p : test(c, k, rec) ? (0, maybe_1.just)(k) : p);
exports.pickKey = pickKey;
/**
 * pickValue selects the value of the first property in a Record that passes the
 * provided test.
 */
const pickValue = (rec, test) => (0, exports.reduce)(rec, (0, maybe_1.nothing)(), (p, c, k) => p.isJust() ? p : test(c, k, rec) ? (0, maybe_1.just)(c) : p);
exports.pickValue = pickValue;
/**
 * isEqual shallow compares two records to determine if they are equivalent.
 */
const isEqual = (rec1, rec2) => (0, exports.keys)(rec1).every(key => rec2[key] ===
    rec1[key]);
exports.isEqual = isEqual;
//# sourceMappingURL=index.js.map