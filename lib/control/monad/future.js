"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doFuture = exports.liftP = exports.fromExcept = exports.toPromise = exports.some = exports.race = exports.reduce = exports.sequential = exports.parallel = exports.batch = exports.fromCallback = exports.fromAbortable = exports.wait = exports.delay = exports.attempt = exports.raise = exports.run = exports.wrap = exports.voidPure = exports.pure = exports.Run = exports.Raise = exports.Trap = exports.Finally = exports.Catch = exports.Call = exports.Bind = exports.Pure = exports.Future = void 0;
const function_1 = require("../../data/function");
const timer_1 = require("../timer");
const error_1 = require("../error");
const _1 = require("./");
const array_1 = require("../../data/array");
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
class Future {
    constructor() {
        /**
         * tag identifies each Future subclass.
         */
        this.tag = 'Future';
    }
    get [Symbol.toStringTag]() {
        return 'Future';
    }
    of(a) {
        return new Pure(a);
    }
    map(f) {
        return new Bind(this, (value) => new Pure(f(value)));
    }
    ap(ft) {
        return new Bind(this, (value) => ft.map(f => f(value)));
    }
    chain(f) {
        return new Bind(this, f);
    }
    trap(f) {
        return new Catch(this, f);
    }
    catch(f) {
        // XXX: any used here because catch() previously expected the resulting
        // Future to be of the same type. This is not the case with promises.
        return new Catch(this, (e) => (0, exports.run)((onError, onSuccess) => {
            if (f) {
                let result = f(e);
                switch (Object.prototype.toString.call(result)) {
                    case '[object Future]':
                        let asFuture = result;
                        asFuture.fork(e => onError(e), v => onSuccess(v));
                        break;
                    case '[object Promise]':
                        let asPromise = result;
                        asPromise.then(v => onSuccess(v), e => onError(e));
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
        }));
    }
    finally(f) {
        return new Finally(this, f);
    }
    then(onResolve, onReject) {
        return new Promise((resolve, reject) => {
            this.fork(reject, resolve);
        }).then(onResolve, onReject);
    }
    _fork(value, stack, onError, onSuccess) {
        let pending = true;
        let failure = (e) => {
            if (pending) {
                stack.push(new Raise(e));
                pending = false;
                this._fork(value, stack, onError, onSuccess);
            }
            else {
                console.warn(`${this.tag}: onError called after task completed`);
                console.warn(e);
            }
        };
        let success = (val) => {
            if (pending) {
                pending = false;
                if ((0, array_1.empty)(stack))
                    onSuccess(val);
                else
                    this._fork(val, stack, onError, onSuccess);
            }
            else {
                console.warn(`${this.tag}: onSuccess called after task completed`);
                console.trace();
            }
        };
        while (!(0, array_1.empty)(stack)) {
            let next = stack.pop();
            if (next.tag === 'Pure') {
                (0, timer_1.tick)(() => success(next.value));
                return function_1.noop;
            }
            else if (next.tag === 'Bind') {
                let future = next;
                stack.push(new Call(future.func));
                stack.push(future.target);
            }
            else if (next.tag === 'Call') {
                let future = next;
                stack.push(future.target(value));
            }
            else if (next.tag === 'Catch') {
                let future = next;
                stack.push(new Trap(future.func));
                stack.push(future.target);
            }
            else if (next.tag === 'Finally') {
                let future = next;
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
                let future = next;
                let err = (0, error_1.convert)(future.value);
                // Clear the stack until we encounter a Trap instance.
                while (!(0, array_1.empty)(stack) && (0, array_1.tail)(stack).tag !== 'Trap')
                    stack.pop();
                if ((0, array_1.empty)(stack)) {
                    // No handlers detected, finish with an error.
                    onError(err);
                    return function_1.noop;
                }
                else {
                    stack.push(stack.pop().func(err));
                }
            }
            else if (next.tag === 'Run') {
                return next.task(failure, success);
            }
        }
        return function_1.noop;
    }
    /**
     * fork this Future causing its side-effects to take place.
     */
    fork(onError = function_1.noop, onSuccess = function_1.noop) {
        // XXX: There is no value until async computation begins.
        return this._fork(undefined, [this], onError, onSuccess);
    }
}
exports.Future = Future;
/**
 * Pure constructor.
 */
class Pure extends Future {
    constructor(value) {
        super();
        this.value = value;
        this.tag = 'Pure';
    }
    map(f) {
        return new Pure(f(this.value));
    }
    ap(ft) {
        return ft.map(f => f(this.value));
    }
}
exports.Pure = Pure;
/**
 * Bind constructor.
 * @private
 */
class Bind extends Future {
    constructor(target, func) {
        super();
        this.target = target;
        this.func = func;
        this.tag = 'Bind';
    }
}
exports.Bind = Bind;
/**
 * Call constructor.
 * @private
 */
class Call extends Future {
    constructor(target) {
        super();
        this.target = target;
        this.tag = 'Call';
    }
}
exports.Call = Call;
/**
 * Catch constructor.
 * @private
 */
class Catch extends Future {
    constructor(target, func) {
        super();
        this.target = target;
        this.func = func;
        this.tag = 'Catch';
    }
}
exports.Catch = Catch;
/**
 * Finally constructor.
 * @private
 */
class Finally extends Future {
    constructor(target, func) {
        super();
        this.target = target;
        this.func = func;
        this.tag = 'Finally';
    }
}
exports.Finally = Finally;
/**
 * Trap constructor.
 * @private
 */
class Trap extends Future {
    constructor(func) {
        super();
        this.func = func;
        this.tag = 'Trap';
    }
}
exports.Trap = Trap;
/**
 * Raise constructor.
 */
class Raise extends Future {
    constructor(value) {
        super();
        this.value = value;
        this.tag = 'Raise';
    }
    map(_) {
        return new Raise(this.value);
    }
    ap(_) {
        return new Raise(this.value);
    }
    chain(_) {
        return new Raise(this.value);
    }
}
exports.Raise = Raise;
/**
 * Run constructor.
 * @private
 */
class Run extends Future {
    constructor(task) {
        super();
        this.task = task;
        this.tag = 'Run';
    }
}
exports.Run = Run;
/**
 * pure wraps a synchronous value in a Future.
 */
const pure = (a) => new Pure(a);
exports.pure = pure;
/**
 * voidPure is a Future that provides the absence of a value for your
 * convenience.
 */
exports.voidPure = new Pure(undefined);
/**
 * wrap a value in a Future returning the value if the value is itself a Future.
 */
const wrap = (a) => (String(a) === '[object Future]') ? a : (0, exports.pure)(a);
exports.wrap = wrap;
/**
 * run sets up an async task to be executed at a later point.
 */
const run = (task) => new Run(task);
exports.run = run;
/**
 * raise wraps an Error in a Future.
 *
 * This future will be considered a failure.
 */
const raise = (e) => new Raise(e);
exports.raise = raise;
/**
 * attempt a synchronous task, trapping any thrown errors in the Future.
 */
const attempt = (f) => (0, exports.run)((onError, onSuccess) => {
    (0, timer_1.tick)(() => {
        try {
            onSuccess(f());
        }
        catch (e) {
            onError(e);
        }
    });
    return function_1.noop;
});
exports.attempt = attempt;
/**
 * delay execution of a function f after n milliseconds have passed.
 *
 * Any errors thrown are caught and processed in the Future chain.
 */
const delay = (f, n = 0) => (0, exports.run)((onError, onSuccess) => {
    setTimeout(() => {
        try {
            onSuccess(f());
        }
        catch (e) {
            onError(e);
        }
    }, n);
    return function_1.noop;
});
exports.delay = delay;
/**
 * wait n milliseconds before continuing the Future chain.
 */
const wait = (n) => (0, exports.run)((_, onSuccess) => {
    setTimeout(() => { onSuccess(undefined); }, n);
    return function_1.noop;
});
exports.wait = wait;
/**
 * fromAbortable takes an Aborter and a node style async function and
 * produces a Future.
 *
 * Note: The function used here is not called in the "next tick".
 */
const fromAbortable = (abort) => (f) => (0, exports.run)((onError, onSuccess) => {
    f((err, a) => (err != null) ? onError(err) : onSuccess(a));
    return abort;
});
exports.fromAbortable = fromAbortable;
/**
 * fromCallback produces a Future from a node style async function.
 *
 * Note: The function used here is not called in the "next tick".
 */
const fromCallback = (f) => (0, exports.fromAbortable)(function_1.noop)(f);
exports.fromCallback = fromCallback;
class Tag {
    constructor(index, value) {
        this.index = index;
        this.value = value;
    }
}
/**
 * batch runs a list of batched Futures one batch at a time.
 */
const batch = (list) => (0, exports.sequential)(list.map(w => (0, exports.parallel)(w)));
exports.batch = batch;
/**
 * parallel runs a list of Futures in parallel failing if any
 * fail and succeeding with a list of successful values.
 */
const parallel = (list) => (0, exports.run)((onError, onSuccess) => {
    let completed = [];
    let finished = false;
    let aborters = [];
    let indexCmp = (a, b) => a.index - b.index;
    let abortAll = () => {
        finished = true;
        aborters.map(f => f());
    };
    let onErr = (e) => {
        if (!finished) {
            abortAll();
            onError(e);
        }
    };
    let reconcile = () => completed.sort(indexCmp).map(t => t.value);
    let onSucc = (t) => {
        if (!finished) {
            completed.push(t);
            if (completed.length === list.length)
                onSuccess(reconcile());
        }
    };
    aborters.push.apply(aborters, list.map((f, i) => f.map((value) => new Tag(i, value)).fork(onErr, onSucc)));
    if ((0, array_1.empty)(aborters))
        onSuccess([]);
    return () => abortAll();
});
exports.parallel = parallel;
/**
 * sequential execution of a list of futures.
 *
 * This function succeeds with a list of all results or fails on the first
 * error.
 */
const sequential = (list) => (0, exports.run)((onError, onSuccess) => {
    let i = 0;
    let r = [];
    let onErr = (e) => onError(e);
    let success = (a) => { r.push(a); next(); };
    let abort;
    let next = () => {
        if (i < list.length)
            abort = list[i].fork(onErr, success);
        else
            onSuccess(r);
        i++;
    };
    next();
    return () => { if (abort)
        abort(); };
});
exports.sequential = sequential;
/**
 * reduce a list of values into a single value using a reducer function that
 * produces a Future.
 */
const reduce = (list, initValue, f) => (0, exports.doFuture)(function* () {
    let accumValue = initValue;
    for (let i = 0; i < list.length; i++)
        accumValue = yield f(accumValue, list[i], i);
    return (0, exports.pure)(accumValue);
});
exports.reduce = reduce;
/**
 * race given a list of Futures, will return a Future that is settled by
 * the first error or success to occur.
 */
const race = (list) => (0, exports.run)((onError, onSuccess) => {
    let aborters = [];
    let finished = false;
    let abortAll = () => {
        finished = true;
        aborters.map(f => f());
    };
    let onErr = (e) => {
        if (!finished) {
            finished = true;
            abortAll();
            onError(e);
        }
    };
    let onSucc = (t) => {
        if (!finished) {
            finished = true;
            aborters.map((f, i) => (i !== t.index) ? f() : undefined);
            onSuccess(t.value);
        }
    };
    aborters.push.apply(aborters, list.map((f, i) => f.map((value) => new Tag(i, value)).fork(onErr, onSucc)));
    if (aborters.length === 0)
        onError(new Error(`race(): Cannot race an empty list!`));
    return () => abortAll();
});
exports.race = race;
/**
 * some executes a list of Futures sequentially until one resolves with a
 * successful value.
 *
 * If none resolve successfully, the final error is raised.
 */
const some = (list) => (0, exports.doFuture)(function* () {
    let result = undefined;
    for (let [index, future] of list.entries()) {
        let keepGoing = false;
        result = yield (future.catch(e => {
            if (index === (list.length - 1)) {
                return (0, exports.raise)(e);
            }
            else {
                keepGoing = true;
                return exports.voidPure;
            }
        }));
        if (!keepGoing)
            break;
    }
    return (0, exports.pure)(result);
});
exports.some = some;
/**
 * toPromise transforms a Future into a Promise.
 *
 * This function depends on the global promise constructor and
 * will fail if the environment does not provide one.
 *
 * @deprecated
 */
const toPromise = (ft) => new Promise((yes, no) => ft.fork(no, yes));
exports.toPromise = toPromise;
/**
 * fromExcept converts an Except to a Future.
 */
const fromExcept = (e) => e.fold(e => (0, exports.raise)(e), a => (0, exports.pure)(a));
exports.fromExcept = fromExcept;
/**
 * liftP turns a function that produces a Promise into a Future.
 */
const liftP = (f) => (0, exports.run)((onError, onSuccess) => {
    f()
        .then(a => onSuccess(a))
        .catch(e => onError(e));
    return function_1.noop;
});
exports.liftP = liftP;
/**
 * doFuture provides a do notation function specialized to Futures.
 *
 * Use this function to avoid explicit type assertions with control/monad#doN.
 */
const doFuture = (f) => (0, _1.doN)(f);
exports.doFuture = doFuture;
//# sourceMappingURL=future.js.map