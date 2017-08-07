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
var util_1 = require("../util");
var Either_1 = require("./Either");
/**
 * Free is a Free monad that also implements a Free Applicative (almost).
 *
 * Inspired by https://cwmyers.github.io/monet.js/#free
 */
var Free = (function () {
    function Free() {
    }
    /**
     * of
     */
    Free.prototype.of = function (a) {
        return new Return(a);
    };
    /**
     * map
     */
    Free.prototype.map = function (f) {
        return this.chain(function (a) { return exports.free(f(a)); });
    };
    /**
     * chain
     */
    Free.prototype.chain = function (g) {
        if (this instanceof Suspend) {
            var f_1 = this.f;
            return (typeof f_1 === 'function') ?
                new Suspend(function (x) { return f_1(x).chain(g); }) :
                new Suspend(f_1.map(function (free) { return free.chain(g); }));
        }
        else if (this instanceof Return) {
            g(this.a);
        }
    };
    /**
     * resume the next stage of the computation
     */
    Free.prototype.resume = function () {
        if (this instanceof Suspend) {
            return Either_1.left(this.f);
        }
        else if (this instanceof Return) {
            return Either_1.right(this.a);
        }
    };
    /**
     * hoist
    hoist<B>(func: (fb: Functor<B>) => Functor<B>): Free<F, A> {

        if (this instanceof Suspend) {

            return new Suspend((func(this.f))
                .map((fr: Free<F, B>) => fr.hoist<any>(func)))
        } else {

            return this;

        }

    }
    */
    /**
     * cata
     */
    Free.prototype.cata = function (f, g) {
        return this.resume().cata(f, g);
    };
    /**
     * go runs the computation to completion using f to extract each stage.
     * @summmary go :: Free<F<*>, A> →  (F<Free<F,A>> →  Free<F,A>) →  A
     */
    Free.prototype.go = function (f) {
        if (this instanceof Suspend) {
            var r = this.resume();
            while (r instanceof Either_1.Left)
                r = (f(r.takeLeft())).resume();
            return r.takeRight();
        }
        else if (this instanceof Return) {
            return this.a;
        }
    };
    /**
     * run the Free chain to completion
     * @summary run :: Free<A→ A,A> →  A
     */
    Free.prototype.run = function () {
        return this.go(function (next) { return next(); });
    };
    return Free;
}());
exports.Free = Free;
var Suspend = (function (_super) {
    __extends(Suspend, _super);
    function Suspend(f) {
        var _this = _super.call(this) || this;
        _this.f = f;
        return _this;
    }
    return Suspend;
}(Free));
exports.Suspend = Suspend;
var Return = (function (_super) {
    __extends(Return, _super);
    function Return(a) {
        var _this = _super.call(this) || this;
        _this.a = a;
        return _this;
    }
    return Return;
}(Free));
exports.Return = Return;
/**
 * free wraps a value in a free
 */
exports.free = function (a) { return new Return(a); };
/**
 * suspend lifts a function into a Free monad to mimic tail call recursion.
 */
exports.suspend = function (f) { return new Suspend(util_1.compose(exports.free, f)); };
/**
 * liftF lifts a Functor into a Free.
 */
exports.liftF = function (f) { return new Suspend(f.map(exports.free)); };
//# sourceMappingURL=Free.js.map