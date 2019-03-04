import { assert } from '@quenk/test/lib/assert';
import { Identity, pure } from '../../../src/data/indentity';
import { doN } from '../../../src/control/monad';

describe('monad', () => {

    describe('do$', () => {

        it('should work', () => {

            assert(doN<number, Identity<number>>(function* () {

                let a = yield pure(1);
                let b = yield pure(a + 1);
                let c = yield pure(b + 1);
                let d = yield pure(c + 1);
                let e = yield pure(d * 3);

                return e;

            })).equal(12);


        });

    });

});

