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
var array_1 = require("../../data/array");
/**
 * Step in the reduction of a [[Free]] chain to a single value.
 */
var Step = /** @class */ (function () {
    function Step(value, next) {
        this.value = value;
        this.next = next;
    }
    return Step;
}());
exports.Step = Step;
/**
 * Free monad implementation.
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
/**
 * flatten a Free chain into a single level array.
 */
exports.flatten = function (fr) { return function (f) {
    var r = fr.resume();
    var l = [];
    while (r instanceof either_1.Left) {
        l.push(r.takeLeft());
        r = f(array_1.tail(l)).resume();
    }
    return l;
}; };
/**
 * reduce a Free into a single value.
 *
 * This function exists primarly as an alternative to recursively
 * calling a function on each step in the Free's chain.
 *
 * Instead, using a while loop we unwrap each layer of the Free
 * and apply the function f which yields a Step of computing
 * the final value.
 *
 * Note that the A in Free<F, A> is ignored completely as reflected in the type
 * Free<F,void>
 */
exports.reduce = function (fr) { return function (b) { return function (f) {
    var step = new Step(b, fr);
    var r = fr.resume();
    if (r instanceof either_1.Right) {
        return b;
    }
    else {
        while (r instanceof either_1.Left) {
            step = f(b, r.takeLeft());
            b = step.value;
            r = step.next.resume();
        }
        return b;
    }
}; }; };
//# sourceMappingURL=free.js.map