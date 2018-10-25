import * as must  from 'must/register';
import { attempt } from '../../src/control/error';

describe('error', () => {

    describe('attempt', () => {

        it('should work', () => {

            let _throw = () => { throw new Error('foo'); }
            let _noes = () => 12;

            must(attempt(_throw).takeLeft().message).be('foo');
            must(attempt(_noes).takeRight()).be(12);

        })
    })

})

