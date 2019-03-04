import { assert } from '@quenk/test/lib/assert';
import { isMultipleOf } from '../src/math';

describe('math', () => {

    describe('isMultipleOf', () => {

        it('should work', () => {

            assert(isMultipleOf(3, 9)).be.true();
            assert(isMultipleOf(2, 5)).be.false();
            assert(isMultipleOf(0, 1)).be.false();

        });

    });

});
