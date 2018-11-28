import { Monad } from './';
import { Err } from '../error';
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
 * Job function type.
 */
export declare type Job<A> = (c: Supervisor<A>) => Aborter;
/**
 * Callback in node platform style for asynchronous effects.
 */
export declare type Callback<A> = (e?: Error, a?: A) => void;
/**
 * CallBackReceiver type takes a node style callback
 * and performs some side-effect.
 */
export declare type CallbackReceiver<A> = (cb: Callback<A>) => void;
export declare type T<A> = (f: (cb: Callback<A>) => void) => Future<A>;
export declare abstract class Future<A> implements Monad<A> {
    of(a: A): Future<A>;
    map<B>(f: (a: A) => B): Future<B>;
    ap<B>(ft: Future<(a: A) => B>): Future<B>;
    chain<B>(f: (a: A) => Future<B>): Future<B>;
    catch(f: (e: Error) => Future<A>): Future<A>;
    finally(f: () => Future<A>): Future<A>;
    fork(onError: OnError, onSuccess: OnSuccess<A>): Compute<A>;
    /**
     * exec
     * @private
     */
    abstract exec(c: Compute<A>): boolean;
}
/**
 * Pure constructor.
 */
export declare class Pure<A> extends Future<A> {
    value: A;
    constructor(value: A);
    map<B>(f: (a: A) => B): Future<B>;
    ap<B>(ft: Future<(a: A) => B>): Future<B>;
    exec(c: Compute<A>): boolean;
}
/**
 * Bind constructor.
 * @private
 */
export declare class Bind<A, B> extends Future<B> {
    future: Future<A>;
    func: (a: A) => Future<B>;
    constructor(future: Future<A>, func: (a: A) => Future<B>);
    exec(c: Compute<B>): boolean;
}
/**
 * Step constructor.
 * @private
 */
export declare class Step<A> extends Future<A> {
    value: (a: A) => Future<A>;
    constructor(value: (a: A) => Future<A>);
    exec(c: Compute<A>): boolean;
}
/**
 * Catch constructor.
 * @private
 */
export declare class Catch<A> extends Future<A> {
    future: Future<A>;
    func: (e: Error) => Future<A>;
    constructor(future: Future<A>, func: (e: Error) => Future<A>);
    exec(c: Compute<A>): boolean;
}
/**
 * Finally constructor.
 * @private
 */
export declare class Finally<A> extends Future<A> {
    future: Future<A>;
    func: () => Future<A>;
    constructor(future: Future<A>, func: () => Future<A>);
    exec(c: Compute<A>): boolean;
}
/**
 * Raise constructor.
 */
export declare class Raise<A> extends Future<A> {
    value: Err;
    constructor(value: Err);
    map<B>(_: (a: A) => B): Future<B>;
    ap<B>(_: Future<(a: A) => B>): Future<B>;
    chain<B>(_: (a: A) => Future<B>): Future<B>;
    exec(c: Compute<A>): boolean;
}
/**
 * Run constructor.
 * @private
 */
export declare class Run<A> extends Future<A> {
    value: Job<A>;
    constructor(value: Job<A>);
    exec(c: Compute<A>): boolean;
}
/**
 * Supervisor for Computations.
 *
 * A Supervisor provides the callbacks needed to indicate
 * an end of a Job.
 */
export interface Supervisor<A> {
    /**
     * onError indicates the Job has failed.
     *
     * Must be called no more than once.
     */
    onError(e: Error): void;
    /**
     * onSuccess indicates the Job has succeeded.
     *
     * Must be called no more than once.
     */
    onSuccess(value: A): void;
}
/**
 * Compute represents the workload of a forked Future.
 *
 * Results are computed sequentially and ends with either a value,
 * error or prematurely via the abort method.
 */
export declare class Compute<A> implements Supervisor<A> {
    value: A;
    exitError: OnError;
    exitSuccess: OnSuccess<A>;
    stack: Future<A>[];
    handlers: ErrorHandler<A>[];
    finalizers: Finalizer<A>[];
    canceller: Aborter;
    running: boolean;
    constructor(value: A, exitError: OnError, exitSuccess: OnSuccess<A>, stack: Future<A>[], handlers: ErrorHandler<A>[], finalizers: Finalizer<A>[]);
    /**
     * onError handler.
     *
     * This method will a 'Raise' instruction at the top of the stack
     * and continue execution.
     */
    onError(e: Error): void;
    /**
     * onSuccess handler.
     *
     * Stores the resulting value and continues the execution.
     */
    onSuccess(value: A): void;
    /**
     * abort this Compute.
     *
     * Aborting a Compute will immediately clear its stack
     * and invoke the canceller for the currently executing Future.
     */
    abort(): void;
    run(): void;
}
/**
 * pure wraps a synchronous value in a Future.
 */
export declare const pure: <A>(a: A) => Future<A>;
/**
 * raise wraps an Error in a Future.
 *
 * This future will be considered a failure.
 */
export declare const raise: <A>(e: Err) => Future<A>;
/**
 * attempt a syncronous task, trapping any thrown errors in the Future.
 */
export declare const attempt: <A>(f: () => A) => Future<A>;
/**
 * delay a task by running it in the "next tick" without attempting
 * to trap any thrown errors.
 */
export declare const delay: <A>(f: () => A) => Future<A>;
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
 * parallelN runs a list of batched Futures one batch at a time.
 */
export declare const parallelN: <A>(list: Future<A>[][]) => Future<A[][]>;
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
 * race given a list of Futures, will return a Future that is settled by
 * the first error or success to occur.
 */
export declare const race: <A>(list: Future<A>[]) => Future<A>;
/**
 * toPromise transforms a Future into a Promise.
 *
 * This function depends on the global promise constructor and
 * will fail if the enviornment does not provide one.
 */
export declare const toPromise: <A>(ft: Future<A>) => Promise<A>;
/**
 * fromExcept converts an Except to a Future.
 */
export declare const fromExcept: <A>(e: import("../../data/either").Either<Err, A>) => Future<A>;
