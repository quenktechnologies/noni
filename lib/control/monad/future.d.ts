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
import { Milliseconds } from '../time';
import { Err, Except } from '../error';
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
export declare type Yield<T> = T | Future<T>;
/**
 * OnError callback function type.
 */
export declare type OnError = (e: Error) => void;
/**
 * OnSuccess callback function type.
 */
export declare type OnSuccess<A> = (a: A) => void;
/**
 * Aborter callback function type.
 */
export declare type Aborter = () => void;
/**
 * ErrorHandler callback function type.
 *
 * These are used to trap and recover from errors.
 */
export declare type ErrorHandler<A> = (e: Error) => Future<A>;
/**
 * Finalizer callback function type.
 *
 * Finalizers can be used to clean up resources etc.
 */
export declare type Finalizer<A> = () => Future<A>;
/**
 * NodeFunction is a node platform async function.
 */
export declare type NodeFunction = <A>(f: (cb: Callback<A>) => void) => void;
/**
 * Task is the type of functions that actually execute the async work.
 */
export declare type Task<A> = (onError: OnError, onSuccess: OnSuccess<A>) => Aborter;
/**
 * Callback in node platform style for asynchronous effects.
 */
export declare type Callback<A> = (e: Error | undefined | null, a?: A) => void;
/**
 * CallBackReceiver type takes a node style callback
 * and performs some side-effect.
 */
export declare type CallbackReceiver<A> = (cb: Callback<A>) => void;
/**
 * Reducer function type.
 */
export declare type Reducer<A, B> = (p: B, c: A, i: number) => Future<B>;
/**
 * FutureFunc function type.
 */
export declare type FutureFunc<A, B> = (a: A) => Future<B>;
/**
 * ResolveFunc for promises.
 */
export declare type ResolveFunc<A, TResult1 = A> = ((value: A) => TResult1 | PromiseLike<TResult1>) | undefined | null;
/**
 * RejectFunc for promises.
 */
export declare type RejectFunc<TResult2 = never> = ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null;
/**
 * CatchFunc
 */
export declare type CatchFunc<A> = (reason: any) => A | PromiseLike<A>;
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
export declare abstract class Future<A> implements Monad<A>, Promise<A> {
    get [Symbol.toStringTag](): string;
    /**
     * tag identifies each Future subclass.
     */
    tag: string;
    of(a: A): Future<A>;
    map<B>(f: (a: A) => B): Future<B>;
    ap<B>(ft: Future<(a: A) => B>): Future<B>;
    chain<B>(f: (a: A) => Future<B>): Future<B>;
    trap<B>(f: (e: Error) => Future<B>): Future<B>;
    catch<B = never>(f: CatchFunc<B> | undefined | null): Future<B>;
    finialize<B>(f: () => Future<B>): Future<B>;
    finally(f: () => (void | undefined | null)): Future<A>;
    then<TResult1 = A, TResult2 = never>(onResolve?: ResolveFunc<A, TResult1>, onReject?: RejectFunc<TResult2>): Promise<TResult1 | TResult2>;
    /**
     * fork this Future causing its side-effects to take place.
     */
    fork(onError?: OnError, onSuccess?: OnSuccess<A>): Aborter;
}
/**
 * @internal
 */
export declare class Compute<A> {
    stack: UnsafeStack<Future<A>>;
    constructor(stack?: UnsafeStack<Future<A>>);
    abort(): void;
    run(onError: OnError, onSuccess: OnSuccess<A>): Promise<void>;
}
/**
 * Pure constructor.
 */
export declare class Pure<A> extends Future<A> {
    value: A;
    constructor(value: A);
    tag: string;
    map<B>(f: (a: A) => B): Future<B>;
    ap<B>(ft: Future<(a: A) => B>): Future<B>;
}
/**
 * Bind constructor.
 * @private
 */
export declare class Bind<A, B> extends Future<B> {
    target: Future<A>;
    func: (a: A) => Future<B>;
    constructor(target: Future<A>, func: (a: A) => Future<B>);
    tag: string;
}
/**
 * Call constructor.
 * @private
 */
export declare class Call<A> extends Future<A> {
    target: (a: A) => Future<A>;
    constructor(target: (a: A) => Future<A>);
    tag: string;
}
/**
 * Catch constructor.
 * @private
 */
export declare class Catch<A, B> extends Future<B> {
    target: Future<A>;
    func: (e: Error) => Future<B>;
    constructor(target: Future<A>, func: (e: Error) => Future<B>);
    tag: string;
}
/**
 * Finally constructor.
 * @private
 */
export declare class Finally<A, B> extends Future<B> {
    target: Future<A>;
    func: () => Future<B>;
    constructor(target: Future<A>, func: () => Future<B>);
    tag: string;
}
/**
 * Trap constructor.
 * @private
 */
export declare class Trap<A> extends Future<A> {
    func: (e: Error) => Future<A>;
    constructor(func: (e: Error) => Future<A>);
    tag: string;
}
/**
 * Raise constructor.
 */
export declare class Raise<A> extends Future<A> {
    value: Err;
    constructor(value: Err);
    tag: string;
    map<B>(_: (a: A) => B): Future<B>;
    ap<B>(_: Future<(a: A) => B>): Future<B>;
    chain<B>(_: (a: A) => Future<B>): Future<B>;
}
/**
 * Run constructor.
 * @private
 */
export declare class Run<A> extends Future<A> {
    task: Task<A>;
    constructor(task: Task<A>);
    tag: string;
}
/**
 * Generation constructor.
 *
 * @internal
 */
export declare class Generation<A> extends Future<A> {
    src: Generator<Future<Type>, Future<A>, Type>;
    constructor(src: Generator<Future<Type>, Future<A>, Type>);
    tag: string;
}
/**
 * pure wraps a synchronous value in a Future.
 */
export declare const pure: <A>(a: A) => Future<A>;
/**
 * voidPure is a Future that provides the absence of a value for your
 * convenience.
 */
export declare const voidPure: Future<void>;
/**
 * wrap a value in a Future returning the value if the value is itself a Future.
 */
export declare const wrap: <A>(a: A | Future<A>) => Future<A>;
/**
 * run sets up an async task to be executed at a later point.
 */
export declare const run: <A>(task: Task<A>) => Future<A>;
/**
 * raise wraps an Error in a Future.
 *
 * This future will be considered a failure.
 */
export declare const raise: <A>(e: Err) => Future<A>;
/**
 * attempt a synchronous task, trapping any thrown errors in the Future.
 */
export declare const attempt: <A>(f: () => A) => Future<A>;
/**
 * delay execution of a function f after n milliseconds have passed.
 *
 * Any errors thrown are caught and processed in the Future chain.
 */
export declare const delay: <A>(f: () => A, n?: Milliseconds) => Future<A>;
/**
 * wait n milliseconds before continuing the Future chain.
 */
export declare const wait: (n: Milliseconds) => Future<void>;
/**
 * fromAbortable takes an Aborter and a node style async function and
 * produces a Future.
 *
 * Note: The function used here is not called in the "next tick".
 */
export declare const fromAbortable: <A>(abort: Aborter) => (f: CallbackReceiver<A>) => Future<A>;
/**
 * fromCallback produces a Future from a node style async function.
 *
 * Note: The function used here is not called in the "next tick".
 */
export declare const fromCallback: <A>(f: CallbackReceiver<A>) => Future<A>;
/**
 * batch runs a list of batched Futures one batch at a time.
 */
export declare const batch: <A>(list: Future<A>[][]) => Future<A[][]>;
/**
 * parallel runs a list of Futures in parallel failing if any
 * fail and succeeding with a list of successful values.
 */
export declare const parallel: <A>(list: Future<A>[]) => Future<A[]>;
/**
 * sequential execution of a list of futures.
 *
 * This function succeeds with a list of all results or fails on the first
 * error.
 */
export declare const sequential: <A>(list: Future<A>[]) => Future<A[]>;
/**
 * reduce a list of values into a single value using a reducer function that
 * produces a Future.
 */
export declare const reduce: <A, B>(list: A[], initValue: B, f: Reducer<A, B>) => Future<B>;
/**
 * race given a list of Futures, will return a Future that is settled by
 * the first error or success to occur.
 */
export declare const race: <A>(list: Future<A>[]) => Future<A>;
/**
 * some executes a list of Futures sequentially until one resolves with a
 * successful value.
 *
 * If none resolve successfully, the final error is raised.
 */
export declare const some: <A>(list: Future<A>[]) => Future<A>;
/**
 * toPromise transforms a Future into a Promise.
 *
 * This function depends on the global promise constructor and
 * will fail if the environment does not provide one.
 *
 * @deprecated
 */
export declare const toPromise: <A>(ft: Future<A>) => Promise<A>;
/**
 * fromExcept converts an Except to a Future.
 */
export declare const fromExcept: <A>(e: Except<A>) => Future<A>;
/**
 * liftP turns a function that produces a Promise into a Future.
 */
export declare const liftP: <A>(f: () => Promise<A>) => Future<A>;
/**
 * @internal
 * TODO: Remove Type usage.
 */
export declare type DoFutureGenerator<A> = () => Generator<Future<Type>, Future<A>, Type>;
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
export declare const doFuture: <A>(f: DoFutureGenerator<A>) => Future<A>;
