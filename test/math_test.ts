import { must } from '@quenk/must';
import { isMultipleOf } from '../src/math';

describe('math', () => {

    describe('isMultipleOf', () => {

        it('should work', () => {

            must(isMultipleOf(3, 9)).be.true();
            must(isMultipleOf(2, 5)).be.false();
            must(isMultipleOf(0, 1)).be.false();

        });

    });

});
