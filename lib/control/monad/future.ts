import { tick } from '../timer';
import { Monad } from './';
import { noop } from '../../data/function';

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
 * Job function type.
 */
export type Job<A> = (c: Supervisor<A>) => Aborter;

/**
 * Callback in node platform style for asynchronous effects.
 */
export type Callback<A> = (e?: Error, a?: A) => void;

/**
 * CallBackReceiver type takes a node style callback 
 * and performs some side-effect.
 */
export type CallbackReceiver<A> = (cb: Callback<A>) => void;

export type T<A> = (f: (cb: Callback<A>) => void) => Future<A>;

export abstract class Future<A> implements Monad<A> {

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

    catch(f: (e: Error) => Future<A>): Future<A> {

        return new Catch(this, f);

    }

    finally(f: () => Future<A>): Future<A> {

        return new Finally(this, f);

    }

    fork(onError: OnError, onSuccess: OnSuccess<A>): Compute<A> {

        let c = new Compute(<any>undefined, onError, onSuccess, [this], [], []);
        c.run();
        return c;

    }

}

/**
 * Pure constructor.
 */
export class Pure<A> extends Future<A> {

    constructor(public value: A) { super(); }

    map<B>(f: (a: A) => B): Future<B> {

        return new Pure(f(this.value));

    }

    ap<B>(ft: Future<(a: A) => B>): Future<B> {

        return ft.map(f => f(this.value));

    }

}

/**
 * Raise constructor.
 */
export class Raise<A> extends Future<A> {

    constructor(public value: Error) { super(); }

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
 * Bind constructor.
 * @private
 */
export class Bind<A, B> extends Future<B> {

    constructor(
        public future: Future<A>,
        public func: (a: A) => Future<B>) { super(); }

}

/**
 * Step constructor.
 * @private
 */
export class Step<A> extends Future<A> {

    constructor(public value: (a: A) => Future<A>) { super(); }

}

/**
 * Catch constructor.
 * @private
 */
export class Catch<A> extends Future<A> {

    constructor(
        public future: Future<A>,
        public func: (e: Error) => Future<A>) { super(); }

}

/**
 * Finally constructor.
 * @private
 */
export class Finally<A> extends Future<A> {

    constructor(
        public future: Future<A>,
        public func: () => Future<A>) { super(); }

}

/**
 * Run constructor.
 * @private
 */
export class Run<A> extends Future<A> {

    constructor(public value: Job<A>) { super(); }

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
export class Compute<A> implements Supervisor<A> {

    canceller: Aborter = noop;

    running = false;

    constructor(
        public value: A,
        public exitError: OnError,
        public exitSuccess: OnSuccess<A>,
        public stack: Future<A>[],
        public handlers: ErrorHandler<A>[],
        public finalizers: Finalizer<A>[]) { }

    /**
     * onError handler.
     *
     * This method will a 'Raise' instruction at the top of the stack
     * and continue execution.
     */
    onError(e: Error) {

        if (this.running === false) return;

        this.stack.push(new Raise(e));
        this.running = false;
        this.run();

    }

    /**
     * onSuccess handler.
     *
     * Stores the resulting value and continues the execution.
     */
    onSuccess(value: A) {

        if (this.running === false) return;

        this.value = value;
        this.running = false;
        this.run();

    }

    /**
     * abort this Compute.
     *
     * Aborting a Compute will immediately clear its stack
     * and invoke the canceller for the currently executing Future.
     */
    abort(): void {

        this.stack = [];
        this.exitError = noop;
        this.exitSuccess = noop;
        this.running = false;
        this.canceller();
        this.canceller = noop;

    }

    /**
     * run this Compute.
     */
    run(): void {

        while (this.stack.length > 0) {

            let next = this.stack.pop();

            if (next instanceof Pure) {

                this.value = next.value;

            } else if (next instanceof Bind) {

                this.stack.push(new Step(next.func));
                this.stack.push(next.future);

            } else if (next instanceof Step) {

                this.stack.push(next.value(this.value));

            } else if (next instanceof Catch) {

                this.handlers.push(next.func);
                this.stack.push(next.future);

            } else if (next instanceof Finally) {

                this.finalizers.push(next.func);
                this.stack.push(new Step(next.func));
                this.stack.push(next.future);

            } else if (next instanceof Raise) {

                this.stack = []; //clear the stack;

                if (this.finalizers.length > 0)
                    this.stack.push(new Step(<Finalizer<A>>this.finalizers.pop()));

                if (this.handlers.length > 0)
                    this.stack.push((<ErrorHandler<A>>this.handlers.pop())(next.value));

                if (this.stack.length === 0)
                    return this.exitError(next.value); //end on unhandled error

            } else if (next instanceof Run) {

                this.running = true;
                this.canceller = next.value(this);
                return; //short-circuit and continue in a new call-stack

            }

        }

        this.running = false;
        this.exitSuccess(this.value);

    }

}

/**
 * pure wraps a synchronous value in a Future.
 */
export const pure = <A>(a: A): Future<A> => new Pure(a);

/**
 * raise wraps an Error in a Future.
 *
 * This future will be considered a failure.
 */
export const raise = <A>(e: Error): Future<A> => new Raise(e);

/**
 * attempt a syncronous task, trapping any thrown errors in the Future.
 */
export const attempt = <A>(f: () => A): Future<A> => new Run((s: Supervisor<A>) => {

    tick(() => { try { s.onSuccess(f()); } catch (e) { s.onError(e); } });
    return noop;

});

/**
 * delay a task by running it in the "next tick" without attempting
 * to trap any thrown errors.
 */
export const delay = <A>(f: () => A): Future<A> => new Run((s: Supervisor<A>) => {

    tick(() => s.onSuccess(f()));
    return noop;

});

/**
 * fromAbortable takes an Aborter and a node style async function and 
 * produces a Future.
 *
 * Note: The function used here is not called in the "next tick".
 */
export const fromAbortable = <A>(abort: Aborter) => (f: CallbackReceiver<A>)
    : Future<A> => new Run((s: Supervisor<A>) => {

        f((err?: Error, a?: A) => (err != null) ? s.onError(err) : s.onSuccess(<A>a));
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
 * parallel runs a list of Futures in parallel failing if any 
 * fail and succeeding with a list of successful values.
 */
export const parallel = <A>(list: Future<A>[])
    : Future<A[]> => new Run((s: Supervisor<A[]>) => {

        let done: Tag<A>[] = [];

        let comps =
            list.reduce((p: Compute<Tag<A>>[], f: Future<A>, index: number) => {

                p.push(f
                    .map((value: A) => new Tag(index, value))
                    .fork(e => { abortAll(p); s.onError(e); },
                        t => {

                            done.push(t);

                            if (done.length === list.length)
                                s.onSuccess(done.sort((a, b) => a.index - b.index)
                                    .map(t => t.value));

                        }));

                return p;
            }, []);

        if (comps.length === 0)
            s.onSuccess([]);

        return () => { abortAll(comps) };

    });

/**
 * race given a list of Futures, will return a Future that is settled by
 * the first error or success to occur.
 */
export const race = <A>(list: Future<A>[])
    : Future<A> => new Run((s: Supervisor<A>) => {

        let comps =
            list
                .reduce((p: Compute<Tag<A>>[], f: Future<A>, index: number) => {

                    p.push(f
                        .map((value: A) => new Tag(index, value))
                        .fork(e => { abortAll(p); s.onError(e); },
                            t => { abortExcept(p, t.index); s.onSuccess(t.value); }));

                    return p;

                }, []);

        if (comps.length === 0)
            s.onError(new Error(`race(): Cannot race an empty list!`));

        return () => { abortAll(comps); }

    });

const abortAll = <A>(comps: Compute<A>[]) => tick(() => comps.map(c => c.abort()));

const abortExcept = <A>(comps: Compute<A>[], index: number) =>
    tick(() => comps.map((c, i) => (i !== index) ? c.abort() : undefined));
