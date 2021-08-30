import * as functor from '../../checks/functor';
import * as apply from '../../checks/apply';
import * as applicative from '../../checks//applicative';
import * as chain from '../../checks/chain';
import * as monad from '../../checks/monad';
import { assert } from '@quenk/test/lib/assert';
import { tick } from '../../../src/control/timer';
import { noop } from '../../../src/data/function';
import {
    Future,
    Run,
    Supervisor,
    Compute,
    pure,
    attempt,
    delay,
    wait,
    fromAbortable,
    fromCallback,
    raise,
    sequential,
    reduce,
    batch,
    parallel,
    toPromise,
    liftP,
    race,
    doFuture
} from '../../../src/control/monad/future';

const value = 12;

const eq = <A>(f1: Future<A>) => (f2: Future<A>) =>
    toPromise<A>(f1)
        .then((a: A) =>
            toPromise<A>(f2)
                .then((b: A) => assert(<any>a).equate(<any>b)));

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

const errorTask = (m: string, delay: number, tags: string[]) =>
    new Run((s: Supervisor<any>) => {

        setTimeout(() => {
            s.onError(new Error(m));
            tags.push(m)
        }, delay);

        return noop;

    });

const tagTask = (tag: string, n: number, tags: string[]) =>
    new Run((s: Supervisor<any>) => {

        setTimeout(() => {
            s.onSuccess(n);
            tags.push(tag);
        }, n);
        return noop;

    });

const promiseTask = () => new Promise((y, _) => {

    setTimeout(() => y(12), 1000);

});

describe('future', () => {

    describe('Future', () => {

        describe('Functor', () => {

            it('should obey the identity law', () =>
                functor.identity(pure)(eq)(value))

            it('should obey the composition law', () =>
                (functor.composition<number>(pure)(eq)(map)(map)(value)))

        })

        describe('Apply', () => {

            it('should obey the composition law', () =>
                (apply.composition<number>(pure)(eq)(map)(map)(value)))

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
                (monad.leftIdentity<number>(pure)(eq)(bind)(value)))

        })

        describe('fork', () => {

            let msg = 'error';

            it('should provide the final value', () =>
                (new Promise<number>((res: any, rej: any) => inc(0).fork(rej, res)))
                    .then((value: number) => assert(value).equal(1)));

            it('should provide the error', () =>
                (new Promise((res: any, rej: any) => err(msg).fork(rej, res)))
                    .catch((e: Error) => assert(e.message).equal(msg)))

            it('should have default parameters', () => inc(0).fork())

        })

        describe('map', () => {

            it('should never result in error and success', () =>
                toPromise(inc(0)
                    .map(map)
                    .chain((n: number) => err(`error: ${n}`))
                    .map(map))
                    .then(() => Promise.reject('Map did not reject!'))
                    .catch((e: Error) => assert(e.message).equal('error: 2')));

        })

        describe('ap', () => {

            let ap = pure(map);

            it('should never result in error and success', () =>
                toPromise(inc(0)
                    .ap(ap)
                    .chain((n: number) => err(`error: ${n}`))
                    .ap(ap))
                    .then(() => Promise.reject('Ap did not reject!'))
                    .catch((e: Error) => assert(e.message).equal('error: 2')));

        })

        describe('chain', () => {

            it('should never result in error and success', () =>
                toPromise(inc(0)
                    .chain((n: number) => err(`error: ${n}`))
                    .chain(inc))
                    .then(() => Promise.reject('Chain did not reject!'))
                    .catch((e: Error) => assert(e.message).equal('error: 1')));

        })

        describe('catch', () => {

            it('should allow errors to be caught', () =>
                toPromise(inc(0)
                    .chain(inc)
                    .chain(inc)
                    .chain(() => err('foo'))
                    .catch((e: Error) => pure(assert(e.message).equal('foo')))))

            it('should not duplicate errors', () =>
                toPromise(inc(0)
                    .chain(inc)
                    .chain(inc)
                    .chain(() => err('foo'))
                    .catch((e: Error) => pure(assert(e.message).equal('foo')))
                    .catch((e: Error) => pure(assert(e).equal('foo')))));

            it('should not swallow further errors', cb => {

                toPromise(inc(0)
                    .chain(inc)
                    .chain(() => err('first'))
                    .catch((_: Error) => inc(0))
                    .chain(() => err('second')))
                    .catch(e => {

                        assert(e.message).be.equal('second');
                        cb();

                    })
            });

        });

        describe('finally', () => {

            it('should run after success', () =>
                toPromise(inc(0)
                    .chain(inc)
                    .finally(() => pure(12)))
                    .then((n: number) => assert(n).equal(12)));

            it('should run after failure', () =>
                toPromise(inc(0)
                    .chain(inc)
                    .chain(() => err('foo'))
                    .catch((e: Error) => pure(assert(e.message).equal('foo')))
                    .finally(() => pure(12)))
                    .then((n: number) => assert(n).equal(12)));

        })

        it('should not duplicate operations', () => {

            let count = 0;
            let m = () => { count = count + 1; return pure(count); };

            return toPromise(pure(0)
                .chain(m)
                .chain(m)
                .chain(m))
                .then(() => assert(count).equal(3));

        })

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

                let c = new Compute(undefined, error, success, [task]);

                setTimeout(() => { c.abort(); cb(); }, 100)

                c.run();

            });

        });

        describe('run', () => {

            it('should execute jobs sequentially', cb => {

                let seq: number[] = [];

                let error = (e: Error) => { throw e; };

                let success = () => {

                    assert(seq).equate([1, 4, 5, 11, 3, 2]); //stack grows downward

                    cb();

                }

                let task = (id: number) => new Run((s: Supervisor<any>) => {

                    setTimeout(() => { seq.push(id); s.onSuccess(id); }, 10);
                    return noop;

                });

                let tasks = [task(2), task(3), task(11), task(5), task(4), task(1)];

                let c = new Compute(undefined, error, success, tasks);

                c.run();

            });

        });

    });

    describe('attempt', () => {

        it('should trap errors', () =>
            toPromise(attempt(() => { throw new Error('foo'); })
                .chain(inc)
                .catch((e: Error) => pure(e.message)))
                .then((s: string) => assert(s).equal('foo')));

        it('should work otherwise', () =>
            toPromise(attempt(() => 11)
                .chain(inc))
                .then((n: number) => assert(n).equal(12)))

    });

    describe('delay', () => {

        it('should delay results', () =>
            toPromise(delay(() => 11)
                .chain(inc))
                .then((n: number) => assert(n).equal(12)))

    });

    describe('wait', () => {

        it('should pause chain execution', () => {

            let then = Date.now();

            return toPromise(
                wait(1000)
                    .chain((): Future<void> => {

                        let x = Date.now() - then;

                        if (x < 1000)
                            return <Future<void>>raise(
                                new Error(`waited ${x} milliseconds `
                                    + `instead of 1000`))!
                        else
                            return <Future<void>>pure(undefined);

                    }))

        })

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

            let success = (n: any) => { assert(n).equal(12); cb(); }

            fromCallback(cb => f(cb)).fork(raise, success);

        });

    });

    describe('sequential', () => {

        it('should fail if any fail', () => {

            let tags: string[] = [];
            let failed = false;

            return toPromise(sequential([
                tagTask('a', 1000, tags),
                errorTask('m', 2000, tags),
                errorTask('foo', 500, tags),
                tagTask('d', 200, tags)])
                .catch((e: Error) => {

                    if (e.message === 'm')
                        failed = true;

                    return pure(tags);

                }))
                .then(() => {

                    assert(failed).be.true();
                    assert(tags).equate(['a', 'm']);

                });

        });

        it('should succeed with all results', () => {

            let tags: string[] = [];

            return toPromise(sequential([
                tagTask('a', 300, tags),
                tagTask('b', 200, tags),
                tagTask('c', 500, tags),
                tagTask('d', 600, tags)]))
                .then((list: number[]) => assert(list).equate([300, 200, 500, 600]))
                .then(() => assert(tags).equate(['a', 'b', 'c', 'd']));

        });

        it('should work when the list is empty', () => {

            return toPromise(sequential([]))
                .then((list: any[]) => assert(list).equate([]));

        });

        it('should work with a list of pure values', () => {

            return toPromise(sequential([pure(1), pure(2), pure(3)]))
                .then((list: number[]) => assert(list).equate([1, 2, 3]));

        });

        it('should work with a list of failed values', () => {

            let failed = false;

            let seq: Future<undefined[]> = sequential([
                <Future<undefined>>raise(new Error('1')),
                <Future<undefined>>raise(new Error('2'))
            ]);

            return toPromise(
                seq
                    .catch((e: Error) => {

                        if (e.message === '1')
                            failed = true;

                        return pure(<undefined[]>[]);

                    }))
                .then(() => assert(failed).be.true())

        });

    });

    describe('reduce', () => {

        it('should reduce a list', () =>
            toPromise(reduce([1, 2, 3], 0, (p, c) => pure(p + c)))
                .then(value => assert(value).equal(6)));

        it('should fail if any fail', () => {

            let failed = false;

            return toPromise(reduce([1, 2, 3, 4], 0, (p, c, k) =>
                (k === 2) ? raise(new Error('not allowed')) : pure(p + c))
                .catch((e: Error) => {

                    if (e.message === 'not allowed')
                        failed = true;

                    return pure(6);

                }))
                .then(() => {

                    assert(failed).be.true();

                });

        });

        it('should work when the list is empty', () => {

            return toPromise(reduce([], 12, (p, c) => pure(p + c)))
                .then((r: number) => assert(r).equal(12));

        });

    })

    describe('batch', () => {

        it('should fail if any fail', () => {

            let tags: string[] = [];
            let failed = false;

            return toPromise(batch([
                [tagTask('a', 1000, tags), tagTask('a', 2000, tags)],
                [errorTask('m', 1000, tags)],
                [errorTask('foo', 500, tags)],
                [tagTask('d', 200, tags)]])
                .catch((e: Error) => {

                    if (e.message === 'm')
                        failed = true;

                    return pure([tags]);

                }))
                .then(() => {

                    assert(failed).be.true();
                    assert(tags).equate(['a', 'a', 'm']);

                });

        });

        it('should succeed with all results', () => {

            let tags: string[] = [];

            return toPromise(batch([
                [tagTask('a', 300, tags),
                tagTask('a', 600, tags),
                tagTask('a', 100, tags)],
                [tagTask('b', 200, tags)],
                [tagTask('c', 300, tags), tagTask('c', 500, tags)],
                [tagTask('d', 200, tags), tagTask('d', 600, tags)]]))
                .then((list: number[][]) =>
                    assert(list)
                        .equate([
                            [300, 600, 100],
                            [200],
                            [300, 500],
                            [200, 600]]))
                .then(() =>
                    assert(tags).equate([
                        'a', 'a', 'a', 'b', 'c', 'c', 'd', 'd'
                    ]));

        });

        it('should work when the list is empty', () => {

            return toPromise(batch([]))
                .then((list: any[]) => assert(list).equate([]));

        });

        it('should work with a list of pure values', () => {

            return toPromise(batch([[pure(1), pure(2)], [pure(3)]]))
                .then((list: number[][]) => assert(list).equate([[1, 2], [3]]));

        });

        it('should work with a list of failed values', () => {

            let failed = false;

            return toPromise(batch([

                [raise(new Error('1')), raise(new Error('2'))]

            ])
                .catch((e: Error) => {

                    if (e.message === '1')
                        failed = true;

                    return pure(<any[]>[]);

                }))
                .then(() => {

                    assert(failed).be.true();

                });

        });

    })

    describe('parallel', () => {

        it('should fail if any fail', () => {

            let failed = false;
            let tags: string[] = [];

            let tasks = [
                tagTask('a', 1000, tags),
                errorTask('m', 2000, tags),
                errorTask('foo', 500, tags),
                tagTask('bar', 200, tags)];

            return toPromise(parallel(tasks)
                .catch((e: Error) => {
                    if (e.message === 'foo')
                        failed = true;
                    return pure(<{}[]>[])
                }))
                .then(() => assert(failed).equal(true));

        });

        it('should succeed with all results', () => {

            let tags: string[] = [];

            return toPromise(parallel([
                tagTask('a', 300, tags),
                tagTask('b', 200, tags),
                tagTask('c', 500, tags),
                tagTask('d', 300, tags),
                tagTask('e', 600, tags)
            ]))
                .then((list: number[]) =>
                    assert(list).equate([300, 200, 500, 300, 600]));

        });

        it('should work when the list is empty', () => {

            return toPromise(parallel([]))
                .then((list: any[]) => assert(list).equate([]));

        });

        it('should work with a list of pure values', () => {

            return toPromise(parallel([pure(1), pure(2), pure(3)]))
                .then((list: number[]) => assert(list).equate([1, 2, 3]));

        });

        it('should work with a list of raise values', () => {

            let e = new Error('a');
            let failed = false;

            let par: Future<undefined[]> = parallel([
                raise(e),
                raise(e),
                raise(e)]);

            return toPromise(
                par
                    .catch((e: Error) => {

                        if (e.message === 'a')
                            failed = true;

                        return pure(<undefined[]>[]);

                    }))
                .then(() => assert(failed).be.true());

        });

        it('should work with a list of failed values', () => {

            let failed = false;

            return toPromise(
                parallel([raise(new Error('1')), raise(new Error('2'))])
                    .catch((e: Error) => {

                        if (e.message === '1')
                            failed = true;

                        return pure(<any[]>[]);

                    }))
                .then(() => {

                    assert(failed).be.true();

                });

        });

    });

    describe('race', () => {

        it('should fail on the first error', () => {

            let tags: string[] = [];
            let failed = false;

            return toPromise(race([
                tagTask('a', 1000, tags),
                tagTask('b', 2000, tags),
                errorTask('c', 100, tags),
                tagTask('d', 500, tags),
                tagTask('e', 800, tags)])
                .catch((e: Error) => {

                    if (e.message === 'c')
                        failed = true;

                    return pure(tags);

                }))
                .then(() => {

                    assert(failed).be.true();

                });

        });

        it('should succeed with the first successfull value', () => {

            return toPromise(race([
                tagTask('a', 1000, []),
                tagTask('b', 2000, []),
                tagTask('c', 500, []),
                tagTask('d', 200, []),
                tagTask('e', 800, [])]))
                .then((n: number) => assert(n).equal(200))

        });

        it('should fail when the list is empty', () => {

            return toPromise(race([]))
                .then(() => { throw new Error('bleh'); })
                .catch((e: Error) =>
                    assert(e.message).equal('race(): Cannot race an empty list!'));

        });

        it('should work with a list of pure values', () => {

            return toPromise<number>(race([pure(1), pure(2), pure(3)]))
                .then((list: number) => assert(list).equal(1));

        });

        it('should work with a list of failed values', () => {

            let failed = false;

            return toPromise(race([
                raise(new Error('1')),
                raise(new Error('2'))
            ])
                .catch((e: Error) => {

                    if (e.message === '1')
                        failed = true;

                    return pure(<any>[]);

                }))
                .then(() => {

                    assert(failed).be.true();

                });

        });

    });

    describe('liftP', () => {

        it('should turn a promise into a Future', done => {

            liftP(promiseTask)
                .map(n => {
                    assert(n).equal(12);
                    done();
                }).fork(() => { }, () => { });

        });

        it('should not swallow errors', done => {

            let promiseErrTask = (): Promise<{}> => new Promise((_, n) => {

                setTimeout(() => n(new Error('promise')), 500);

            });

            liftP<{}>(promiseErrTask)
                .catch(e => {

                    assert(e.message).equal('promise');
                    done();
                    return pure({});

                }).fork(console.error, console.log);

        });

    });

    describe('doFuture', () => {

        it('should work', () => {

            let fn1 = () => pure(1);
            let fn2 = (n: number) => pure(n + 1);
            let fn3 = (n: number) => pure(n + n);

            return toPromise<number>(doFuture<number>(function*() {

                let val1 = yield fn1();
                let val2 = yield fn2(val1);
                let val3 = yield fn3(val2);

                return pure(val3);

            }))
                .then(v => { assert(v).equal(4); });
        });
    });
});
