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
 * left wraps a value on the left side.
 */
exports.left = function (a) { return new Left(a); };
/**
 * right wraps a value on the right side.
 */
exports.right = function (b) { return new Right(b); };
/**
 * fromBoolean constructs an Either using a boolean value.
 */
exports.fromBoolean = function (b) {
    return b ? exports.right(true) : exports.left(false);
};
/**
 * Either monad implementation
 */
var Either = (function () {
    function Either() {
    }
    Either.prototype.of = function (v) {
        return new Right(v);
    };
    Either.left = exports.left;
    Either.right = exports.right;
    Either.fromBoolean = exports.fromBoolean;
    return Either;
}());
exports.Either = Either;
var Left = (function (_super) {
    __extends(Left, _super);
    function Left(l) {
        var _this = _super.call(this) || this;
        _this.l = l;
        return _this;
    }
    Left.prototype.map = function (_) {
        return new Left(this.l);
    };
    Left.prototype.mapLeft = function (f) {
        return new Left(f(this.l));
    };
    Left.prototype.bimap = function (f, _) {
        return exports.left(f(this.l));
    };
    Left.prototype.chain = function (_) {
        return new Left(this.l);
    };
    Left.prototype.orElse = function (f) {
        return f(this.l);
    };
    Left.prototype.orRight = function (f) {
        return new Right(f(this.l));
    };
    Left.prototype.ap = function (_) {
        return new Left(this.l);
    };
    Left.prototype.takeLeft = function () {
        return this.l;
    };
    Left.prototype.takeRight = function () {
        throw new TypeError("Not right!");
    };
    Left.prototype.cata = function (f, _) {
        return f(this.l);
    };
    return Left;
}(Either));
exports.Left = Left;
var Right = (function (_super) {
    __extends(Right, _super);
    function Right(r) {
        var _this = _super.call(this) || this;
        _this.r = r;
        return _this;
    }
    Right.prototype.map = function (f) {
        return new Right(f(this.r));
    };
    Right.prototype.mapLeft = function (_) {
        return new Right(this.r);
    };
    Right.prototype.bimap = function (_, g) {
        return exports.right(g(this.r));
    };
    Right.prototype.chain = function (f) {
        return f(this.r);
    };
    /**
     * orElse returns the result of f if the Either is left.
     */
    Right.prototype.orElse = function (_) {
        return this;
    };
    Right.prototype.orRight = function (_) {
        return this;
    };
    /**
     * ap
     */
    Right.prototype.ap = function (e) {
        var _this = this;
        return e.map(function (f) { return f(_this.r); });
    };
    /**
      * takeLeft extracts the left value of an Either, throwing an error if the Either is right.
      */
    Right.prototype.takeLeft = function () {
        throw new TypeError("Not left!");
    };
    Right.prototype.takeRight = function () {
        return this.r;
    };
    /**
     * cata
     */
    Right.prototype.cata = function (_, g) {
        return g(this.r);
    };
    return Right;
}(Either));
exports.Right = Right;
//# sourceMappingURL=Either.js.map