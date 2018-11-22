import { must } from '@quenk/must';
import {
    head,
    tail,
    contains,
    empty,
    map,
    partition,
    group
} from '../../src/data/array';

describe('array', () => {

    describe('head', () => {

        it('should return the first element', () => {

            must(head([9, 4, 3, 29, 9, 8])).equal(9);

        });

    });

    describe('tail', () => {

        it('should return the last element', () => {

            must(tail([349, 434, 1341, 2, 12])).equal(12);

        });

    });

    describe('contains', () => {

        it('should work', () => {

            must(contains([1, 2, 3])(2)).equal(true);
            must(contains([1, 2, 3])(4)).equal(false);

        });

    })

    describe('empty', () => {

        it('should work', () => {

            must(empty([])).equal(true);
            must(empty([1, 2, 3])).equal(false);

        });

    })

    describe('map', () => {

        it('should map over all elements', () => {

            must(map(([2, 4, 6]))((n: number) => n * n)).equate([4, 16, 36]);

        });

    });

    describe('partition', () => {

        it('should not partition elements', () => {

            let m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            let f = (n: number) => ((n % 2) === 0)
            let r = [[2, 4, 6, 8, 10], [1, 3, 5, 7, 9]];

            must(partition(m)(f)).equate(r);

        });

        it('should not blow up on empty arrays', () => {

            must(partition([])((n: number) => n > 1)).equate([[], []]);

        });

    });

    describe('group', () => {

        it('should group elements', () => {

            let m = [1, 'b', 22, 'e', { n: 'o' }, 12];
            let f = (n: number | string | object) => typeof (n);
            let r = {
                number: [1, 22, 12],
                string: ['b', 'e'],
                object: [{ n: 'o' }]
            }

            must(group(m)(f)).equate(r);

        })
    })
})
