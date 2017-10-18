import * as must from 'must/register';
import * as curry from '../src/curry';

describe('curry', () => {

    const f = (...xs: number[]) => xs.reduce((s, x) => s * x);

    it('f1', function() {

        must(curry.f1(f)(1)).be(1);

    });

    it('f2', function() {

        must(curry.f2(f)(1)(2)).be(2);

    });

    it('f3', function() {

        must(curry.f3(f)(1)(2)(3)).be(6);

    });

    it('f4', function() {

        must(curry.f4(f)(1)(2)(3)(4)).be(24);

    });

    it('f5', function() {

        must(curry.f5(f)(1)(2)(3)(4)(5)).be(120);

    });

});
