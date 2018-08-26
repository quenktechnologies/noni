import * as must from 'must/register';
import { head, tail, map, partition } from '../../src/data/array';

describe('array', () => {

    describe('head', () => {

        it('should return the first element', () => {

            must(head([9, 4, 3, 29, 9, 8])).be(9);

        });

    });

    describe('tail', () => {

        it('should return the last element', () => {

            must(tail([349, 434, 1341, 2, 12])).be(12);

        });

    });

    describe('map', () => {

        it('should map over all elements', () => {

            must(map(([2, 4, 6]))((n: number) => n * n)).eql([4, 16, 36]);

        });

    });

    describe('partition', () => {

        it('should not partition elements', () => {

            let m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            let f = (n: number) => ((n % 2) === 0)
            let r = [[2, 4, 6, 8, 10], [1, 3, 5, 7, 9]];

            must(partition(m)(f)).eql(r);

        });

    });

});
