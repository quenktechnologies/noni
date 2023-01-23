"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doFuture = exports.liftP = exports.fromExcept = exports.toPromise = exports.some = exports.race = exports.reduce = exports.sequential = exports.parallel = exports.batch = exports.fromCallback = exports.fromAbortable = exports.wait = exports.delay = exports.attempt = exports.raise = exports.run = exports.wrap = exports.voidPure = exports.pure = exports.Generation = exports.Run = exports.Raise = exports.Trap = exports.Finally = exports.Catch = exports.Call = exports.Bind = exports.Pure = exports.Compute = exports.Future = void 0;
const function_1 = require("../../data/function");
const timer_1 = require("../timer");
const error_1 = require("../error");
const array_1 = require("../../data/array");
const stack_1 = require("../../data/stack");
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
    finialize(f) {
        return new Finally(this, f);
    }
    finally(f) {
        return this.finialize(() => {
            f();
            return this;
        });
    }
    then(onResolve, onReject) {
        return new Promise((resolve, reject) => {
            this.fork(reject, resolve);
        }).then(onResolve, onReject);
    }
    /**
     * fork this Future causing its side-effects to take place.
     */
    fork(onError = console.error, onSuccess = function_1.noop) {
        let comp = new Compute(new stack_1.UnsafeStack([this]));
        comp.run(onError, onSuccess);
        return () => comp.abort();
    }
}
exports.Future = Future;
const trapTags = ['Trap', 'Generation'];
/**
 * @internal
 */
class Compute {
    constructor(stack = new stack_1.UnsafeStack()) {
        this.stack = stack;
    }
    abort() { }
    run(onError, onSuccess) {
        return __awaiter(this, void 0, void 0, function* () {
            let { stack } = this;
            let value = undefined;
            while (!stack.isEmpty()) {
                let next = stack.pop();
                switch (next.tag) {
                    case 'Pure': {
                        value = yield (next.value);
                        break;
                    }
                    case 'Bind': {
                        let future = next;
                        stack.push(new Call(future.func));
                        stack.push(future.target);
                        break;
                    }
                    case 'Call': {
                        let future = next;
                        stack.push(future.target(value));
                        break;
                    }
                    case 'Catch': {
                        let future = next;
                        stack.push(new Trap(future.func));
                        stack.push(future.target);
                        break;
                    }
                    case 'Finally': {
                        let future = next;
                        stack.push(new Trap(future.func));
                        stack.push(new Call(future.func));
                        stack.push(future.target);
                        break;
                    }
                    case 'Raise': {
                        let future = next;
                        let err = (0, error_1.convert)(future.value);
                        // Clear the stack until we encounter a Trap or Generation.
                        while (!stack.isEmpty() &&
                            !(0, array_1.contains)(trapTags, stack.peek().tag))
                            stack.pop();
                        // If no handlers detected, we should proceed no further and
                        // finish up with an error.
                        if (stack.isEmpty())
                            return onError(err);
                        let top = stack.peek();
                        if (top.tag === 'Generation') {
                            // Hook into the engine's generator error 
                            // handling machinery. We need to capture any errors
                            // thrown out to give prior traps a chance to handle 
                            // them.
                            try {
                                let { done, value: future } = top.src.throw(err);
                                // Pop the Generation if the generator finished. 
                                if (done)
                                    stack.pop();
                                stack.push(future);
                            }
                            catch (e) {
                                // The generator did not handle the error or threw
                                // one of its own. Get rid of it and escalate.
                                stack.pop();
                                stack.push(e === err ? next : new Raise(e));
                            }
                        }
                        else if (top.tag === 'Trap') {
                            stack.push(top.func(err));
                        }
                        break;
                    }
                    case 'Trap':
                        break;
                    case 'Run': {
                        value = yield new Promise((resolve) => {
                            next.task((e) => {
                                stack.push(new Raise(e));
                                resolve(undefined);
                            }, resolve);
                        });
                        break;
                    }
                    case 'Generation': {
                        let { done, value: future } = next.src.next(value);
                        if (future != null) {
                            // Put the Generation back on the stack if it still has
                            // items.
                            if (!done)
                                stack.push(next);
                            stack.push(future);
                        }
                        break;
                    }
                    default:
                        let tag = next ? next.constructor.name : next;
                        return onError(new Error(`Unknown Future: ${tag}`));
                }
            }
            return onSuccess(value);
        });
    }
}
exports.Compute = Compute;
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
 * Generation constructor.
 *
 * @internal
 */
class Generation extends Future {
    constructor(src) {
        super();
        this.src = src;
        this.tag = 'Generation';
    }
}
exports.Generation = Generation;
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
    for (let i = 0; i < list.length; i++) {
        try {
            let result = yield list[i];
            return (0, exports.pure)(result);
        }
        catch (e) {
            if (i === (list.length - 1))
                return (0, exports.raise)(e);
        }
    }
    return (0, exports.raise)(new Error('some: empty list'));
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
 * doFuture allows for multiple Futures to be chained together in an almost
 * monadic fashion via a generator function.
 *
 * Each Future yielded from the generator is executed sequentially with results
 * made available via the Generator#next() method. Raise values trigger an
 * internal error handling mechanism and can be caught via try/catch clauses
 * in the generator.
 *
 * Note: due to the lazy nature of how Futures are evaluated, try/catch will not
 * intercept a Raise used with a return statement. At that point the generator
 * is already complete and that Raise must be handled by the calling code if
 * desired. Alternatively, you can yield the final Future instead of returning
 * it. That way it can be intercepted by the try/catch.
 */
const doFuture = (f) => new Generation(f());
exports.doFuture = doFuture;
//# sourceMappingURL=future.js.map