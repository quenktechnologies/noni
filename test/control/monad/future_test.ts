import * as functor from '../../checks/functor';
import * as apply from '../../checks/apply';
import * as applicative from '../../checks//applicative';
import * as chain from '../../checks/chain';
import * as monad from '../../checks/monad';
import { assert } from '@quenk/test/lib/assert';
import { noop } from '../../../src/data/function';
import {
    Future,
    Run,
    pure,
    attempt,
    delay,
    wait,
    fromCallback,
    raise,
    sequential,
    reduce,
    batch,
    parallel,
    toPromise,
    liftP,
    race,
    some,
    doFuture
} from '../../../src/control/monad/future';

const value = 12;

const eq =
    <A>(f1: Future<A>) =>
    (f2: Future<A>) =>
        toPromise<A>(f1).then((a: A) =>
            toPromise<A>(f2).then((b: A) => assert(<any>a).equate(<any>b))
        );

const map = (n: number) => n * 2;

const bind = (n: number) => pure(n * 1);

const inc = (n: number) => new Run<number>(async () => n + 1);

const err = <T>(msg: string) =>
    new Run<T>(async () => {
        throw new Error(msg);
    });

const errorTask = (m: string, delay: number, tags: string[]) =>
    new Run(
        () =>
            new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error(m));
                    tags.push(m);
                }, delay);

                return noop;
            })
    );

const tagTask = (tag: string, n: number, tags: string[]) =>
    new Run<number>(
        () =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(n);
                    tags.push(tag);
                }, n);
                return noop;
            })
    );

const promiseTask = () =>
    new Promise(y => {
        setTimeout(() => y(12), 1000);
    });

describe('future', () => {
    describe('Future', () => {
        describe('Functor', () => {
            it('should obey the identity law', () =>
                functor.identity(pure)(eq)(value));

            it('should obey the composition law', () =>
                functor.composition<number>(pure)(eq)(map)(map)(value));
        });

        describe('Apply', () => {
            it('should obey the composition law', () =>
                apply.composition<number>(pure)(eq)(map)(map)(value));
        });

        describe('Applicative', () => {
            it('should obey the identity law', () =>
                applicative.identity(pure)(eq)(value));

            it('should obey the homomorphism law', () =>
                applicative.identity(pure)(eq)(value));
        });

        describe('Chain', () => {
            it('should obey the associativity law', () =>
                chain.associativity(pure)(eq)(value));
        });

        describe('Monad', () => {
            it('should obey the left identity law', () =>
                monad.leftIdentity<number>(pure)(eq)(bind)(value));
        });

        describe('fork', () => {
            let msg = 'error';

            it('should provide the final value', () =>
                new Promise<number>((res: any, rej: any) =>
                    inc(0).fork(rej, res)
                ).then((value: number) => assert(value).equal(1)));

            it('should provide the error', () =>
                new Promise((res: any, rej: any) =>
                    err(msg).fork(rej, res)
                ).catch((e: Error) => assert(e.message).equal(msg)));

            it('should have default parameters', () => inc(0).fork());
        });

        describe('map', () => {
            it('should never result in error and success', () =>
                toPromise(
                    inc(0)
                        .map(map)
                        .chain((n: number) => err<number>(`error: ${n}`))
                        .map(map)
                )
                    .then(() => Promise.reject('Map did not reject!'))
                    .catch((e: Error) => assert(e.message).equal('error: 2')));
        });

        describe('ap', () => {
            let ap = pure(map);

            it('should never result in error and success', () =>
                toPromise(
                    inc(0)
                        .ap(ap)
                        .chain((n: number) => err<number>(`error: ${n}`))
                        .ap(ap)
                )
                    .then(() => Promise.reject('Ap did not reject!'))
                    .catch((e: Error) => assert(e.message).equal('error: 2')));
        });

        describe('chain', () => {
            it('should never result in error and success', () =>
                toPromise(
                    inc(0)
                        .chain((n: number) => err<number>(`error: ${n}`))
                        .chain(inc)
                )
                    .then(() => Promise.reject('Chain did not reject!'))
                    .catch((e: Error) => assert(e.message).equal('error: 1')));
        });

        describe('trap', () => {
            it('should allow errors to be caught', () =>
                inc(0)
                    .chain(inc)
                    .chain(inc)
                    .chain(() => err('foo'))
                    .trap((e: Error) => pure(assert(e.message).equal('foo'))));

            it('should not duplicate errors', () =>
                inc(0)
                    .chain(inc)
                    .chain(inc)
                    .chain(() => err('foo'))
                    .trap((e: Error) => pure(assert(e.message).equal('foo')))
                    .trap((e: Error) => pure(assert(e).equal('foo'))));

            it('should not swallow further errors', cb => {
                inc(0)
                    .chain(inc)
                    .chain(() => err('first'))
                    .trap((_: Error) => inc(0))
                    .chain(() => err('second'))
                    .catch(e => {
                        assert(e.message).be.equal('second');

                        cb();
                    });
            });
        });

        describe('run', () => {
            it('should not execute before the Future is forked', () => {
                let x = 0;

                let future = Future.do(async () => {
                    await x++;
                });

                future.run();

                assert(x).equal(0);
            });
        });

        describe('finish', () => {
            it('should run after success', () =>
                inc(0)
                    .chain(inc)
                    .finish(() => pure(12))
                    .then((n: number) => assert(n).equal(12)));

            it('should run after failure', () =>
                inc(0)
                    .chain(inc)
                    .chain(() => err('foo'))
                    .trap((e: Error) => pure(assert(e.message).equal('foo')))
                    .finish(() => pure(12))
                    .then((n: number) => assert(n).equal(12)));
        });

        describe('chain', () => {
            it('should not duplicate operations', async () => {
                let count = 0;
                let m = () => {
                    count = count + 1;
                    return pure(count);
                };

                let result = await pure(0).chain(m).chain(m).chain(m);

                assert(result).equal(3);
            });
        });

        describe('do', () => {
            it('should execute the body', async () => {
                let result = await Future.do(async () => {
                    let x = await pure(0);

                    x = await inc(x);

                    x = await inc(x);

                    return x + 1;
                });

                assert(result).equal(3);
            });

            it('should return a Future', done => {
                let result = Future.do(async () => 12);

                assert(result).be.instance.of(Future);

                result.fork(
                    () => {},
                    val => {
                        assert(val).equal(12);

                        done();
                    }
                );
            });

            it('should not execute before the Future is forked', done => {
                let x = 0;

                let result = Future.do(async () => {
                    await x++;
                });

                assert(x).equal(0);

                result.fork(
                    () => {},
                    () => {
                        assert(x).equal(1);

                        done();
                    }
                );
            });
        });

        describe('trap', () => {
            it('should not recusively call itself when a Raise is returned', async () => {
                let error = (msg: string) => raise(new Error(msg));
                let ok = true;

                try {
                    await error('BOOM').trap(e =>
                        raise(new Error(`KA${e.message}`))
                    );
                } catch (e) {
                    assert((<Error>e).message).equal('KABOOM');
                    ok = true;
                }

                assert(ok).true();
            });
        });
    });

    describe('attempt', () => {
        it('should trap errors', async () => {
            let str = await attempt(() => {
                throw new Error('foo');
            })
                .chain(inc)
                .trap((e: Error) => pure(e.message));

            assert(str).equal('foo');
        });

        it('should work otherwise', () =>
            toPromise(attempt(() => 11).chain(inc)).then((n: number) =>
                assert(n).equal(12)
            ));
    });

    describe('delay', () => {
        it('should delay results', () =>
            toPromise(delay(() => 11).chain(inc)).then((n: number) =>
                assert(n).equal(12)
            ));
    });

    describe('wait', () => {
        it('should pause chain execution', async () => {
            let then = Date.now();

            return wait(1000).chain((): Future<void> => {
                let x = Date.now() - then;

                if (x < 1000)
                    return <Future<void>>(
                        raise(
                            new Error(
                                `waited ${x} milliseconds ` + `instead of 1000`
                            )
                        )!
                    );
                else return <Future<void>>pure(undefined);
            });
        });
    });

    describe('fromCallback', () => {
        it('should work', cb => {
            let f = (node: (e: Error, a: number) => void) =>
                setTimeout(() => node(<any>undefined, 12), 100);

            let raise = (e: Error) => {
                cb(e);
            };

            let success = (n: any) => {
                assert(n).equal(12);
                cb();
            };

            fromCallback(cb => f(cb)).fork(raise, success);
        });
    });

    describe('sequential', () => {
        it('should fail if any fail', async () => {
            let tags: string[] = [];
            let failed = false;

            await sequential([
                tagTask('a', 1000, tags),
                errorTask('m', 2000, tags),
                errorTask('foo', 500, tags),
                tagTask('d', 200, tags)
            ]).trap((e: Error) => {
                if (e.message === 'm') failed = true;

                return pure(tags);
            });

            assert(failed).be.true();
            assert(tags).equate(['a', 'm']);
        });

        it('should succeed with all results', () => {
            let tags: string[] = [];

            return sequential([
                tagTask('a', 300, tags),
                tagTask('b', 200, tags),
                tagTask('c', 500, tags),
                tagTask('d', 600, tags)
            ])
                .then((list: number[]) => {
                    assert(list).equate([300, 200, 500, 600]);
                })
                .then(() => assert(tags).equate(['a', 'b', 'c', 'd']));
        });

        it('should work when the list is empty', () => {
            return toPromise(sequential([])).then((list: any[]) =>
                assert(list).equate([])
            );
        });

        it('should work with a list of pure values', () => {
            return toPromise(sequential([pure(1), pure(2), pure(3)])).then(
                (list: number[]) => assert(list).equate([1, 2, 3])
            );
        });

        it('should work with a list of failed values', () => {
            let failed = false;

            let seq: Future<undefined[]> = sequential([
                <Future<undefined>>raise(new Error('1')),
                <Future<undefined>>raise(new Error('2'))
            ]);

            return;
            seq.trap((e: Error) => {
                if (e.message === '1') failed = true;

                return pure(<undefined[]>[]);
            }).then(() => assert(failed).be.true());
        });
    });

    describe('reduce', () => {
        it('should reduce a list', () =>
            toPromise(reduce([1, 2, 3], 0, (p, c) => pure(p + c))).then(value =>
                assert(value).equal(6)
            ));

        it('should fail if any fail', () => {
            let failed = false;

            return reduce([1, 2, 3, 4], 0, (p, c, k) =>
                k === 2 ? raise(new Error('not allowed')) : pure(p + c)
            )
                .trap((e: Error) => {
                    if (e.message === 'not allowed') failed = true;

                    return pure(6);
                })
                .then(() => {
                    assert(failed).be.true();
                });
        });

        it('should work when the list is empty', () => {
            return toPromise(reduce([], 12, (p, c) => pure(p + c))).then(
                (r: number) => assert(r).equal(12)
            );
        });
    });

    describe('batch', () => {
        it('should fail if any fail', async () => {
            let tags: string[] = [];
            let failed = false;

            await batch([
                [tagTask('a', 1000, tags), tagTask('a', 2000, tags)],
                [errorTask('m', 1000, tags)],
                [errorTask('foo', 500, tags)],
                [tagTask('d', 200, tags)]
            ]).trap((e: Error) => {
                if (e.message === 'm') failed = true;

                return pure([tags]);
            });

            assert(failed).be.true();
            assert(tags).equate(['a', 'a', 'm']);
        });

        it('should succeed with all results', () => {
            let tags: string[] = [];

            return toPromise(
                batch([
                    [
                        tagTask('a', 300, tags),
                        tagTask('a', 600, tags),
                        tagTask('a', 100, tags)
                    ],
                    [tagTask('b', 200, tags)],
                    [tagTask('c', 300, tags), tagTask('c', 500, tags)],
                    [tagTask('d', 200, tags), tagTask('d', 600, tags)]
                ])
            )
                .then((list: number[][]) =>
                    assert(list).equate([
                        [300, 600, 100],
                        [200],
                        [300, 500],
                        [200, 600]
                    ])
                )
                .then(() =>
                    assert(tags).equate([
                        'a',
                        'a',
                        'a',
                        'b',
                        'c',
                        'c',
                        'd',
                        'd'
                    ])
                );
        });

        it('should work when the list is empty', () => {
            return toPromise(batch([])).then((list: any[]) =>
                assert(list).equate([])
            );
        });

        it('should work with a list of pure values', () => {
            return toPromise(batch([[pure(1), pure(2)], [pure(3)]])).then(
                (list: number[][]) => assert(list).equate([[1, 2], [3]])
            );
        });

        it('should work with a list of failed values', () => {
            let failed = false;

            return batch([[raise(new Error('1')), raise(new Error('2'))]])
                .trap((e: Error) => {
                    if (e.message === '1') failed = true;

                    return pure(<any[]>[]);
                })
                .then(() => {
                    assert(failed).be.true();
                });
        });
    });

    describe('parallel', () => {
        it('should fail if any fail', async () => {
            let failed = false;
            let tags: string[] = [];

            let tasks = [
                tagTask('a', 1000, tags),
                errorTask('m', 2000, tags),
                errorTask('foo', 500, tags),
                tagTask('bar', 200, tags)
            ];

            await parallel(tasks).trap((e: Error) => {
                if (e.message === 'foo') failed = true;
                return pure(<{}[]>[]);
            });

            assert(failed).equal(true);
        });

        it('should succeed with all results', () => {
            let tags: string[] = [];

            return toPromise(
                parallel([
                    tagTask('a', 300, tags),
                    tagTask('b', 200, tags),
                    tagTask('c', 500, tags),
                    tagTask('d', 300, tags),
                    tagTask('e', 600, tags)
                ])
            ).then((list: number[]) =>
                assert(list).equate([300, 200, 500, 300, 600])
            );
        });

        it('should work when the list is empty', () => {
            return toPromise(parallel([])).then((list: any[]) =>
                assert(list).equate([])
            );
        });

        it('should work with a list of pure values', () => {
            return toPromise(parallel([pure(1), pure(2), pure(3)])).then(
                (list: number[]) => assert(list).equate([1, 2, 3])
            );
        });

        it('should work with a list of raise values', () => {
            let e = new Error('a');
            let failed = false;

            let par: Future<undefined[]> = parallel([
                raise(e),
                raise(e),
                raise(e)
            ]);

            return;
            par.trap((e: Error) => {
                if (e.message === 'a') failed = true;

                return pure(<undefined[]>[]);
            }).then(() => assert(failed).be.true());
        });

        it('should work with a list of failed values', () => {
            let failed = false;

            return;
            parallel([raise(new Error('1')), raise(new Error('2'))])
                .trap((e: Error) => {
                    if (e.message === '1') failed = true;

                    return pure(<any[]>[]);
                })
                .then(() => {
                    assert(failed).be.true();
                });
        });
    });

    describe('race', () => {
        it('should fail on the first error', async () => {
            let tags: string[] = [];

            let failed = false;

            await race([
                tagTask('a', 1000, tags),
                tagTask('b', 2000, tags),
                errorTask('c', 100, tags),
                tagTask('d', 500, tags),
                tagTask('e', 800, tags)
            ]).trap((e: Error) => {
                if (e.message === 'c') failed = true;

                return pure(tags);
            });

            assert(failed).be.true();
        });

        it('should succeed with the first successfull value', () => {
            return toPromise(
                race([
                    tagTask('a', 1000, []),
                    tagTask('b', 2000, []),
                    tagTask('c', 500, []),
                    tagTask('d', 200, []),
                    tagTask('e', 800, [])
                ])
            ).then((n: number) => assert(n).equal(200));
        });

        it('should fail when the list is empty', () => {
            return toPromise(race([]))
                .then(() => {
                    throw new Error('bleh');
                })
                .catch((e: Error) =>
                    assert(e.message).equal(
                        'race(): Cannot race an empty list!'
                    )
                );
        });

        it('should work with a list of pure values', () => {
            return toPromise<number>(race([pure(1), pure(2), pure(3)])).then(
                (list: number) => assert(list).equal(1)
            );
        });

        it('should work with a list of failed values', () => {
            let failed = false;

            return race([raise(new Error('1')), raise(new Error('2'))])
                .trap((e: Error) => {
                    if (e.message === '1') failed = true;

                    return pure(<any>[]);
                })
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
                })
                .fork(
                    () => {},
                    () => {}
                );
        });

        it('should not swallow errors', done => {
            let promiseErrTask = (): Promise<{}> =>
                new Promise((_, n) => {
                    setTimeout(() => n(new Error('promise')), 500);
                });

            liftP<{}>(promiseErrTask)
                .trap(e => {
                    assert(e.message).equal('promise');
                    done();
                    return pure({});
                })
                .fork();
        });
    });

    describe('doFuture', () => {
        it('should work', () => {
            let fn1 = () => pure(1);
            let fn2 = (n: number) => pure(n + 1);
            let fn3 = (n: number) => pure(n + n);

            return toPromise<number>(
                doFuture<number>(function* () {
                    let val1 = yield fn1();
                    let val2 = yield fn2(val1);
                    let val3 = yield fn3(val2);

                    return pure(val3);
                })
            ).then(v => {
                assert(v).equal(4);
            });
        });
    });

    describe('some', () => {
        it('should work with a list of successes', async () => {
            let result = await some([pure(1), pure(2), pure(3)]);

            assert(result).equal(1);
        });

        it('should work with a mix for success', async () => {
            let result = await some([
                raise(new Error()),
                pure(2),
                raise(new Error())
            ]);

            assert(result).equal(2);
        });

        it('should give the last failure', async () => {
            let threw = false;

            try {
                await some([
                    raise(new Error('1')),
                    raise(new Error('2')),
                    raise(new Error('3'))
                ]);
            } catch (e) {
                threw = true;

                assert((<Error>e).message).equal('3');
            }

            assert(threw).true();
        });
    });
});
