"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
/**
 * identity is the famed identity function.
 */
exports.identity = function (a) { return a; };
/**
 * merge two objects easily
 */
exports.merge = function () {
    var o = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        o[_i] = arguments[_i];
    }
    return Object.assign.apply(Object, o);
};
/**
 * reduce an object's keys (in no guaranteed order)
 */
exports.reduce = function (o, f, accum) {
    return Object.keys(o).reduce(function (p, k) { return f(p, o[k], k, o); }, accum);
};
/**
 * map over an object (in no guaranteed oreder)
 */
exports.map = function (o, f) {
    return Object.keys(o).map((function (k) { return f(o[k], k, o); }));
};
/**
 * compose two functions into one.
 */
exports.compose = function (f, g) { return function (x) { return f(g(x)); }; };
/**
 * fling removes a key from an object
 * @param {string} key
 * @param {object} object
 * @return {Object}
 * @summary {(string,Object) →  Object}
 */
exports.fling = function (s, o) {
    if ((o == null) || (o.constructor !== Object))
        throw new TypeError('fling(): only works with object literals!');
    return Object.keys(o).reduce(function (o2, k) {
        return k === s ? o2 : exports.merge(o2, (_a = {},
            _a[k] = o[k],
            _a));
        var _a;
    }, {});
};
/**
 * head returns the item at index 0 of an array
 * @param {Array} list
 * @return {*}
 * @summary { Array →  * }
 */
exports.head = function (list) { return list[0]; };
/**
 * tail returns the last item in an array
 * @param {Array} list
 * @return {*}
 * @summary {Array →  *}
 */
exports.tail = function (list) { return list[list.length - 1]; };
/**
 * constant given a value, return a function that always returns this value.
 * @summary constant X →  * →  X
 *
 */
exports.constant = function (a) { return function () { return a; }; };
//# sourceMappingURL=index.js.map