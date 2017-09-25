import * as must from 'must/register';
import * as util from '../src/util';

describe('util', () => {

    describe('fuse', () =>
        it('should merge objects deeply', () =>
            must(util.fuse<object, object>(
                { a: 1, b: '2', c: { d: 3, e: { f: '4' }, g: '5', h: [1] } },
                { c: { e: { e1: 6 } } },
                { c: { c1: 'c1' } },
                { c: { h: [2, 3, 4, 5, 6] } },
                { b: { bv: 'b2' } },
                { a: {} })).eql(
                {
                    a: {},
                    b: { 0: "2", bv: 'b2' }, // the 2 appears to be the result of Object.assign with a non object
                    c: {
                        h: [1, 2, 3, 4, 5, 6],
                        c1: 'c1',
                        d: 3,
                        e: { f: '4', e1: 6 },
                        g: '5'
                    }
                })));

    describe('partial application', function() {

        const f = (...xs: number[]) => xs.reduce((s, x) => s * x);

        it('f1', function() {

            must(util.f1(f)(1)).be(1);
            must(util.f1(f, 1)(2)).be(2);
            must(util.f1(f, 1, 2, 3)(4)).be(24);

        });

        it('f2', function() {

            must(util.f2(f)(1)(2)).be(2);
            must(util.f2(f, 1)(2)(3)).be(6);
            must(util.f2(f, 1, 2, 3)(4)(5)).be(120);

        });

        it('f3', function() {

            must(util.f3(f)(1)(2)(3)).be(6);
            must(util.f3(f, 1)(2)(3)(4)).be(24);
            must(util.f3(f, 1, 2, 3)(4)(5)(6)).be(720);

        });

        it('f4', function() {

            must(util.f4(f)(1)(2)(3)(4)).be(24);
            must(util.f4(f, 1)(2)(3)(4)(5)).be(120);
            must(util.f4(f, 1, 2, 3)(4)(5)(6)(7)).be(5040);

        });

        it('f5', function() {

            must(util.f5(f)(1)(2)(3)(4)(5)).be(120);
            must(util.f5(f, 1,2)(3)(4)(5)(6)(7)).be(5040);
            must(util.f5(f, 1, 2, 3)(4)(5)(6)(7)(8)).be(40320);

        });

    });

    describe('except', function () {

        it('should remove unwanted keys', function() {

          must(util.except(['one','two','three'], {one:1,two:2,three:3,four:4,five:5,six:6}))
          .eql({four:4, five:5, six:6});
          
        });
      
    });

});



