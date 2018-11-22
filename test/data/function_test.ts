import {must} from '@quenk/must';
import { curry, curry3, curry4, curry5, flip } from '../../src/data/function';

describe('function', () => {

    const f = (...xs: number[]) => xs.reduce((s, x) => s * x);

    describe('curry', () => {

        it('should work', () => {

            must(curry(f)(1)(2)).equal(2);
            must(curry3(f)(1)(2)(3)).equal(6);
            must(curry4(f)(1)(2)(3)(4)).equal(24);
            must(curry5(f)(1)(2)(3)(4)(5)).equal(120);

        })

    })

    describe('flip', () => {

        it('should flip arguments', () => {

          let f = (n:number) => (s:string) => [s, n];
          let flipped = flip(f);

          must(flipped('num')(1)).equate(['num', 1]);
          
        });
      
    });

})
