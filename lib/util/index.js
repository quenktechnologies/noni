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
    return Object.assign.apply(Object, [{}].concat(o));
};
/**
 * fuse is the deep version of merge
 */
exports.fuse = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (o, c) {
        if (c === void 0) { c = {}; }
        return exports.reduce(c, function (co, cc, k) {
            return Array.isArray(cc) ?
                (Array.isArray(co[k]) ?
                    exports.merge(co, (_a = {}, _a[k] = (co[k]).map(exports.copy).concat(cc.map(exports.copy)), _a)) :
                    exports.merge(co, (_b = {}, _b[k] = cc.map(exports.copy), _b))) :
                typeof cc !== 'object' ?
                    exports.merge(co, (_c = {}, _c[k] = cc, _c)) :
                    exports.merge(co, (_d = {},
                        _d[k] = (typeof co[k] !== 'object') ?
                            exports.merge(co[k], cc) :
                            exports.fuse(co[k], cc),
                        _d));
            var _a, _b, _c, _d;
        }, o);
    }, {});
};
exports.copy = function (o) {
    return (Array.isArray(o)) ?
        o.map(exports.copy) :
        (typeof o === 'object') ?
            exports.reduce(o, function (p, c, k) {
                return exports.merge(p, (_a = {}, _a[k] = exports.copy(c), _a));
                var _a;
            }, {}) : o;
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
/**
 * f1 partial application.
 */
exports.f1 = function (f) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (a) { return f.apply(null, args.concat(a)); };
};
/**
 * f2 partial application
 */
exports.f2 = function (f) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (a) { return function (aa) { return f.apply(null, args.concat(a, aa)); }; };
};
/**
 * f3 partial application
 */
exports.f3 = function (f) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (a) { return function (aa) { return function (aaa) { return f.apply(null, args.concat(a, aa, aaa)); }; }; };
};
/**
 * f4 partial application
 */
exports.f4 = function (f) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (a) { return function (aa) { return function (aaa) { return function (aaaa) {
        return f.apply(null, args.concat(a, aa, aaa, aaaa));
    }; }; }; };
};
/**
 * f5 partial application
 */
exports.f5 = function (f) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (a) { return function (aa) { return function (aaa) { return function (aaaa) { return function (aaaaa) {
        return f.apply(null, args.concat(a, aa, aaa, aaaa, aaaaa));
    }; }; }; }; };
};
//# sourceMappingURL=index.js.map