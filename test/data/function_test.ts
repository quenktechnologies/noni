import { assert } from '@quenk/test/lib/assert';
import { apply, apply3, apply4, apply5, curry, curry3, curry4, curry5, flip } from '../../src/data/function';

describe('function', () => {

    const f = (...xs: number[]) => xs.reduce((s, x) => s * x);

    describe('curry', () => {

        it('should work', () => {

            assert(curry(f)(1)(2)).equal(2);
            assert(curry3(f)(1)(2)(3)).equal(6);
            assert(curry4(f)(1)(2)(3)(4)).equal(24);
            assert(curry5(f)(1)(2)(3)(4)(5)).equal(120);

        })

    })

    describe('flip', () => {

        it('should flip arguments', () => {

            let f = (n: number) => (s: string) => [s, n];
            let flipped = flip(f);

            assert(flipped('num')(1)).equate(['num', 1]);

        });

    });

    describe('apply', () => {

        it('should apply arguments', () => {
            let f = apply((a: number, b: number) => a + b, 10);
            assert(typeof f === 'function').true();
            assert(f(10)).equal(20);
        });

    });

    describe('apply3', () => {

        it('should apply arguments', () => {
            let f = apply3((a: number, b: number, c: number) => a + b + c, 10, 20);
            assert(typeof f === 'function').true();
            assert(f(30)).equal(60);
        });

    });

    describe('apply4', () => {

        it('should apply arguments', () => {
            let f = apply4((a: number, b: number, c: number, d: number) => a + b + c + d, 10, 20, 30);
            assert(typeof f === 'function').true();
            assert(f(60)).equal(120);
        });

    });

    describe('apply5', () => {

        it('should apply arguments', () => {
            let f = apply5((a: number, b: number, c: number, d: number, e: number) => 
              a + b + c + d + e, 10, 20, 30, 40);
            assert(typeof f === 'function').true();
            assert(f(100)).equal(200);
        });

    });

})
