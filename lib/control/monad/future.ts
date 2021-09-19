import { Type } from '../../data/type';
import { noop } from '../../data/function';
import { Milliseconds } from '../time';
import { tick } from '../timer';
import { Err, Except, convert } from '../error';
import { Monad, DoFn, doN as _doN } from './';

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

    fork(onError: OnError = noop, onSuccess: OnSuccess<A> = noop): Compute<A> {

        return (new Compute(<any>undefined, onError, onSuccess, [this])).run();

    }

    /**
     * __exec
     * @private
     */
    abstract __exec(c: Compute<A>): boolean;

    /**
     * __trap
     * @private
     */
    __trap(_: Error, __: Compute<A>): boolean {

        return false;

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

    __exec(c: Compute<A>): boolean {

        c.value = this.value;
        tick(() => c.run());
        return false;

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


    __exec(c: Compute<B>): boolean {

        //XXX: find a way to do this without any someday.
        c.stack.push(new Step(<any>this.func));
        c.stack.push(<any>this.future);
        return true;

    }

}

/**
 * Step constructor.
 * @private
 */
export class Step<A> extends Future<A> {

    constructor(public value: (a: A) => Future<A>) { super(); }

    __exec(c: Compute<A>): boolean {

        c.stack.push(this.value(c.value));
        return true;

    }

}

/**
 * Catch constructor.
 * @private
 */
export class Catch<A> extends Future<A> {

    constructor(
        public future: Future<A>,
        public func: (e: Error) => Future<A>) { super(); }

    __exec(c: Compute<A>): boolean {

        c.stack.push(new Trap(this.func));
        c.stack.push(this.future);
        return true;

    }

}

/**
 * Finally constructor.
 * @private
 */
export class Finally<A> extends Future<A> {

    constructor(
        public future: Future<A>,
        public func: () => Future<A>) { super(); }

    __exec(c: Compute<A>): boolean {

        c.stack.push(new Trap(this.func));
        c.stack.push(new Step(this.func));
        c.stack.push(this.future);
        return true;

    }

}

/**
 * Trap constructor.
 * @private
 */
export class Trap<A> extends Future<A> {

    constructor(
        public func: (e: Error) => Future<A>) { super(); }

    __exec(_: Compute<A>): boolean {

        return true;

    }

    __trap(e: Error, c: Compute<A>): boolean {

        c.stack.push(this.func(e));
        return true;

    }

}

/**
 * Raise constructor.
 */
export class Raise<A> extends Future<A> {

    constructor(public value: Err) { super(); }

    map<B>(_: (a: A) => B): Future<B> {

        return <Future<B>>new Raise(this.value);

    }

    ap<B>(_: Future<(a: A) => B>): Future<B> {

        return <Future<B>>new Raise<B>(this.value);

    }

    chain<B>(_: (a: A) => Future<B>): Future<B> {

        return <Future<B>>new Raise(this.value);

    }

    __exec(c: Compute<A>): boolean {

        let finished = false;
        let e = convert(this.value);

        while (!finished) {

            if (c.stack.length === 0) {

                c.exitError(e);
                return false;

            } else {

                finished = (<Future<A>>c.stack.pop()).__trap(e, c);

            }

        }

        return finished;

    }

}

/**
 * Run constructor.
 * @private
 */
export class Run<A> extends Future<A> {

    constructor(public value: Job<A>) { super(); }

    __exec(c: Compute<A>): boolean {

        c.running = true;
        c.canceller = this.value(c);
        return false;

    }

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
        public stack: Future<A>[]) { }

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

    run(): Compute<A> {

        while (this.stack.length > 0) {

            let next = <Future<A>>this.stack.pop();

            if ((next == null) || (typeof next.__exec !== 'function')) {

                try {

                    throw new Error(`Invalid Compute stack member: "${next}"!`);

                } catch (e) {

                    this.onError(<Type>e);
                    return this;

                }

            }

            if (!next.__exec(this)) return this; // short-circuit

        }

        this.running = false;
        this.exitSuccess(this.value);

        return this;

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
export const raise = <A>(e: Err): Future<A> => new Raise(e);

/**
 * attempt a synchronous task, trapping any thrown errors in the Future.
 */
export const attempt = <A>(f: () => A): Future<A> =>
    new Run((s: Supervisor<A>) => {

        tick(() => {
            try { s.onSuccess(f()); } catch (e) { s.onError(<Type>e); }
        });

        return noop;

    });

/**
 * delay execution of a function f after n milliseconds have passed.
 *
 * Any errors thrown are caught and processed in the Future chain.
 */
export const delay = <A>(f: () => A, n: Milliseconds = 0): Future<A> =>
    new Run((s: Supervisor<A>) => {

        setTimeout(() => {
            try { s.onSuccess(f()); } catch (e) { s.onError(<Type>e); }
        }, n);

        return noop;

    });

/**
 * wait n milliseconds before continuing the Future chain.
 */
export const wait = (n: Milliseconds): Future<void> =>
    new Run((s: Supervisor<void>) => {

        setTimeout(() => { s.onSuccess(undefined); }, n);

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

        f((err: Error | null | undefined, a?: A) =>
            (err != null) ? s.onError(err) : s.onSuccess(<A>a));
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
    : Future<A[]> => new Run((s: Supervisor<A[]>) => {

        let done: Tag<A>[] = [];
        let failed = false;
        let comps: Compute<Tag<A>>[] = [];

        let reconcile = () => done.sort(indexCmp).map(t => t.value);

        let indexCmp = <A>(a: Tag<A>, b: Tag<A>) => a.index - b.index;

        let onErr = (e: Error) => {

            abortAll();
            s.onError(e);

        };

        let onSucc = (t: Tag<A>) => {

            if (!failed) {

                done.push(t);

                if (done.length === list.length)
                    s.onSuccess(reconcile());

            }

        };

        let abortAll = () => {

            comps.map(c => c.abort());
            failed = true;

        };

        comps.push.apply(comps, list.map((f, i) =>
            f.map((value: A) => new Tag(i, value)).fork(onErr, onSucc)));

        if (comps.length === 0)
            s.onSuccess([]);

        return () => abortAll();

    });

/**
 * sequential execution of a list of futures.
 * 
 * This function succeeds with a list of all results or fails on the first
 * error.
 */
export const sequential = <A>(list: Future<A>[]): Future<A[]> => new Run(s => {

    let i = 0;
    let r: A[] = [];
    let onErr = (e: Error) => s.onError(e);
    let onSuccess = (a: A) => { r.push(a); next(); };
    let abort: Compute<A>;

    let next = () => {

        if (i < list.length)
            abort = list[i].fork(onErr, onSuccess);
        else
            s.onSuccess(r);
        i++;

    }

    next();

    return () => { if (abort) abort.abort(); }

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
export const race = <A>(list: Future<A>[])
    : Future<A> => new Run((s: Supervisor<A>) => {

        let comps: Compute<Tag<A>>[] = [];
        let finished = false;

        let abortAll = () => {

            finished = true;
            comps.map(c => c.abort());

        };

        let onErr = (e: Error) => {

            abortAll();
            s.onError(e);

        };

        let onSucc = (t: Tag<A>) => {

            if (!finished) {

                finished = true;
                comps.map((c, i) => (i !== t.index) ? c.abort() : undefined);
                s.onSuccess(t.value);

            }

        };

        comps.push.apply(comps, list.map((f, i) =>
            f.map((value: A) => new Tag(i, value)).fork(onErr, onSucc)));

        if (comps.length === 0)
            s.onError(new Error(`race(): Cannot race an empty list!`));

        return () => abortAll();

    });

/**
 * toPromise transforms a Future into a Promise.
 *
 * This function depends on the global promise constructor and 
 * will fail if the enviornment does not provide one.
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
export const liftP = <A>(f: () => Promise<A>): Future<A> => new Run(s => {

    f()
        .then(a => s.onSuccess(a))
        .catch(e => s.onError(e));

    return noop;

});

/**
 * doFuture provides a do notation function specialized to Futures.
 *
 * Use this function to avoid explicit type assertions with control/monad#doN.
 */
export const doFuture = <A>(f: DoFn<A, Future<A>>): Future<A> => _doN(f);
