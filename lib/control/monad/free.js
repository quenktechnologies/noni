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
var either_1 = require("../../data/either");
var indentity_1 = require("../../data/indentity");
/**
 * Free monad implementation.
 *
 * This is a basic, somewhat naive implementation of a Free monad devoid
 * of stack safety.
 *
 * As far as the library is concerned, a [[Free]] provides a [[Monad]]
 * that can be used to provide a first-class micro DSL without the overhead
 * of parsing and compilation.
 *
 * A Free monad encases any [[Functor]] effectively promoting it to a monad.
 * These Functors represent your DSL and can be sequenced together via the
 * Free's Monad structure and later "interpreted" or "compiled" into a final
 * result.
 */
var Free = /** @class */ (function () {
    function Free() {
    }
    /**
     * of produces a pure Free from a value.
     */
    Free.prototype.of = function (a) {
        return new Return(a);
    };
    /**
     * map implementation.
     */
    Free.prototype.map = function (f) {
        return this.chain(function (a) { return new Return(f(a)); });
    };
    return Free;
}());
exports.Free = Free;
/**
 * Suspend constructor.
 * @private
 */
var Suspend = /** @class */ (function (_super) {
    __extends(Suspend, _super);
    function Suspend(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Suspend.prototype.chain = function (f) {
        return new Suspend(this.value.map(function (free) { return free.chain(f); }));
    };
    Suspend.prototype.ap = function (f) {
        return this.chain(function (x) { return f.map(function (g) { return g(x); }); });
    };
    Suspend.prototype.resume = function () {
        return either_1.left(this.value);
    };
    Suspend.prototype.foldFree = function (f) {
        return f(this.value).chain(function (free) { return free.foldFree(f); });
    };
    Suspend.prototype.run = function (f) {
        var r = this.resume();
        while (r instanceof either_1.Left)
            r = (f(r.takeLeft())).resume();
        return r.takeRight();
    };
    /**
     * eq implementation.
     */
    Suspend.prototype.eq = function (f) {
        var result = false;
        this.resume().takeLeft().map(function (func) { return result = func.eq(f); });
        return result;
    };
    return Suspend;
}(Free));
exports.Suspend = Suspend;
/**
 * Return constructor.
 * @private
 */
var Return = /** @class */ (function (_super) {
    __extends(Return, _super);
    function Return(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Return.prototype.chain = function (f) {
        return f(this.value);
    };
    Return.prototype.ap = function (f) {
        var _this = this;
        return f.map(function (g) { return g(_this.value); });
    };
    Return.prototype.resume = function () {
        return either_1.right(this.value);
    };
    Return.prototype.foldFree = function (f) {
        return f(new indentity_1.Identity(this.value));
    };
    Return.prototype.run = function (_) {
        return this.value;
    };
    Return.prototype.eq = function (f) {
        return (f instanceof Return) ?
            (this.value === f.value) :
            f.eq(this);
    };
    return Return;
}(Free));
exports.Return = Return;
/**
 * liftF a Functor into a Free.
 */
exports.liftF = function (f) {
    return new Suspend(f.map(function (a) { return new Return(a); }));
};
//# sourceMappingURL=free.js.map