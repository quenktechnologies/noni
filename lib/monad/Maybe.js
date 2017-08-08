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
exports.fromAny = function (a) { return a == null ? new Nothing() : exports.just(a); };
/**
 * Maybe
 */
var Maybe = (function () {
    function Maybe() {
    }
    Maybe.prototype.of = function (a) {
        return new Just(a);
    };
    Maybe.prototype.map = function (_) {
        return this;
    };
    Maybe.prototype.join = function () {
        return this;
    };
    Maybe.prototype.chain = function (_) {
        return this;
    };
    Maybe.prototype.get = function () {
        throw new TypeError('Cannot get anything from Nothing!');
    };
    Maybe.prototype.orElse = function (f) {
        return f();
    };
    /**
     * orJust will turn Nothing into Just, wrapping the value specified.
     */
    Maybe.prototype.orJust = function (f) {
        return exports.just(f());
    };
    /**
     * cata applies the corresponding function to the Maybe
     */
    Maybe.prototype.cata = function (f, _g) {
        return f();
    };
    Maybe.just = exports.just;
    Maybe.nothing = exports.nothing;
    Maybe.fromAny = exports.fromAny;
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
        return this.map(f).join();
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
    return Just;
}(Maybe));
exports.Just = Just;
//# sourceMappingURL=Maybe.js.map