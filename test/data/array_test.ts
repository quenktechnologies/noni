import { assert } from '@quenk/test/lib/assert';
import {
    head,
    tail,
    contains,
    empty,
    map,
    partition,
    group,
    distribute,
    dedupe,
    remove,
    removeAt
} from '../../src/data/array';

describe('array', () => {

    describe('head', () => {

        it('should return the first element', () => {

            assert(head([9, 4, 3, 29, 9, 8])).equal(9);

        });

    });

    describe('tail', () => {

        it('should return the last element', () => {

            assert(tail([349, 434, 1341, 2, 12])).equal(12);

        });

    });

    describe('contains', () => {

        it('should work', () => {

            assert(contains([1, 2, 3])(2)).equal(true);
            assert(contains([1, 2, 3])(4)).equal(false);

        });

    })

    describe('empty', () => {

        it('should work', () => {

            assert(empty([])).equal(true);
            assert(empty([1, 2, 3])).equal(false);

        });

    })

    describe('map', () => {

        it('should map over all elements', () => {

            assert(map(([2, 4, 6]))((n: number) => n * n)).equate([4, 16, 36]);

        });

    });

    describe('partition', () => {

        it('should not partition elements', () => {

            let m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            let f = (n: number) => ((n % 2) === 0)
            let r = [[2, 4, 6, 8, 10], [1, 3, 5, 7, 9]];

            assert(partition(m)(f)).equate(r);

        });

        it('should not blow up on empty arrays', () => {

            assert(partition([])((n: number) => n > 1)).equate([[], []]);

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

            assert(group(m)(f)).equate(r);

        })
    });

    describe('distribtue', () => {

        it('should work when array length is a multiple', () => {

            assert(distribute([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 3))
                .equate([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]);

        });

        it('should work when array length is not a multiple', () => {

            assert(distribute([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 5))
                .equate([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12]]);

        });

        it('should work when array length is less than the size', () => {

            assert(distribute([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 20))
                .equate([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]);

        });

        it('should work with empty arrays', () => {

            assert(distribute([], 3)).equate([]);

        });

        it('should work with odd numbered arrays', () => {

            assert(distribute([1, 2, 3, 4], 3))
                .equate([[1, 2, 3], [4]]);

        });

    });

    describe('dedupe', () => {

        it('should remove duplicates', () => {

            assert(dedupe([1, 2, 3, 44, 5, 6, 7, 1, 2, 3, 6, 7, 4]))
                .equate([1, 2, 3, 44, 5, 6, 7, 4]);

        });

        it('should not change already deduped arrays', () => {

            assert(dedupe([1, 2, 3, 4, 5, 6, 7, 8, 9]))
                .equate([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        });

    });

    describe('remove', () => {

        it('should remove the target', () => {

            let a = { a: 1 };
            let b = { b: 1 };
            let c = { c: 1 };

            let list = [a, b, c, 3];

            assert(remove(list, b)).equate([a, c, 3]);
            assert(list).equate([a, b, c, 3]);

        });

    });

    describe('removeAt', () => {

        it('should remove the target', () => {

            let a = { a: 1 };
            let b = { b: 1 };
            let c = { c: 1 };

            let list = [a, b, c, 3];

            assert(removeAt(list, 2)).equate([a, b, 3]);
            assert(list).equate([a, b, c, 3]);

        });

    })

})
