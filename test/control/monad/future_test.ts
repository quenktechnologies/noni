import * as must from 'must/register';
import * as Promise from 'bluebird';
import * as functor from '../../checks/functor';
import * as apply from '../../checks/apply';
import * as applicative from '../../checks//applicative';
import * as chain from '../../checks/chain';
import * as monad from '../../checks/monad';
import { tick } from '../../../src/control/timer';
import { noop } from '../../../src/data/function';
import {
    Future,
    Run,
    Supervisor,
    Compute,
    pure,
    attempt,
    fromAbortable,
    fromCallback,
    parallel,
    race
} from '../../../src/control/monad/future';

const value = 12;

const liftP = <A>(ft: Future<A>) =>
    new Promise((res: any, rej: any) => ft.fork(rej, res));

const eq = <A>(f1: Future<A>) => (f2: Future<A>) =>
    liftP(f1)
        .then((a: A) =>
            liftP(f2)
                .then((b: A) => must(a).eql(b)));

const map = (n: number) => n * 2;

const bind = (n: number) => pure(n * 1);

const inc = (n: number) => new Run((s: Supervisor<any>) => {

    tick(() => s.onSuccess(n + 1));
    return noop;

});

const err = (msg: string) => new Run((s: Supervisor<any>) => {

    tick(() => s.onError(new Error(msg)));
    return noop;

});

describe('future', () => {

    describe('Future', () => {

        describe('Functor', () => {

            it('should obey the identity law', () =>
                functor.identity(pure)(eq)(value))

            it('should obey the composition law', () =>
                (functor.composition(pure)(eq)(map)(map)(value)))

        })

        describe('Apply', () => {

            it('should obey the composition law', () =>
                (apply.composition(pure)(eq)(map)(map)(value)))

        })

        describe('Applicative', () => {

            it('should obey the identity law', () =>
                (applicative.identity(pure)(eq)(value)))

            it('should obey the homomorphism law', () =>
                applicative.identity(pure)(eq)(value))

        })

        describe('Chain', () => {

            it('should obey the associativity law', () =>
                (chain.associativity(pure)(eq)(value)))

        })

        describe('Monad', () => {

            it('should obey the left identity law', () =>
                (monad.leftIdentity(pure)(eq)(bind)(value)))

        })

        describe('fork', () => {

            let msg = 'error';

            it('should provide the final value', () =>
                (new Promise((res: any, rej: any) => inc(0).fork(rej, res)))
                    .then((value: number) => must(value).be(1)));

            it('should provide the error', () =>
                (new Promise((res: any, rej: any) => err(msg).fork(rej, res)))
                    .catch((e: Error) => must(e.message).be(msg)))

        })

        describe('map', () => {

            it('should never result in error and success', () =>
                liftP(inc(0)
                    .map(map)
                    .chain((n: number) => err(`error: ${n}`))
                    .map(map))
                    .then(() => Promise.reject('Map did not reject!'))
                    .catch((e: Error) => must(e.message).be('error: 2')));

        })

        describe('ap', () => {

            let ap = pure(map);

            it('should never result in error and success', () =>
                liftP(inc(0)
                    .ap(ap)
                    .chain((n: number) => err(`error: ${n}`))
                    .ap(ap))
                    .then(() => Promise.reject('Ap did not reject!'))
                    .catch((e: Error) => must(e.message).be('error: 2')));

        })

        describe('chain', () => {

            it('should never result in error and success', () =>
                liftP(inc(0)
                    .chain((n: number) => err(`error: ${n}`))
                    .chain(inc))
                    .then(() => Promise.reject('Chain did not reject!'))
                    .catch((e: Error) => must(e.message).be('error: 1')));

        })

        describe('catch', () => {

            it('should allow errors to be caught', () =>
                liftP(inc(0)
                    .chain(inc)
                    .chain(inc)
                    .chain(() => err('foo'))
                    .catch((e: Error) => pure(must(e.message).be('foo')))))

            it('should not duplicate errors', () =>
                liftP(inc(0)
                    .chain(inc)
                    .chain(inc)
                    .chain(() => err('foo'))
                    .catch((e: Error) => pure(must(e.message).be('foo')))
                    .catch((e: Error) => pure(must(e).be('foo')))));

        });

        describe('finally', () => {

            it('should run after success', () =>
                liftP(inc(0)
                    .chain(inc)
                    .finally(() => pure(12)))
                    .then((n: number) => must(n).be(12)));

            it('should run after failure', () =>
                liftP(inc(0)
                    .chain(inc)
                    .chain(() => err('foo'))
                    .catch((e: Error) => pure(must(e.message).be('foo')))
                    .finally(() => pure(12)))
                    .then((n: number) => must(n).be(12)));

        });

    })

    describe('Compute', () => {

        describe('abort', () => {

            it('should work', cb => {

                let error = (_: Error) => { throw _; }

                let success = (_: any) => { throw new Error(_); }

                let task = new Run((s: Supervisor<any>) => {

                    setTimeout(() => s.onSuccess(true), 100000);
                    return noop;

                });

                let c = new Compute(undefined, error, success, [task], [], []);

                setTimeout(() => { c.abort(); cb(); }, 100)

                c.run();

            });

        });

        describe('run', () => {

            it('should execute jobs sequentially', cb => {

                let seq: number[] = [];

                let error = (e: Error) => { throw e; };

                let success = () => {

                    must(seq).eql([1, 4, 5, 11, 3, 2]); //stack grows downward

                    cb();

                }

                let task = (id: number) => new Run((s: Supervisor<any>) => {

                    setTimeout(() => { seq.push(id); s.onSuccess(id); }, 10);
                    return noop;

                });

                let tasks = [task(2), task(3), task(11), task(5), task(4), task(1)];

                let c = new Compute(undefined, error, success, tasks, [], []);

                c.run();

            });

        });

    });

    describe('attempt', () => {

        it('should trap errors', () =>

            liftP(attempt(() => { throw new Error('foo'); })
                .chain(inc)
                .catch((e: Error) => pure(e.message)))
                .then((s: string) => must(s).be('foo')));

        it('should work', () =>
            liftP(attempt(() => 11)
                .chain(inc))
                .then((n: number) => must(n).be(12)))

    });

    describe('fromAbortable', () => {

        it('should invoke abort function', cb => {

            let f = fromAbortable(cb)(node => setTimeout(node, 500000));

            f.fork(noop, noop).abort();

        });

    });

    describe('fromCallback', () => {

        it('should work', cb => {

            let f = (node: (e: Error, a: number) => void) =>
                setTimeout(() => node(<any>undefined, 12), 100);

            let raise = (e: Error) => { cb(e); }

            let success = (n: any) => { must(n).be(12); cb(); }

            fromCallback(cb => f(cb)).fork(raise, success);

        });

    });

    describe('parallel', () => {

        it('should fail if any fail', () => {

            let task = (n: number) => new Run((s: Supervisor<any>) => {

                setTimeout(() => s.onSuccess(n), n);
                return noop;

            })

            let err = (m: string, n: number) => new Run((s: Supervisor<any>) => {

                setTimeout(() => s.onError(new Error(m)), n);
                return noop;

            })

            return liftP(race([task(1000), err('m', 2000), err('foo', 500), task(200)]))
                .catch((e: Error) => must(e.message).be('foo'));

        });

        it('should succeed with all results', () => {

            let task = (n: number) => new Run((s: Supervisor<any>) => {

                setTimeout(() => s.onSuccess(n), n);
                return noop;

            })

            return liftP(parallel([task(300), task(200), task(500), task(600)]))
            .then((list:number[])=> must(list).eql([300,200,500,600]));

        });

    });

    describe('race', () => {

        it('should fail on the first error', () => {

            let task = (n: number) => new Run((s: Supervisor<any>) => {

                setTimeout(() => s.onError(new Error(String(n))), n);
                return noop;

            });

            return liftP(race([task(1000), task(2000), task(500), task(200), task(800)]))
                .catch((e: Error) => must(e.message).be('200'))

        })

        it('should succeed with the first successfull promise', () => {

            let task = (n: number) => new Run((s: Supervisor<any>) => {

                setTimeout(() => s.onSuccess(n), n);
                return noop;

            });

            return liftP(race([task(1000), task(2000), task(500), task(200), task(800)]))
                .then((n: number) => must(n).be(200))

        })

    });

});
