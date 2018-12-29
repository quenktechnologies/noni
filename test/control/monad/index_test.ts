import { must } from '@quenk/must';
import { Identity, pure } from '../../../src/data/indentity';
import { $do } from '../../../src/control/monad';

describe('monad', () => {

    describe('do$', () => {

        it('should work', () => {

            must($do<number, Identity<number>>(function* () {

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

