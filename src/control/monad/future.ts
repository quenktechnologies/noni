/**
 * A Future is a primitive for managing asynchronous side-effects in an 
 * organized manner.
 *
 * It works by queuing up the async tasks in a monad like chain, only executing
 * them when the instruction to do so is given. This is in contrast to the
 * Promise which executes these side-effects as soon as it is created. A Future
 * is easier to reason about than a Promise and allows async code to be more 
 * composable. To allow Futures to benefit from the JS engine's built in Promise 
 * support however, Futures also implement the Promise api.
 */
import { Type } from '../../data/type';
import { noop } from '../../data/function';
import { Milliseconds } from '../time';
import { tick } from '../timer';
import { Err, Except, convert } from '../error';
import { contains, empty } from '../../data/array';
import { UnsafeStack } from '../../data/stack';
import { Monad } from './';

/**
 * Yield is a value that may be itself or may be wrapped in a [[Future]].
 *
 * This is type is used to represent return values of functions that may be
 * async or not for situations where it may be desirable to have the. Care 
 * should be used when handling these values as it is easy to forget to fork()
 * the Future resulting in incorrect values being passed around.
 *
 * Use the [[wrap]] before attempting to process a Yield to be on the safe side.
 */
export type Yield<T>
    = T
    | Future<T>
    ;

/**
 * OnError callback function type.
 */
export type OnError = (e: Error) => void;

/**
 * OnSuccess callback function type.
 */
export type OnSuccess<A> = (a: A) => void;

/**
 * Aborter callback function type.
 */
export type Aborter = () => void;

/**
 * ErrorHandler callback function type.
 *
 * These are used to trap and recover from errors.
 */
export type ErrorHandler<A> = (e: Error) => Future<A>;

/**
 * Finalizer callback function type.
 *
 * Finalizers can be used to clean up resources etc.
 */
export type Finalizer<A> = () => Future<A>;

/**
 * NodeFunction is a node platform async function.
 */
export type NodeFunction = <A>(f: (cb: Callback<A>) => void) => void

/**
 * Task is the type of functions that actually execute the async work.
 */
export type Task<A> = (onError: OnError, onSuccess: OnSuccess<A>) => Aborter;

/**
 * Callback in node platform style for asynchronous effects.
 */
export type Callback<A> = (e: Error | undefined | null, a?: A) => void;

/**
 * CallBackReceiver type takes a node style callback 
 * and performs some side-effect.
 */
export type CallbackReceiver<A> = (cb: Callback<A>) => void;

/**
 * Reducer function type.
 */
export type Reducer<A, B> = (p: B, c: A, i: number) => Future<B>;

/**
 * FutureFunc function type.
 */
export type FutureFunc<A, B> = (a: A) => Future<B>

/**
 * ResolveFunc for promises.
 */
export type ResolveFunc<A, TResult1 = A>
    = ((value: A) => TResult1 | PromiseLike<TResult1>) | undefined | null
    ;

/**
 * RejectFunc for promises. 
 */
export type RejectFunc<TResult2 = never>
    = ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ;

/**
 * CatchFunc
 */
export type CatchFunc<A>
    = (reason: any) => A | PromiseLike<A>
    ;

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
export abstract class Future<A> implements Monad<A>, Promise<A> {

    get [Symbol.toStringTag]() {

        return 'Future';

    }

    /**
     * tag identifies each Future subclass.
     */
    tag = 'Future';

    of(a: A): Future<A> {

        return new Pure<A>(a);

    }

    map<B>(f: (a: A) => B): Future<B> {

        return new Bind(this, (value: A) => new Pure(f(value)));

    }

    ap<B>(ft: Future<(a: A) => B>): Future<B> {

        return new Bind(this, (value: A) => ft.map(f => f(value)));

    }

    chain<B>(f: (a: A) => Future<B>): Future<B> {

        return new Bind(this, f);

    }

    trap<B>(f: (e: Error) => Future<B>): Future<B> {

        return new Catch(this, f);

    }

    catch<B = never>(f: CatchFunc<B> | undefined | null): Future<B> {

        // XXX: any used here because catch() previously expected the resulting
        // Future to be of the same type. This is not the case with promises.
        return new Catch(this, (e: Error) =>
            run((onError, onSuccess) => {

                if (f) {

                    let result = f(e);

                    switch (Object.prototype.toString.call(result)) {

                        case '[object Future]':
                            let asFuture = <Future<B>>result;
                            asFuture.fork(e => onError(e), v => onSuccess(v));
                            break;

                        case '[object Promise]':
                            let asPromise = <Promise<B>>result;
                            asPromise.then(v => onSuccess(v), e => onError(e));
                            break;

                        default:
                            onSuccess(<B>result);
                            break;

                    }

                } else {

                    //XXX: This should be an error but not much we can do with the
                    // type signature for a Promise. We do not want to throw at 
                    // runtime.
                    onSuccess(<any>undefined);

                }

                return noop;

            }));

    }

    finialize<B>(f: () => Future<B>): Future<B> {

        return new Finally(this, f);

    }

    finally(f: () => (void | undefined | null)): Future<A> {

        return this.finialize(() => {

            f();

            return this;

        })

    }

    then<TResult1 = A, TResult2 = never>(
        onResolve?: ResolveFunc<A, TResult1>,
        onReject?: RejectFunc<TResult2>
    ): Promise<TResult1 | TResult2> {

        return new Promise<A>((resolve, reject) => {

            this.fork(reject, resolve);

        }).then(onResolve, onReject);

    }

    /**
     * fork this Future causing its side-effects to take place.
     */
    fork(onError: OnError = console.error,
         onSuccess: OnSuccess<A> = noop): Aborter {

        let comp = new Compute(new UnsafeStack([this]));

        comp.run(onError, onSuccess);

        return () => comp.abort();

    }

}

const trapTags = ['Trap', 'Generation'];

/**
 * @internal
 */
export class Compute<A> {

    constructor(public stack = new UnsafeStack<Future<A>>()) { }

    abort() { }

    async run(onError: OnError, onSuccess: OnSuccess<A>) {

        let { stack } = this;

        let value: A = <Type>undefined;

        while (!stack.isEmpty()) {

            let next = <Future<A>>stack.pop();

            switch (next.tag) {

                case 'Pure': {
                    value = await ((<Pure<A>>next).value);
                    break;
                }

                case 'Bind': {
                    let future = <Bind<A, A>>next;
                    stack.push(new Call(future.func));
                    stack.push(future.target);
                    break;
                }

                case 'Call': {
                    let future = <Call<A>>next;
                    stack.push(future.target(value));
                    break;
                }

                case 'Catch': {
                    let future = <Catch<A, A>>next;
                    stack.push(new Trap(future.func));
                    stack.push(future.target);
                    break;
                }

                case 'Finally': {
                    let future = <Finally<A, A>>next;
                    stack.push(new Trap(future.func));
                    stack.push(new Call(future.func));
                    stack.push(future.target);
                    break;
                }

                case 'Raise': {

                    let future = <Raise<A>>next;
                    let err = convert(future.value);

                    // Clear the stack until we encounter a Trap or Generation.
                    while (
                        !stack.isEmpty() &&
                        !contains(trapTags, (<Future<A>>stack.peek()).tag))
                        stack.pop();

                    // If no handlers detected, we should proceed no further and
                    // finish up with an error.
                    if (stack.isEmpty())
                        return onError(err);

                    let top = (<Future<A>>stack.peek());

                    if (top.tag === 'Generation') {

                        // Hook into the engine's generator error 
                        // handling machinery. We need to capture any errors
                        // thrown out to give prior traps a chance to handle 
                        // them.
                        try {

                            let { done, value: future } =
                                (<Generation<A>>top).src.throw(err);

                            // Pop the Generation if the generator finished. 
                            if (done) stack.pop();

                            stack.push(future);

                        } catch (e) {

                            // The generator did not handle the error or threw
                            // one of its own. Get rid of it and escalate.
                            stack.pop();
                            stack.push(e === err ? next : new Raise(<Error>e));

                        }

                    } else if (top.tag === 'Trap') {

                        stack.push((<Trap<A>>top).func(err));

                    }

                    break;
                }

                case 'Trap':
                    break;

                case 'Run': {

                    value = await new Promise((resolve) => {

                        (<Run<A>>next).task((e: Error) => {

                            stack.push(new Raise(e));

                            resolve(<Type>undefined);

                        }, resolve);
                    });

                    break;
                }

                case 'Generation': {

                    let { done, value: future } =
                        (<Generation<A>>next).src.next(value);

                    if (future != null) {

                        // Put the Generation back on the stack if it still has
                        // items.
                        if (!done) stack.push(next);

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
    }

}

/**
 * Pure constructor.
 */
export class Pure<A> extends Future<A> {

    constructor(public value: A) { super(); }

    tag = 'Pure';

    map<B>(f: (a: A) => B): Future<B> {

        return new Pure(f(this.value));

    }

    ap<B>(ft: Future<(a: A) => B>): Future<B> {

        return ft.map(f => f(this.value));

    }

}

/**
 * Bind constructor.
 * @private
 */
export class Bind<A, B> extends Future<B> {

    constructor(
        public target: Future<A>,
        public func: (a: A) => Future<B>) { super(); }

    tag = 'Bind';

}

/**
 * Call constructor.
 * @private
 */
export class Call<A> extends Future<A> {

    constructor(public target: (a: A) => Future<A>) { super(); }

    tag = 'Call';

}

/**
 * Catch constructor.
 * @private
 */
export class Catch<A, B> extends Future<B> {

    constructor(
        public target: Future<A>,
        public func: (e: Error) => Future<B>) { super(); }

    tag = 'Catch';

}

/**
 * Finally constructor.
 * @private
 */
export class Finally<A, B> extends Future<B> {

    constructor(
        public target: Future<A>,
        public func: () => Future<B>) { super(); }

    tag = 'Finally';

}

/**
 * Trap constructor.
 * @private
 */
export class Trap<A> extends Future<A> {

    constructor(public func: (e: Error) => Future<A>) { super(); }

    tag = 'Trap';

}

/**
 * Raise constructor.
 */
export class Raise<A> extends Future<A> {

    constructor(public value: Err) { super(); }

    tag = 'Raise';

    map<B>(_: (a: A) => B): Future<B> {

        return <Future<B>>new Raise(this.value);

    }

    ap<B>(_: Future<(a: A) => B>): Future<B> {

        return <Future<B>>new Raise<B>(this.value);

    }

    chain<B>(_: (a: A) => Future<B>): Future<B> {

        return <Future<B>>new Raise(this.value);

    }

}

/**
 * Run constructor.
 * @private
 */
export class Run<A> extends Future<A> {

    constructor(public task: Task<A>) { super(); }

    tag = 'Run';

}

/**
 * Generation constructor.
 *
 * @internal
 */
export class Generation<A> extends Future<A> {

    constructor(public src: Generator<Future<Type>, Future<A>, Type>) {
        super();
    }

    tag = 'Generation';

}

/**
 * pure wraps a synchronous value in a Future.
 */
export const pure = <A>(a: A): Future<A> => new Pure(a);

/**
 * voidPure is a Future that provides the absence of a value for your 
 * convenience.
 */
export const voidPure: Future<void> = new Pure(undefined);

/**
 * wrap a value in a Future returning the value if the value is itself a Future.
 */
export const wrap = <A>(a: A | Future<A>): Future<A> =>
    (String(a) === '[object Future]') ? <Future<A>>a : <Future<A>>pure(a);

/**
 * run sets up an async task to be executed at a later point.
 */
export const run = <A>(task: Task<A>): Future<A> => new Run(task);

/**
 * raise wraps an Error in a Future.
 *
 * This future will be considered a failure.
 */
export const raise = <A>(e: Err): Future<A> => new Raise(e);

/**
 * attempt a synchronous task, trapping any thrown errors in the Future.
 */
export const attempt = <A>(f: () => A): Future<A> =>
    run((onError, onSuccess) => {

        tick(() => {
            try { onSuccess(f()); } catch (e) { onError(<Type>e); }
        });

        return noop;

    });

/**
 * delay execution of a function f after n milliseconds have passed.
 *
 * Any errors thrown are caught and processed in the Future chain.
 */
export const delay = <A>(f: () => A, n: Milliseconds = 0): Future<A> =>
    run((onError, onSuccess) => {

        setTimeout(() => {
            try { onSuccess(f()); } catch (e) { onError(<Type>e); }
        }, n);

        return noop;

    });

/**
 * wait n milliseconds before continuing the Future chain.
 */
export const wait = (n: Milliseconds): Future<void> =>
    run((_, onSuccess) => {

        setTimeout(() => { onSuccess(undefined); }, n);

        return noop;

    });

/**
 * fromAbortable takes an Aborter and a node style async function and 
 * produces a Future.
 *
 * Note: The function used here is not called in the "next tick".
 */
export const fromAbortable = <A>(abort: Aborter) => (f: CallbackReceiver<A>)
    : Future<A> => run((onError, onSuccess) => {

        f((err: Error | null | undefined, a?: A) =>
            (err != null) ? onError(err) : onSuccess(<A>a));

        return abort;

    });

/**
 * fromCallback produces a Future from a node style async function.
 *
 * Note: The function used here is not called in the "next tick".
 */
export const fromCallback = <A>(f: CallbackReceiver<A>)
    : Future<A> => fromAbortable<A>(noop)(f);

class Tag<A> {

    constructor(public index: number, public value: A) { }

}

/**
 * batch runs a list of batched Futures one batch at a time.
 */
export const batch = <A>(list: Future<A>[][]) =>
    sequential(list.map(w => parallel(w)));

/**
 * parallel runs a list of Futures in parallel failing if any 
 * fail and succeeding with a list of successful values.
 */
export const parallel = <A>(list: Future<A>[])
    : Future<A[]> => run((onError, onSuccess) => {

        let completed: Tag<A>[] = [];
        let finished = false;
        let aborters: Aborter[] = [];

        let indexCmp = <A>(a: Tag<A>, b: Tag<A>) => a.index - b.index;

        let abortAll = () => {

            finished = true;
            aborters.map(f => f());

        };

        let onErr = (e: Error) => {

            if (!finished) {
                abortAll();
                onError(e);
            }

        };

        let reconcile = () => completed.sort(indexCmp).map(t => t.value);

        let onSucc = (t: Tag<A>) => {

            if (!finished) {

                completed.push(t);

                if (completed.length === list.length)
                    onSuccess(reconcile());

            }

        };

        aborters.push.apply(aborters, list.map((f, i) =>
            f.map((value: A) => new Tag(i, value)).fork(onErr, onSucc)));

        if (empty(aborters)) onSuccess([]);

        return () => abortAll();

    });

/**
 * sequential execution of a list of futures.
 * 
 * This function succeeds with a list of all results or fails on the first
 * error.
 */
export const sequential = <A>(list: Future<A>[]): Future<A[]> =>
    run((onError, onSuccess) => {

        let i = 0;
        let r: A[] = [];
        let onErr = (e: Error) => onError(e);
        let success = (a: A) => { r.push(a); next(); };
        let abort: Aborter;

        let next = () => {

            if (i < list.length)
                abort = list[i].fork(onErr, success);
            else
                onSuccess(r);
            i++;

        }

        next();

        return () => { if (abort) abort(); }

    });

/**
 * reduce a list of values into a single value using a reducer function that
 * produces a Future.
 */
export const reduce =
    <A, B>(list: A[], initValue: B, f: Reducer<A, B>)
        : Future<B> => doFuture<B>(function*() {

            let accumValue = initValue;

            for (let i = 0; i < list.length; i++)
                accumValue = yield f(accumValue, list[i], i);

            return pure(accumValue);

        });

/**
 * race given a list of Futures, will return a Future that is settled by
 * the first error or success to occur.
 */
export const race = <A>(list: Future<A>[]): Future<A> =>
    run((onError, onSuccess) => {

        let aborters: Aborter[] = [];
        let finished = false;

        let abortAll = () => {

            finished = true;
            aborters.map(f => f());

        };

        let onErr = (e: Error) => {

            if (!finished) {
                finished = true;
                abortAll();
                onError(e);
            }

        };

        let onSucc = (t: Tag<A>) => {

            if (!finished) {
                finished = true;
                aborters.map((f, i) => (i !== t.index) ? f() : undefined);
                onSuccess(t.value);
            }

        };

        aborters.push.apply(aborters, list.map((f, i) =>
            f.map((value: A) => new Tag(i, value)).fork(onErr, onSucc)));

        if (aborters.length === 0)
            onError(new Error(`race(): Cannot race an empty list!`));

        return () => abortAll();

    });

/**
 * some executes a list of Futures sequentially until one resolves with a 
 * successful value.
 *
 * If none resolve successfully, the final error is raised.
 */
export const some = <A>(list: Future<A>[]): Future<A> =>
    doFuture<A>(function*() {

        for (let i = 0; i < list.length; i++) {

            try {

                let result = yield list[i];
                return pure(result);

            } catch (e) {

                if (i === (list.length - 1)) return raise(<Error>e);

            }

        }

        return raise(new Error('some: empty list'));

    });

/**
 * toPromise transforms a Future into a Promise.
 *
 * This function depends on the global promise constructor and 
 * will fail if the environment does not provide one.
 *
 * @deprecated
 */
export const toPromise = <A>(ft: Future<A>): Promise<A> =>
    new Promise((yes, no) => ft.fork(no, yes));

/**
 * fromExcept converts an Except to a Future.
 */
export const fromExcept = <A>(e: Except<A>): Future<A> =>
    e.fold(e => raise(e), a => pure(a));

/**
 * liftP turns a function that produces a Promise into a Future.
 */
export const liftP = <A>(f: () => Promise<A>): Future<A> =>
    run((onError, onSuccess) => {

        f()
            .then(a => onSuccess(a))
            .catch(e => onError(e));

        return noop;

    });

/**
 * @internal
 * TODO: Remove Type usage.
 */
export type DoFutureGenerator<A>
    = () => Generator<Future<Type>, Future<A>, Type>;

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
export const doFuture = <A>(f: DoFutureGenerator<A>): Future<A> =>
    new Generation(f()); 
