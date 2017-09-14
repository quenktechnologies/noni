"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
/**
 * just wraps a value in a Just
 */
exports.just = function (a) { return new Just(a); };
;
/**
 * nothing constructs nothing
 */
exports.nothing = function () { return new Nothing(); };
/**
 * fromAny constructs a Maybe from a value that may be null.
 */
exports.fromAny = function (a) { return a == null ? exports.nothing() : exports.just(a); };
/**
 * fromArray checks an array to see if it's empty (or full of nulls)
 * and returns a Maybe.
 */
exports.fromArray = function (a) {
    return ((a.length === 0) || (a.reduce(function (c, v) { return (v == null) ? c + 1 : c; }, 0) === a.length)) ?
        exports.nothing() : exports.just(a);
};
/**
 * fromOBject uses Object.keys to turn see if an object has any own properties.
 */
exports.fromObject = function (o) {
    return Object.keys(o).length === 0 ? exports.nothing() : exports.just(o);
};
/**
 * fromString constructs nothing if the string is empty or just otherwise.
 */
exports.fromString = function (s) {
    return (s === '') ? exports.nothing() : exports.just(s);
};
/**
 * fromBoolean constructs nothing if b is false, just otherwise
 */
exports.fromBoolean = function (b) {
    return (b === false) ? exports.nothing() : exports.just(b);
};
/**
 * fromNumber constructs nothing if n is 0 just otherwise.
 */
exports.fromNumber = function (n) {
    return (n === 0) ? exports.nothing() : exports.just(n);
};
/**
 * Maybe
 */
var Maybe = (function () {
    function Maybe() {
    }
    Maybe.prototype.of = function (a) {
        return new Just(a);
    };
    Maybe.just = exports.just;
    Maybe.nothing = exports.nothing;
    Maybe.fromAny = exports.fromAny;
    Maybe.fromObject = exports.fromObject;
    Maybe.fromArray = exports.fromArray;
    Maybe.fromString = exports.fromString;
    Maybe.fromBoolean = exports.fromBoolean;
    return Maybe;
}());
exports.Maybe = Maybe;
/**
 * Nothing
 */
var Nothing = (function (_super) {
    __extends(Nothing, _super);
    function Nothing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Nothing.prototype.map = function (_) {
        return new Nothing();
    };
    Nothing.prototype.chain = function (_) {
        return new Nothing();
    };
    Nothing.prototype.get = function () {
        throw new TypeError('Cannot get anything from Nothing!');
    };
    Nothing.prototype.orElse = function (f) {
        return f();
    };
    /**
     * orJust will turn Nothing into Just, wrapping the value specified.
     */
    Nothing.prototype.orJust = function (f) {
        return exports.just(f());
    };
    /**
     * cata applies the corresponding function to the Maybe
     */
    Nothing.prototype.cata = function (f, _g) {
        return f();
    };
    Nothing.prototype.toEither = function () {
        return Either_1.left(undefined);
    };
    return Nothing;
}(Maybe));
exports.Nothing = Nothing;
/**
 * Just
 */
var Just = (function (_super) {
    __extends(Just, _super);
    function Just(a) {
        var _this = _super.call(this) || this;
        _this.a = a;
        return _this;
    }
    Just.prototype.map = function (f) {
        return new Just(f(this.a));
    };
    Just.prototype.join = function () {
        return this.a;
    };
    Just.prototype.chain = function (f) {
        return f(this.a);
    };
    Just.prototype.get = function () {
        return this.a;
    };
    Just.prototype.orElse = function (_f) {
        return this;
    };
    Just.prototype.orJust = function (_f) {
        return this;
    };
    Just.prototype.cata = function (_f, g) {
        return g(this.a);
    };
    Just.prototype.toEither = function () {
        return Either_1.right(this.a);
    };
    return Just;
}(Maybe));
exports.Just = Just;
//# sourceMappingURL=Maybe.js.map