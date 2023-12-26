import { assert } from '@quenk/test/lib/assert';

import { Any, test, toString, isNull } from '../../src/data/type';

class Point {
    x = 12;
    y = 12;
}

describe('type', () => {
    describe('test', () => {
        it('must match literals', () => {
            assert(test(1, 1)).equal(true);
            assert(test('one', 'one')).equal(true);
            assert(test(true, true)).equal(true);
            assert(test(false, false)).equal(true);

            assert(test(12, 1)).equal(false);
            assert(test('one', 'two')).equal(false);
            assert(test(true, false)).equal(false);
            assert(test(false, true)).equal(false);
        });

        it('must match builtins', () => {
            assert(test(Number, 1)).equal(true);
            assert(test(String, 'one')).equal(true);
            assert(test(Boolean, true)).equal(true);
            assert(test(Boolean, false)).equal(true);
        });

        it('must match constructors', () => {
            assert(test(Point, new Point())).equal(true);
            assert(test(Point, Point)).equal(false);
        });

        it('must match shapes', () => {
            assert(test({ x: Number, y: 12 }, new Point())).equal(true);
            assert(test({ x: Number, y: 12 }, { y: 12 })).equal(false);
        });

        it('should match regular expressions', () => {
            assert(test(/^jaws/, 'Do you know the movie jaws?')).equal(false);
            assert(test(/^jaws/, 'jaws? yeah I know it.')).equal(true);
        });

        it('should match Any', () => {
            assert(test(Any, 'A string')).equal(true);
            assert(test(Any, 12)).equal(true);
            assert(test(Any, false)).equal(true);
            assert(test(Any, {})).equal(true);
        });
    });

    describe('toString', () => {
        it('should work', () => {
            assert(toString(undefined)).equal('');
            assert(toString(null)).equal('');
            assert(toString({})).equal('[object Object]');
            assert(toString([])).equal('');
        });
    });

    describe('isNull', () => {
        it('should work', () => {
            assert(isNull(undefined)).true();
            assert(isNull(null)).true();
            assert(isNull('undefined')).false();
            assert(isNull('null')).false();
            assert(isNull('')).false();
            assert(isNull(0)).false();
            assert(isNull([])).false();
            assert(isNull({})).false();
        });
    });
});
