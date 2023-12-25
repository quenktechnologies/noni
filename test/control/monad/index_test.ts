import { assert } from '@quenk/test/lib/assert';
import { Identity, pure } from '../../../src/data/indentity';
import { doN, compose, pipe, pipeN } from '../../../src/control/monad';

const f1 = (a: number): Identity<number> => new Identity(a / 3);
const f2 = (b: number): Identity<number> => new Identity(b / 2);

describe('monad', () => {
    describe('doN', () => {
        it('should work', () => {
            assert(
                doN<number, Identity<number>>(function* () {
                    let a = yield pure(1);
                    let b = yield pure(a + 1);
                    let c = yield pure(b + 1);
                    let d = yield pure(c + 1);
                    let e = yield pure(d * 3);

                    yield pure('string');

                    return pure(e);
                }).value
            ).equal(12);
        });
    });

    describe('compose', () => {
        it('should work', () => {
            let f = compose<
                number,
                number,
                number,
                Identity<number>,
                Identity<number>
            >(f2, f1);

            assert((<Identity<number>>f(12)).value).equal(2);
        });
    });

    describe('pipe', () => {
        it('should work', () => {
            let f = pipe<
                number,
                number,
                number,
                Identity<number>,
                Identity<number>
            >(f1, f2);

            assert((<Identity<number>>f(12)).value).equal(2);
        });
    });

    describe('pipeN', () => {
        it('should work', () => {
            let f = pipeN(f1, f2, f1);
            assert((<Identity<number>>f(36)).value).equal(2);
        });
    });
});
