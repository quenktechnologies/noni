import { assert } from '@quenk/test/lib/assert';
import { Any, test } from '../../src/data/type';

class Point {

    x = 12
    y = 12

}

describe('test', function() {

    it('must match literals', function() {

        assert(test(1, 1)).equal(true);
        assert(test('one', 'one')).equal(true);
        assert(test(true, true)).equal(true);
        assert(test(false, false)).equal(true);

        assert(test(1, 12)).equal(false);
        assert(test('one', 'two')).equal(false);
        assert(test(true, false)).equal(false);
        assert(test(false, true)).equal(false);

    });

    it('must match builtins', function() {

        assert(test(1, Number)).equal(true);
        assert(test('one', String)).equal(true);
        assert(test(true, Boolean)).equal(true);
        assert(test(false, Boolean)).equal(true);

    });

    it('must match constructors', function() {

        assert(test(new Point(), Point)).equal(true);
        assert(test(Point, Point)).equal(false);

    });

    it('must match shapes', function() {

        assert(test(new Point(), { x: Number, y: 12 })).equal(true);
        assert(test({ y: 12 }, { x: Number, y: 12 })).equal(false);

    });

    it('should match regular expressions', function() {

        assert(test('Do you know the movie jaws?', /^jaws/)).equal(false);
        assert(test('jaws? yeah I know it.', /^jaws/)).equal(true);

    });

    it('should match Any', function() {

        assert(test('A string', Any)).equal(true);
        assert(test(12, Any)).equal(true);
        assert(test(false, Any)).equal(true);
        assert(test({}, Any)).equal(true);

    });

});
