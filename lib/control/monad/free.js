"use strict";
/**
 * This is a basic, somewhat naive implementation of a Free monad devoid
 * of stack safety.
 *
 * As far as the library is concerned, a [[Free]] provides a [[Monad]]
 * that can be used for creating first-class DSL from [[Functor]]s
 * without parsing overhead.
 *
 * It is probably not very efficient to have a very large Free based DSL using
 * this implementation.
 *
 * A Free monad wraps up any [[Functor]] implementation which
 * has the effect of prompoting it to a monad. These Functors are your
 * DSL productions and can be sequenced together like regular monads using
 * `Free#chain`.
 *
 * Think of each as a line of instruction in an assembly type program.
 *
 * ## Limitations
 *
 * ### Performance
 *
 * As mentioned before this is a naive impementation, future versions may
 * introduce stack safety but for now, assume none exists.
 *
 * ### Type System
 * TypeScript does not have Higher Kinded Types (HKT) or as the author
 * understands; generic types that can themeselves have type parameters.
 *
 * Due to this fact, implementing a Free and related functions is probably
 * impossible without breaking typesafety via `any`. This is evident in the
 * use of `any` for the Functor type parameter.
 *
 * ## Example
 *
 * Start by describing your API via a sum type:
 *
 * ```typescript
 *
 * type API<N>
 *  = Put<N>
 *  | Get<N>
 *  | Remove<N>
 *  ;
 *
 * ```
 * The `N` type parameter is actually the next step in the chain.
 * It is a Functor wrapped in some [[Free]]. Since we don't have HKT we just
 * leave it generic otherwise we would lose vital information during chaining.
 *
 * Declare our API clases:
 *
 * ```typescript
 *
 *  class Put<N> {
 *
 *  constructor(public key: string, public value: string, public next: N) { }
 *
 *  map<B>(f: (a: N) => B): Put<B> {
 *
 *      return new Put(this.key, this.value, f(this.next));
 *
 *  }
 *
 * }
 *
 * class Get<N> {
 *
 *  constructor(public key: string, public next: (s: string) => N) { }
 *
 *  map<B>(f: (a: N) => B): Get<B> {
 *
 *      return new Get(this.key, (a: string) => f(this.next(a)));
 *
 *  }
 *
 * }
 *
 * class Remove<N> {
 *
 *  constructor(public key: string, public next: N) { }
 *
 *  map<B>(f: (a: N) => B): Remove<B> {
 *
 *      return new Remove(this.key, f(this.next));
 *
 *  }
 *
 * }
 *
 * ```
 *
 * In order to chain the API members together with Free, we need to "lift"
 * them into the Free monad thus prompting them. This is done  via the
 * [[liftF]] function:
 *
 * ```typescript
 * let m: Free<API<any>, undefined> = liftF(new Put('key', 'value', undefined));
 *
 * ```
 *
 * Note the use of `API<any>` here. `any` is used as the type parameter because
 * the typescript compiler will not keep track of our API Functors as we
 * nest them (no HKT).
 *
 * The second type parameter to Free is `undefined`. This is the final result
 * of our Free program. We use undefined because we have no "next" value as
 * yet and thus interpreting our variable `m` would result in the effect
 * of a Put followed by nothing.
 *
 * Generally we are not interested in the final value in the first place.
 *
 * Let us create some helper functions to make using our api easier:
 *
 * ```typescript
 * const put = (key: string, value: string) => liftF<API<any>, undefined>(new Put(key, value, _));
 *
 * const get = (key: string) => liftF<API<string>, undefined>(new Get(key, (s: string) => s));
 *
 * const remove = (key: string) => liftF<API<any>, undefined>(new Remove(key, _));
 *
 * ```
 *
 * We now have a set of functions for working with our DSL. Not that the
 * Get class uses a function to provide it's next value, this is how an
 * API command makes a value available to the next one in the chain.
 *
 * We can now use our API as follows:
 *
 * ```typescript
 *
 * let x: Free<API<any>, undefined> =
 *         put('num', '12')
 *         .chain(() => get('num'))
 *         .chain((n: string) => remove(n));
 *
 * ```
 *
 * The variable `x` is now a program represented in out Free DSL.
 *
 * `x` can now be interpreted making use of the `fold` or `run` method.
 *
 * ## Resources:
 * * [Running Free with the Monads](https://www.slideshare.net/kenbot/running-free-with-the-monads)
 * * [Free Monads for cheap interpreters](https://www.tweag.io/posts/2018-02-05-free-monads.html)
 * * [purescript-free](https://pursuit.purescript.org/packages/purescript-free/5.1.0)
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
var either_1 = require("../../data/either");
var array_1 = require("../../data/array");
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
        return new Pure(a);
    };
    /**
     * map implementation.
     */
    Free.prototype.map = function (f) {
        return this.chain(function (a) { return new Pure(f(a)); });
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
    Suspend.prototype.fold = function (f, g) {
        return g(this.value.map(function (free) { return free.fold(f, g); }));
    };
    Suspend.prototype.foldM = function (f, g) {
        return g(this.value).chain(function (free) { return free.foldM(f, g); });
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
 * Pure constructor.
 * @private
 */
var Pure = /** @class */ (function (_super) {
    __extends(Pure, _super);
    function Pure(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Pure.prototype.chain = function (f) {
        return f(this.value);
    };
    Pure.prototype.ap = function (f) {
        var _this = this;
        return f.map(function (g) { return g(_this.value); });
    };
    Pure.prototype.resume = function () {
        return either_1.right(this.value);
    };
    Pure.prototype.fold = function (f, _) {
        return f(this.value);
    };
    Pure.prototype.foldM = function (f, _) {
        return f(this.value);
    };
    Pure.prototype.run = function (_) {
        return this.value;
    };
    Pure.prototype.eq = function (f) {
        return (f instanceof Pure) ?
            (this.value === f.value) :
            f.eq(this);
    };
    return Pure;
}(Free));
exports.Pure = Pure;
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
 * liftF a Functor into a Free.
 */
exports.liftF = function (f) {
    return new Suspend(f.map(function (a) { return new Pure(a); }));
};
/**
 * pure wraps a value in a Pure
 */
exports.pure = function (a) { return new Pure(a); };
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