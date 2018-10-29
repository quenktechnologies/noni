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
var timer_1 = require("../timer");
var function_1 = require("../../data/function");
var Future = /** @class */ (function () {
    function Future() {
    }
    Future.prototype.of = function (a) {
        return new Pure(a);
    };
    Future.prototype.map = function (f) {
        return new Bind(this, function (value) { return new Pure(f(value)); });
    };
    Future.prototype.ap = function (ft) {
        return new Bind(this, function (value) { return ft.map(function (f) { return f(value); }); });
    };
    Future.prototype.chain = function (f) {
        return new Bind(this, f);
    };
    Future.prototype.catch = function (f) {
        return new Catch(this, f);
    };
    Future.prototype.finally = function (f) {
        return new Finally(this, f);
    };
    Future.prototype.fork = function (onError, onSuccess) {
        var c = new Compute(undefined, onError, onSuccess, [this], [], []);
        c.run();
        return c;
    };
    return Future;
}());
exports.Future = Future;
/**
 * Pure constructor.
 */
var Pure = /** @class */ (function (_super) {
    __extends(Pure, _super);
    function Pure(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Pure.prototype.map = function (f) {
        return new Pure(f(this.value));
    };
    Pure.prototype.ap = function (ft) {
        var _this = this;
        return ft.map(function (f) { return f(_this.value); });
    };
    return Pure;
}(Future));
exports.Pure = Pure;
/**
 * Raise constructor.
 */
var Raise = /** @class */ (function (_super) {
    __extends(Raise, _super);
    function Raise(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Raise.prototype.map = function (_) {
        return new Raise(this.value);
    };
    Raise.prototype.ap = function (_) {
        return new Raise(this.value);
    };
    Raise.prototype.chain = function (_) {
        return new Raise(this.value);
    };
    return Raise;
}(Future));
exports.Raise = Raise;
/**
 * Bind constructor.
 * @private
 */
var Bind = /** @class */ (function (_super) {
    __extends(Bind, _super);
    function Bind(future, func) {
        var _this = _super.call(this) || this;
        _this.future = future;
        _this.func = func;
        return _this;
    }
    return Bind;
}(Future));
exports.Bind = Bind;
/**
 * Step constructor.
 * @private
 */
var Step = /** @class */ (function (_super) {
    __extends(Step, _super);
    function Step(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    return Step;
}(Future));
exports.Step = Step;
/**
 * Catch constructor.
 * @private
 */
var Catch = /** @class */ (function (_super) {
    __extends(Catch, _super);
    function Catch(future, func) {
        var _this = _super.call(this) || this;
        _this.future = future;
        _this.func = func;
        return _this;
    }
    return Catch;
}(Future));
exports.Catch = Catch;
/**
 * Finally constructor.
 * @private
 */
var Finally = /** @class */ (function (_super) {
    __extends(Finally, _super);
    function Finally(future, func) {
        var _this = _super.call(this) || this;
        _this.future = future;
        _this.func = func;
        return _this;
    }
    return Finally;
}(Future));
exports.Finally = Finally;
/**
 * Run constructor.
 * @private
 */
var Run = /** @class */ (function (_super) {
    __extends(Run, _super);
    function Run(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    return Run;
}(Future));
exports.Run = Run;
/**
 * Compute represents the workload of a forked Future.
 *
 * Results are computed sequentially and ends with either a value,
 * error or prematurely via the abort method.
 */
var Compute = /** @class */ (function () {
    function Compute(value, exitError, exitSuccess, stack, handlers, finalizers) {
        this.value = value;
        this.exitError = exitError;
        this.exitSuccess = exitSuccess;
        this.stack = stack;
        this.handlers = handlers;
        this.finalizers = finalizers;
        this.canceller = function_1.noop;
        this.running = false;
    }
    /**
     * onError handler.
     *
     * This method will a 'Raise' instruction at the top of the stack
     * and continue execution.
     */
    Compute.prototype.onError = function (e) {
        if (this.running === false)
            return;
        this.stack.push(new Raise(e));
        this.running = false;
        this.run();
    };
    /**
     * onSuccess handler.
     *
     * Stores the resulting value and continues the execution.
     */
    Compute.prototype.onSuccess = function (value) {
        if (this.running === false)
            return;
        this.value = value;
        this.running = false;
        this.run();
    };
    /**
     * abort this Compute.
     *
     * Aborting a Compute will immediately clear its stack
     * and invoke the canceller for the currently executing Future.
     */
    Compute.prototype.abort = function () {
        this.stack = [];
        this.exitError = function_1.noop;
        this.exitSuccess = function_1.noop;
        this.running = false;
        this.canceller();
        this.canceller = function_1.noop;
    };
    /**
     * run this Compute.
     */
    Compute.prototype.run = function () {
        while (this.stack.length > 0) {
            var next = this.stack.pop();
            if (next instanceof Pure) {
                this.value = next.value;
            }
            else if (next instanceof Bind) {
                this.stack.push(new Step(next.func));
                this.stack.push(next.future);
            }
            else if (next instanceof Step) {
                this.stack.push(next.value(this.value));
            }
            else if (next instanceof Catch) {
                this.handlers.push(next.func);
                this.stack.push(next.future);
            }
            else if (next instanceof Finally) {
                this.finalizers.push(next.func);
                this.stack.push(new Step(next.func));
                this.stack.push(next.future);
            }
            else if (next instanceof Raise) {
                this.stack = []; //clear the stack;
                if (this.finalizers.length > 0)
                    this.stack.push(new Step(this.finalizers.pop()));
                if (this.handlers.length > 0)
                    this.stack.push(this.handlers.pop()(next.value));
                if (this.stack.length === 0)
                    return this.exitError(next.value); //end on unhandled error
            }
            else if (next instanceof Run) {
                this.running = true;
                this.canceller = next.value(this);
                return; //short-circuit and continue in a new call-stack
            }
        }
        this.running = false;
        this.exitSuccess(this.value);
    };
    return Compute;
}());
exports.Compute = Compute;
/**
 * pure wraps a synchronous value in a Future.
 */
exports.pure = function (a) { return new Pure(a); };
/**
 * raise wraps an Error in a Future.
 *
 * This future will be considered a failure.
 */
exports.raise = function (e) { return new Raise(e); };
/**
 * attempt a syncronous task, trapping any thrown errors in the Future.
 */
exports.attempt = function (f) { return new Run(function (s) {
    timer_1.tick(function () { try {
        s.onSuccess(f());
    }
    catch (e) {
        s.onError(e);
    } });
    return function_1.noop;
}); };
/**
 * fromAbortable takes an Aborter and a node style async function and
 * produces a Future.
 *
 * Note: The function used here is not called in the "next tick".
 */
exports.fromAbortable = function (abort) { return function (f) { return new Run(function (s) {
    f(function (err, a) { return (err != null) ? s.onError(err) : s.onSuccess(a); });
    return abort;
}); }; };
/**
 * fromCallback produces a Future from a node style async function.
 *
 * Note: The function used here is not called in the "next tick".
 */
exports.fromCallback = function (f) { return exports.fromAbortable(function_1.noop)(f); };
var Tag = /** @class */ (function () {
    function Tag(index, value) {
        this.index = index;
        this.value = value;
    }
    return Tag;
}());
/**
 * parallel runs a list of Futures in parallel failing if any
 * fail and succeeding with a list of successful values.
 */
exports.parallel = function (list) { return new Run(function (s) {
    var done = [];
    var comps = list.map(function (f, index) {
        return f
            .map(function (value) { return new Tag(index, value); })
            .fork(function (e) {
            abortAll(comps);
            s.onError(e);
        }, function (t) {
            done.push(t);
            if (done.length === comps.length)
                s.onSuccess(done.sort(function (a, b) { return a.index - b.index; })
                    .map(function (t) { return t.value; }));
        });
    });
    return function () { abortAll(comps); };
}); };
/**
 * race given a list of Futures, will return a Future that is settled by
 * the first error or success to occur.
 */
exports.race = function (list) { return new Run(function (s) {
    var comps = list
        .map(function (f, index) {
        return f
            .map(function (value) { return new Tag(index, value); })
            .fork(function (e) {
            abortAll(comps);
            s.onError(e);
        }, function (t) {
            abortExcept(comps, t.index);
            s.onSuccess(t.value);
        });
    });
    return function () { abortAll(comps); };
}); };
var abortAll = function (comps) { return comps.map(function (c) { return c.abort(); }); };
var abortExcept = function (comps, index) {
    return comps.map(function (c, i) { return (i !== index) ? c.abort() : undefined; });
};
//# sourceMappingURL=future.js.map