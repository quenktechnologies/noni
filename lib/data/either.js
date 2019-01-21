"use strict";
/**
 * Either represents a value that may be one of two types.
 *
 * An Either is either a Left or Right. Mapping and related functions over the
 * Left side returns the value unchanged. When the value is Right
 * functions are applied as normal.
 *
 * The Either concept is often used to accomodate error handling but there
 * are other places it may come in handy.
 *
 * An important point to note when using this type is that the left side
 * remains the same while chaining. That means, the types Either<number, string>
 * and Either<boolean, string> are two different types that can not be sequenced
 * together via map,chain etc.
 *
 * This turns up compiler errors in unexpected places and is sometimes rectified
 * by extracting the values out of the Either type completley and constructing
 * a fresh one.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("./maybe");
/**
 * The abstract Either class.
 *
 * This is the type that will be used in signatures.
 */
var Either = /** @class */ (function () {
    function Either() {
    }
    Either.prototype.of = function (value) {
        return new Right(value);
    };
    return Either;
}());
exports.Either = Either;
/**
 * Left side of the Either implementation.
 */
var Left = /** @class */ (function (_super) {
    __extends(Left, _super);
    function Left(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Left.prototype.map = function (_) {
        return new Left(this.value);
    };
    Left.prototype.lmap = function (f) {
        return new Left(f(this.value));
    };
    Left.prototype.bimap = function (f, _) {
        return new Left(f(this.value));
    };
    Left.prototype.alt = function (a) {
        return a;
    };
    Left.prototype.chain = function (_) {
        return new Left(this.value);
    };
    Left.prototype.ap = function (_) {
        return new Left(this.value);
    };
    Left.prototype.extend = function (_) {
        return new Left(this.value);
    };
    Left.prototype.fold = function (f, _) {
        return f(this.value);
    };
    Left.prototype.eq = function (m) {
        return ((m instanceof Left) && (m.value === this.value));
    };
    Left.prototype.orElse = function (f) {
        return f(this.value);
    };
    Left.prototype.orRight = function (f) {
        return new Right(f(this.value));
    };
    Left.prototype.isLeft = function () {
        return true;
    };
    Left.prototype.isRight = function () {
        return false;
    };
    Left.prototype.takeLeft = function () {
        return this.value;
    };
    Left.prototype.takeRight = function () {
        throw new TypeError("Not right!");
    };
    Left.prototype.toMaybe = function () {
        return maybe_1.nothing();
    };
    return Left;
}(Either));
exports.Left = Left;
/**
 * Right side implementation.
 */
var Right = /** @class */ (function (_super) {
    __extends(Right, _super);
    function Right(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Right.prototype.map = function (f) {
        return new Right(f(this.value));
    };
    Right.prototype.lmap = function (_) {
        return new Right(this.value);
    };
    Right.prototype.bimap = function (_, g) {
        return new Right(g(this.value));
    };
    Right.prototype.alt = function (_) {
        return this;
    };
    Right.prototype.chain = function (f) {
        return f(this.value);
    };
    Right.prototype.ap = function (e) {
        var _this = this;
        return e.map(function (f) { return f(_this.value); });
    };
    Right.prototype.extend = function (f) {
        return new Right(f(this));
    };
    Right.prototype.eq = function (m) {
        return ((m instanceof Right) && (m.value === this.value));
    };
    Right.prototype.fold = function (_, g) {
        return g(this.value);
    };
    Right.prototype.orElse = function (_) {
        return this;
    };
    Right.prototype.orRight = function (_) {
        return this;
    };
    Right.prototype.isLeft = function () {
        return false;
    };
    Right.prototype.isRight = function () {
        return true;
    };
    Right.prototype.takeLeft = function () {
        throw new TypeError("Not left!");
    };
    Right.prototype.takeRight = function () {
        return this.value;
    };
    Right.prototype.toMaybe = function () {
        return maybe_1.just(this.value);
    };
    return Right;
}(Either));
exports.Right = Right;
/**
 * left constructor helper.
 */
exports.left = function (a) { return new Left(a); };
/**
 * right constructor helper.
 */
exports.right = function (b) { return new Right(b); };
/**
 * fromBoolean constructs an Either using a boolean value.
 */
exports.fromBoolean = function (b) {
    return b ? exports.right(true) : exports.left(false);
};
/**
 * either given two functions, first for Left, second for Right, will return
 * the result of applying the appropriate function to an Either's internal value.
 */
exports.either = function (f) { return function (g) { return function (e) {
    return (e instanceof Right) ? g(e.takeRight()) : f(e.takeLeft());
}; }; };
//# sourceMappingURL=either.js.map