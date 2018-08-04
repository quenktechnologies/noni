import * as must from 'must/register';
import { curry, curry3, curry4, curry5 } from '../../src/data/function';

describe('function', () => {

    const f = (...xs: number[]) => xs.reduce((s, x) => s * x);

    describe('curry', () => {

        it('should work', () => {

            must(curry(f)(1)(2)).be(2);
            must(curry3(f)(1)(2)(3)).be(6);
            must(curry4(f)(1)(2)(3)(4)).be(24);
            must(curry5(f)(1)(2)(3)(4)(5)).be(120);

        })

    })

})
