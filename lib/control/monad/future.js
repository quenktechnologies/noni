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
exports.doFuture = exports.liftP = exports.fromExcept = exports.toPromise = exports.race = exports.reduce = exports.sequential = exports.parallel = exports.batch = exports.fromCallback = exports.fromAbortable = exports.wait = exports.delay = exports.attempt = exports.raise = exports.run = exports.wrap = exports.voidPure = exports.pure = exports.Run = exports.Raise = exports.Trap = exports.Finally = exports.Catch = exports.Call = exports.Bind = exports.Pure = exports.Future = void 0;
var function_1 = require("../../data/function");
var timer_1 = require("../timer");
var error_1 = require("../error");
var _1 = require("./");
var array_1 = require("../../data/array");
/**
 * Future represents an asynchronous task or sequence of asynchronous tasks that
 * have not yet happened.
 *
 * Use the fork() or then() methods to trigger computation or via the await
 * keyword.
 *
 * Note: Multiple chains of Futures should not be executed via await, instead
 * use the doFuture() function or chain them together manually to retain
 * control over execution.
 */
var Future = /** @class */ (function () {
    function Future() {
        /**
         * tag identifies each Future subclass.
         */
        this.tag = 'Future';
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
    Future.prototype.trap = function (f) {
        return new Catch(this, f);
    };
    Future.prototype.catch = function (f) {
        // XXX: any used here because catch() previously expected the resulting
        // Future to be of the same type. This is not the case with promises.
        return new Catch(this, function (e) {
            return (0, exports.run)(function (onError, onSuccess) {
                if (f) {
                    var result = f(e);
                    switch (Object.prototype.toString.call(result)) {
                        case '[object Future]':
                            var asFuture = result;
                            asFuture.fork(function (e) { return onError(e); }, function (v) { return onSuccess(v); });
                            break;
                        case '[object Promise]':
                            var asPromise = result;
                            asPromise.then(function (v) { return onSuccess(v); }, function (e) { return onError(e); });
                            break;
                        default:
                            onSuccess(result);
                            break;
                    }
                }
                else {
                    //XXX: This should be an error but not much we can do with the
                    // type signature for a Promise. We do not want to throw at 
                    // runtime.
                    onSuccess(undefined);
                }
                return function_1.noop;
            });
        });
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
    Future.prototype._fork = function (value, stack, onError, onSuccess) {
        var _this = this;
        var pending = true;
        var failure = function (e) {
            if (pending) {
                stack.push(new Raise(e));
                pending = false;
                _this._fork(value, stack, onError, onSuccess);
            }
            else {
                console.warn(_this.tag + ": onError called after task completed");
                console.warn(e);
            }
        };
        var success = function (val) {
            if (pending) {
                pending = false;
                if ((0, array_1.empty)(stack))
                    onSuccess(val);
                else
                    _this._fork(val, stack, onError, onSuccess);
            }
            else {
                console.warn(_this.tag + ": onSuccess called after task completed");
                console.trace();
            }
        };
        var _loop_1 = function () {
            var next = stack.pop();
            if (next.tag === 'Pure') {
                (0, timer_1.tick)(function () { return success(next.value); });
                return { value: function_1.noop };
            }
            else if (next.tag === 'Bind') {
                var future = next;
                stack.push(new Call(future.func));
                stack.push(future.target);
            }
            else if (next.tag === 'Call') {
                var future = next;
                stack.push(future.target(value));
            }
            else if (next.tag === 'Catch') {
                var future = next;
                stack.push(new Trap(future.func));
                stack.push(future.target);
            }
            else if (next.tag === 'Finally') {
                var future = next;
                stack.push(new Trap(future.func));
                stack.push(new Call(future.func));
                stack.push(future.target);
            }
            else if (next.tag === 'Trap') {
                // Avoid hanging when catch().catch().catch() etc. is done.
                if ((0, array_1.empty)(stack))
                    onSuccess(value);
            }
            else if (next.tag === 'Raise') {
                var future = next;
                var err = (0, error_1.convert)(future.value);
                // Clear the stack until we encounter a Trap instance.
                while (!(0, array_1.empty)(stack) && (0, array_1.tail)(stack).tag !== 'Trap')
                    stack.pop();
                if ((0, array_1.empty)(stack)) {
                    // No handlers detected, finish with an error.
                    onError(err);
                    return { value: function_1.noop };
                }
                else {
                    stack.push(stack.pop().func(err));
                }
            }
            else if (next.tag === 'Run') {
                return { value: next.task(failure, success) };
            }
        };
        while (!(0, array_1.empty)(stack)) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return function_1.noop;
    };
    /**
     * fork this Future causing its side-effects to take place.
     */
    Future.prototype.fork = function (onError, onSuccess) {
        if (onError === void 0) { onError = function_1.noop; }
        if (onSuccess === void 0) { onSuccess = function_1.noop; }
        // XXX: There is no value until async computation begins.
        return this._fork(undefined, [this], onError, onSuccess);
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
        _this.tag = 'Pure';
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
 * Bind constructor.
 * @private
 */
var Bind = /** @class */ (function (_super) {
    __extends(Bind, _super);
    function Bind(target, func) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.func = func;
        _this.tag = 'Bind';
        return _this;
    }
    return Bind;
}(Future));
exports.Bind = Bind;
/**
 * Call constructor.
 * @private
 */
var Call = /** @class */ (function (_super) {
    __extends(Call, _super);
    function Call(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.tag = 'Call';
        return _this;
    }
    return Call;
}(Future));
exports.Call = Call;
/**
 * Catch constructor.
 * @private
 */
var Catch = /** @class */ (function (_super) {
    __extends(Catch, _super);
    function Catch(target, func) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.func = func;
        _this.tag = 'Catch';
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
    function Finally(target, func) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.func = func;
        _this.tag = 'Finally';
        return _this;
    }
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
        _this.tag = 'Trap';
        return _this;
    }
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
        _this.tag = 'Raise';
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
 * Run constructor.
 * @private
 */
var Run = /** @class */ (function (_super) {
    __extends(Run, _super);
    function Run(task) {
        var _this = _super.call(this) || this;
        _this.task = task;
        _this.tag = 'Run';
        return _this;
    }
    return Run;
}(Future));
exports.Run = Run;
/**
 * pure wraps a synchronous value in a Future.
 */
var pure = function (a) { return new Pure(a); };
exports.pure = pure;
/**
 * voidPure is a Future that provides the absence of a value for your
 * convenience.
 */
exports.voidPure = new Pure(undefined);
/**
 * wrap a value in a Future returning the value if the value is itself a Future.
 */
var wrap = function (a) {
    return a instanceof Future ? a : (0, exports.pure)(a);
};
exports.wrap = wrap;
/**
 * run sets up an async task to be executed at a later point.
 */
var run = function (task) { return new Run(task); };
exports.run = run;
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
    return (0, exports.run)(function (onError, onSuccess) {
        (0, timer_1.tick)(function () {
            try {
                onSuccess(f());
            }
            catch (e) {
                onError(e);
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
    return (0, exports.run)(function (onError, onSuccess) {
        setTimeout(function () {
            try {
                onSuccess(f());
            }
            catch (e) {
                onError(e);
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
    return (0, exports.run)(function (_, onSuccess) {
        setTimeout(function () { onSuccess(undefined); }, n);
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
var fromAbortable = function (abort) { return function (f) { return (0, exports.run)(function (onError, onSuccess) {
    f(function (err, a) {
        return (err != null) ? onError(err) : onSuccess(a);
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
var parallel = function (list) { return (0, exports.run)(function (onError, onSuccess) {
    var completed = [];
    var finished = false;
    var aborters = [];
    var indexCmp = function (a, b) { return a.index - b.index; };
    var abortAll = function () {
        finished = true;
        aborters.map(function (f) { return f(); });
    };
    var onErr = function (e) {
        if (!finished) {
            abortAll();
            onError(e);
        }
    };
    var reconcile = function () { return completed.sort(indexCmp).map(function (t) { return t.value; }); };
    var onSucc = function (t) {
        if (!finished) {
            completed.push(t);
            if (completed.length === list.length)
                onSuccess(reconcile());
        }
    };
    aborters.push.apply(aborters, list.map(function (f, i) {
        return f.map(function (value) { return new Tag(i, value); }).fork(onErr, onSucc);
    }));
    if ((0, array_1.empty)(aborters))
        onSuccess([]);
    return function () { return abortAll(); };
}); };
exports.parallel = parallel;
/**
 * sequential execution of a list of futures.
 *
 * This function succeeds with a list of all results or fails on the first
 * error.
 */
var sequential = function (list) {
    return (0, exports.run)(function (onError, onSuccess) {
        var i = 0;
        var r = [];
        var onErr = function (e) { return onError(e); };
        var success = function (a) { r.push(a); next(); };
        var abort;
        var next = function () {
            if (i < list.length)
                abort = list[i].fork(onErr, success);
            else
                onSuccess(r);
            i++;
        };
        next();
        return function () { if (abort)
            abort(); };
    });
};
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
var race = function (list) {
    return (0, exports.run)(function (onError, onSuccess) {
        var aborters = [];
        var finished = false;
        var abortAll = function () {
            finished = true;
            aborters.map(function (f) { return f(); });
        };
        var onErr = function (e) {
            if (!finished) {
                finished = true;
                abortAll();
                onError(e);
            }
        };
        var onSucc = function (t) {
            if (!finished) {
                finished = true;
                aborters.map(function (f, i) { return (i !== t.index) ? f() : undefined; });
                onSuccess(t.value);
            }
        };
        aborters.push.apply(aborters, list.map(function (f, i) {
            return f.map(function (value) { return new Tag(i, value); }).fork(onErr, onSucc);
        }));
        if (aborters.length === 0)
            onError(new Error("race(): Cannot race an empty list!"));
        return function () { return abortAll(); };
    });
};
exports.race = race;
/**
 * toPromise transforms a Future into a Promise.
 *
 * This function depends on the global promise constructor and
 * will fail if the environment does not provide one.
 *
 * @deprecated
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
var liftP = function (f) {
    return (0, exports.run)(function (onError, onSuccess) {
        f()
            .then(function (a) { return onSuccess(a); })
            .catch(function (e) { return onError(e); });
        return function_1.noop;
    });
};
exports.liftP = liftP;
/**
 * doFuture provides a do notation function specialized to Futures.
 *
 * Use this function to avoid explicit type assertions with control/monad#doN.
 */
var doFuture = function (f) { return (0, _1.doN)(f); };
exports.doFuture = doFuture;
//# sourceMappingURL=future.js.map