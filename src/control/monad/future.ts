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
 * Task is the type of functions that execute async work via a Promise.
 */
export type Task<A> = () => Promise<A>;

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

const trapTags = ['Trap', 'Generation'];

/**
 * Future represents a chain of asynchronous tasks that some result when
 * executed.
 *
 * The Future implementation is different that a Promise as it does not 
 * execute it's tasks until instructed to giving control back to the calling
 * code (unlike Promises). To accomplish this, a state machine is built up
 * from the various calls to chain(), map() etc and executed in the run()
 * method.
 *
 * To make using this API easier, doFuture() is provided which allows chains
 * of Futures to be created without callback hell via generators. Use the run()
 * method to get a Promise that contains the final value or treat the future
 * itself as a Promise (calling then() also executes the Future).
 *
 * @typeParam A - The type of the final value.
 */
export abstract class Future<A> implements Monad<A>, Promise<A> {

    /**
     * @param tag - Used internally to distinguish Future types.
     */
    constructor(public tag: string = 'Future') { }

    /**
     * do notation for Futures using async functions.
     *
     * An async function executes its body sequentially, pausing at each 'await'
     * statement preventing asynchronous tasks from pre-empting each other. This
     * is in line with how Futures are meant to work and could be seen as the
     * Promise equivalent of:
     * 
     * ```
     *  pure().chain(task1).chain(task2).chain(task3);
     * ```
     * The difference between Futures and promises of course, is that Futures do 
     * not execute their tasks until fork() is called whereas Promises are 
     * immediate. Nonetheless, an async function can be treated as a Future 
     * because it does not execute any code until it is called.
     *
     * This static method may therfore be more desirable than doFuture() as it 
     * allows for the use of arrow functions doing await with the need to set 
     * `this` to a variable.
     */
    static do<A>(fun: Task<A>): Future<A> {

        return new Run(fun);

    }

    get [Symbol.toStringTag]() {

        return 'Future';

    }

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

    finish<B>(f: () => Future<B>): Future<B> {

        return new Finally(this, f);

    }

    then<TResult1 = A, TResult2 = never>(
        onResolve?: ResolveFunc<A, TResult1>,
        onReject?: RejectFunc<TResult2>
    ): Promise<TResult1 | TResult2> {

        return this.run().then(onResolve).catch(onReject);

    }

    catch<B = never>(f: CatchFunc<B> | undefined | null): Promise<B> {

        return <Promise<B>>this.run().catch(f);

    }

    finally(f: () => (void | undefined | null)): Promise<A> {

        return this.run().finally(f);

    }

    /**
     * fork triggers the asynchronous execution of the Future passing the
     * result or error to the provided callbacks.
     */
    fork(onError: OnError = console.error,
        onSuccess: OnSuccess<A> = noop) {

        this.run().then(onSuccess).catch(onError);

    }

    /**
     * run this Future triggering execution of its asynchronous work.
     */
    async run(): Promise<A> {

        let stack = new UnsafeStack<Future<A>>([this]);

        let value: A = <Type>undefined;
        while (!stack.isEmpty()) {

            let next = <Future<A>>stack.pop();

            switch (next.tag) {

                case 'Pure': {
                    value = (<Pure<A>>next).value;
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
                    if (stack.isEmpty()) throw err;

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

                    try {

                        value = await (<Run<A>>next).task();

                    } catch (e) {

                        stack.push(new Raise(<Error>e));

                    }

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
                    throw new Error(`Unknown Future: ${tag}`);
            }

        }

        return value;
    }

}

/**
 * Pure constructor.
 */
export class Pure<A> extends Future<A> {

    constructor(public value: A) { super('Pure'); }

    map<B>(f: (a: A) => B): Future<B> {

        return new Pure(f(this.value));

    }

    ap<B>(ft: Future<(a: A) => B>): Future<B> {

        return ft.map(f => f(this.value));

    }

}

/**
 * Bind constructor.
 * @internal
 */
export class Bind<A, B> extends Future<B> {

    constructor(
        public target: Future<A>,
        public func: (a: A) => Future<B>) { super('Bind'); }

}

/**
 * Call constructor.
 * @internal
 */
export class Call<A> extends Future<A> {

    constructor(public target: (a: A) => Future<A>) { super('Call'); }

}

/**
 * Catch constructor.
 * @internal
 */
export class Catch<A, B> extends Future<B> {

    constructor(
        public target: Future<A>,
        public func: (e: Error) => Future<B>) { super('Catch'); }

}

/**
 * Finally constructor.
 * @internal
 */
export class Finally<A, B> extends Future<B> {

    constructor(
        public target: Future<A>,
        public func: () => Future<B>) { super('Finally'); }

}

/**
 * Trap constructor.
 * @internal
 */
export class Trap<A> extends Future<A> {

    constructor(public func: (e: Error) => Future<A>) { super('Trap'); }

}

/**
 * Raise constructor.
 */
export class Raise<A> extends Future<A> {

    constructor(public value: Err) { super('Raise'); }

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
 * @internal
 */
export class Run<A> extends Future<A> {

    constructor(public task: Task<A>) { super('Run'); }

}

/**
 * Generation constructor.
 *
 * @internal
 */
export class Generation<A> extends Future<A> {

    constructor(public src: Generator<Future<Type>, Future<A>, Type>) {
        super('Generation');
    }

}

/**
 * @internal
 */
export class Tag<A> {

    constructor(public index: number, public value: A) { }

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

export { run as liftP }

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
    run(async () => f());

/**
 * delay execution of a function f after n milliseconds have passed.
 *
 * Any errors thrown are caught and processed in the Future chain.
 */
export const delay = <A>(f: () => A, n: Milliseconds = 0): Future<A> =>
    run(() => new Promise((resolve, reject) => {

        setTimeout(() => {
            try { resolve(f()); } catch (e) { reject(e); }
        }, n);

    }));

/**
 * wait n milliseconds before continuing the Future chain.
 */
export const wait = (n: Milliseconds): Future<void> =>
    run(() => new Promise(resolve => {

        setTimeout(() => { resolve(undefined); }, n);

    }));

/**
 * fromCallback produces a Future from a node style async function.
 */
export const fromCallback = <A>(f: CallbackReceiver<A>)
    : Future<A> => run(() => new Promise((resolve, reject) => {

        f((err: Error | null | undefined, a?: A) =>
            (err != null) ? reject(err) : resolve(<A>a));

    }))


/**
 * parallel runs a list of Futures in parallel failing if any 
 * fail and succeeding with a list of successful values.
 */
export const parallel = <A>(list: Future<A>[])
    : Future<A[]> => run(() => Promise.all(list));

/**
 * sequential execution of a list of futures.
 * 
 * This function succeeds with a list of all results or fails on the first
 * error.
 */
export const sequential = <A>(list: Future<A>[]): Future<A[]> =>
    run(async () => {

        let results = Array(list.length);

        for (let i = 0; i < list.length; i++)
            results[i] = await list[i];

        return results;

    });

/**
 * batch runs a list of batched Futures one batch at a time.
 */
export const batch = <A>(list: Future<A>[][]) =>
    sequential(list.map(w => parallel(w)));

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
 *
 * Raising an error if the list is empty.
 */
export const race = <A>(list: Future<A>[]): Future<A> =>
    run(() => empty(list) ?
        Promise.reject(new Error('race(): Cannot race an empty list!')) :
        Promise.race(list))

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
export const toPromise = <A>(ft: Future<A>): Promise<A> => ft;

/**
 * fromExcept converts an Except to a Future.
 */
export const fromExcept = <A>(e: Except<A>): Future<A> =>
    e.fold(e => raise(e), a => pure(a));

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
