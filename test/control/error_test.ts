import { must } from '@quenk/must';
import { attempt } from '../../src/control/error';

describe('error', () => {

    describe('attempt', () => {

        it('should work', () => {

            let _throw = () => { throw new Error('foo'); }
            let _noes = () => 12;

            must(attempt(_throw).takeLeft().message).equal('foo');
            must(attempt(_noes).takeRight()).equal(12);

        })
    })

})

