"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doFuture = exports.liftP = exports.fromExcept = exports.toPromise = exports.race = exports.reduce = exports.sequential = exports.parallel = exports.batch = exports.fromCallback = exports.fromAbortable = exports.wait = exports.delay = exports.attempt = exports.raise = exports.pure = exports.Compute = exports.Run = exports.Raise = exports.Trap = exports.Finally = exports.Catch = exports.Call = exports.Bind = exports.Pure = exports.Future = void 0;
var function_1 = require("../../data/function");
var timer_1 = require("../timer");
var error_1 = require("../error");
var _1 = require("./");
var Future = /** @class */ (function () {
    function Future() {
    }
    Object.defineProperty(Future.prototype, Symbol.toStringTag, {
        get: function () {
            return 'Future';
        },
        enumerable: false,
        configurable: true
    });
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
        // XXX: any used here because catch() previously expected the resulting
        // Future to be of the same type. This is not the case with promises.
        return new Catch(this, function (e) { return new Run(function (s) {
            if (f) {
                var result = f(e);
                switch (Object.prototype.toString.call(result)) {
                    case '[object Future]':
                        var asFuture = result;
                        asFuture.fork(function (e) { return s.onError(e); }, function (v) { return s.onSuccess(v); });
                        break;
                    case '[object Promise]':
                        var asPromise = result;
                        asPromise.then(function (v) { return s.onSuccess(v); }, function (e) { return s.onError(e); });
                        break;
                    default:
                        s.onSuccess(result);
                        break;
                }
            }
            else {
                //XXX: This should be an error but not much we can do with the
                // type signature for a Promise. We do not want to throw at 
                // runtime.
                s.onSuccess(undefined);
            }
            return function_1.noop;
        }); });
    };
    Future.prototype.finally = function (f) {
        return new Finally(this, f);
    };
    Future.prototype.then = function (onResolve, onReject) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.fork(reject, resolve);
        }).then(onResolve, onReject);
    };
    Future.prototype.fork = function (onError, onSuccess) {
        if (onError === void 0) { onError = function_1.noop; }
        if (onSuccess === void 0) { onSuccess = function_1.noop; }
        return (new Compute(undefined, onError, onSuccess, [this])).run();
    };
    /**
     * __trap
     * @private
     */
    Future.prototype.__trap = function (_, __) {
        return false;
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
    Pure.prototype.__exec = function (c) {
        c.value = this.value;
        (0, timer_1.tick)(function () { return c.run(); });
        return false;
    };
    return Pure;
}(Future));
exports.Pure = Pure;
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
    Bind.prototype.__exec = function (c) {
        //XXX: find a way to do this without any someday.
        c.stack.push(new Call(this.func));
        c.stack.push(this.future);
        return true;
    };
    return Bind;
}(Future));
exports.Bind = Bind;
/**
 * Call constructor.
 * @private
 */
var Call = /** @class */ (function (_super) {
    __extends(Call, _super);
    function Call(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Call.prototype.__exec = function (c) {
        c.stack.push(this.value(c.value));
        return true;
    };
    return Call;
}(Future));
exports.Call = Call;
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
    Catch.prototype.__exec = function (c) {
        c.stack.push(new Trap(this.func));
        c.stack.push(this.future);
        return true;
    };
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
    Finally.prototype.__exec = function (c) {
        c.stack.push(new Trap(this.func));
        c.stack.push(new Call(this.func));
        c.stack.push(this.future);
        return true;
    };
    return Finally;
}(Future));
exports.Finally = Finally;
/**
 * Trap constructor.
 * @private
 */
var Trap = /** @class */ (function (_super) {
    __extends(Trap, _super);
    function Trap(func) {
        var _this = _super.call(this) || this;
        _this.func = func;
        return _this;
    }
    Trap.prototype.__exec = function (_) {
        return true;
    };
    Trap.prototype.__trap = function (e, c) {
        c.stack.push(this.func(e));
        return true;
    };
    return Trap;
}(Future));
exports.Trap = Trap;
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
    Raise.prototype.__exec = function (c) {
        var finished = false;
        var e = (0, error_1.convert)(this.value);
        while (!finished) {
            if (c.stack.length === 0) {
                c.exitError(e);
                return false;
            }
            else {
                finished = c.stack.pop().__trap(e, c);
            }
        }
        return finished;
    };
    return Raise;
}(Future));
exports.Raise = Raise;
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
    Run.prototype.__exec = function (c) {
        c.running = true;
        c.canceller = this.value(c);
        return false;
    };
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
    function Compute(value, exitError, exitSuccess, stack) {
        this.value = value;
        this.exitError = exitError;
        this.exitSuccess = exitSuccess;
        this.stack = stack;
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
    Compute.prototype.run = function () {
        while (this.stack.length > 0) {
            var next = this.stack.pop();
            if ((next == null) || (typeof next.__exec !== 'function')) {
                try {
                    throw new Error("Invalid Compute stack member: \"" + next + "\"!");
                }
                catch (e) {
                    this.onError(e);
                    return this;
                }
            }
            if (!next.__exec(this))
                return this; // short-circuit
        }
        this.running = false;
        this.exitSuccess(this.value);
        return this;
    };
    return Compute;
}());
exports.Compute = Compute;
/**
 * pure wraps a synchronous value in a Future.
 */
var pure = function (a) { return new Pure(a); };
exports.pure = pure;
/**
 * raise wraps an Error in a Future.
 *
 * This future will be considered a failure.
 */
var raise = function (e) { return new Raise(e); };
exports.raise = raise;
/**
 * attempt a synchronous task, trapping any thrown errors in the Future.
 */
var attempt = function (f) {
    return new Run(function (s) {
        (0, timer_1.tick)(function () {
            try {
                s.onSuccess(f());
            }
            catch (e) {
                s.onError(e);
            }
        });
        return function_1.noop;
    });
};
exports.attempt = attempt;
/**
 * delay execution of a function f after n milliseconds have passed.
 *
 * Any errors thrown are caught and processed in the Future chain.
 */
var delay = function (f, n) {
    if (n === void 0) { n = 0; }
    return new Run(function (s) {
        setTimeout(function () {
            try {
                s.onSuccess(f());
            }
            catch (e) {
                s.onError(e);
            }
        }, n);
        return function_1.noop;
    });
};
exports.delay = delay;
/**
 * wait n milliseconds before continuing the Future chain.
 */
var wait = function (n) {
    return new Run(function (s) {
        setTimeout(function () { s.onSuccess(undefined); }, n);
        return function_1.noop;
    });
};
exports.wait = wait;
/**
 * fromAbortable takes an Aborter and a node style async function and
 * produces a Future.
 *
 * Note: The function used here is not called in the "next tick".
 */
var fromAbortable = function (abort) { return function (f) { return new Run(function (s) {
    f(function (err, a) {
        return (err != null) ? s.onError(err) : s.onSuccess(a);
    });
    return abort;
}); }; };
exports.fromAbortable = fromAbortable;
/**
 * fromCallback produces a Future from a node style async function.
 *
 * Note: The function used here is not called in the "next tick".
 */
var fromCallback = function (f) { return (0, exports.fromAbortable)(function_1.noop)(f); };
exports.fromCallback = fromCallback;
var Tag = /** @class */ (function () {
    function Tag(index, value) {
        this.index = index;
        this.value = value;
    }
    return Tag;
}());
/**
 * batch runs a list of batched Futures one batch at a time.
 */
var batch = function (list) {
    return (0, exports.sequential)(list.map(function (w) { return (0, exports.parallel)(w); }));
};
exports.batch = batch;
/**
 * parallel runs a list of Futures in parallel failing if any
 * fail and succeeding with a list of successful values.
 */
var parallel = function (list) { return new Run(function (s) {
    var done = [];
    var failed = false;
    var comps = [];
    var reconcile = function () { return done.sort(indexCmp).map(function (t) { return t.value; }); };
    var indexCmp = function (a, b) { return a.index - b.index; };
    var onErr = function (e) {
        abortAll();
        s.onError(e);
    };
    var onSucc = function (t) {
        if (!failed) {
            done.push(t);
            if (done.length === list.length)
                s.onSuccess(reconcile());
        }
    };
    var abortAll = function () {
        comps.map(function (c) { return c.abort(); });
        failed = true;
    };
    comps.push.apply(comps, list.map(function (f, i) {
        return f.map(function (value) { return new Tag(i, value); }).fork(onErr, onSucc);
    }));
    if (comps.length === 0)
        s.onSuccess([]);
    return function () { return abortAll(); };
}); };
exports.parallel = parallel;
/**
 * sequential execution of a list of futures.
 *
 * This function succeeds with a list of all results or fails on the first
 * error.
 */
var sequential = function (list) { return new Run(function (s) {
    var i = 0;
    var r = [];
    var onErr = function (e) { return s.onError(e); };
    var onSuccess = function (a) { r.push(a); next(); };
    var abort;
    var next = function () {
        if (i < list.length)
            abort = list[i].fork(onErr, onSuccess);
        else
            s.onSuccess(r);
        i++;
    };
    next();
    return function () { if (abort)
        abort.abort(); };
}); };
exports.sequential = sequential;
/**
 * reduce a list of values into a single value using a reducer function that
 * produces a Future.
 */
var reduce = function (list, initValue, f) { return (0, exports.doFuture)(function () {
    var accumValue, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accumValue = initValue;
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < list.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, f(accumValue, list[i], i)];
            case 2:
                accumValue = _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, (0, exports.pure)(accumValue)];
        }
    });
}); };
exports.reduce = reduce;
/**
 * race given a list of Futures, will return a Future that is settled by
 * the first error or success to occur.
 */
var race = function (list) { return new Run(function (s) {
    var comps = [];
    var finished = false;
    var abortAll = function () {
        finished = true;
        comps.map(function (c) { return c.abort(); });
    };
    var onErr = function (e) {
        abortAll();
        s.onError(e);
    };
    var onSucc = function (t) {
        if (!finished) {
            finished = true;
            comps.map(function (c, i) { return (i !== t.index) ? c.abort() : undefined; });
            s.onSuccess(t.value);
        }
    };
    comps.push.apply(comps, list.map(function (f, i) {
        return f.map(function (value) { return new Tag(i, value); }).fork(onErr, onSucc);
    }));
    if (comps.length === 0)
        s.onError(new Error("race(): Cannot race an empty list!"));
    return function () { return abortAll(); };
}); };
exports.race = race;
/**
 * toPromise transforms a Future into a Promise.
 *
 * This function depends on the global promise constructor and
 * will fail if the enviornment does not provide one.
 */
var toPromise = function (ft) {
    return new Promise(function (yes, no) { return ft.fork(no, yes); });
};
exports.toPromise = toPromise;
/**
 * fromExcept converts an Except to a Future.
 */
var fromExcept = function (e) {
    return e.fold(function (e) { return (0, exports.raise)(e); }, function (a) { return (0, exports.pure)(a); });
};
exports.fromExcept = fromExcept;
/**
 * liftP turns a function that produces a Promise into a Future.
 */
var liftP = function (f) { return new Run(function (s) {
    f()
        .then(function (a) { return s.onSuccess(a); })
        .catch(function (e) { return s.onError(e); });
    return function_1.noop;
}); };
exports.liftP = liftP;
/**
 * doFuture provides a do notation function specialized to Futures.
 *
 * Use this function to avoid explicit type assertions with control/monad#doN.
 */
var doFuture = function (f) { return (0, _1.doN)(f); };
exports.doFuture = doFuture;
//# sourceMappingURL=future.js.map