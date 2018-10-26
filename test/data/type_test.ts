import * as must from 'must/register';
import { Any, test } from '../../src/data/type';

class Point {

    x = 12
    y = 12

}

describe('test', function() {

    it('must match literals', function() {

        must(test(1, 1)).be(true);
        must(test('one', 'one')).be(true);
        must(test(true, true)).be(true);
        must(test(false, false)).be(true);

        must(test(1, 12)).be(false);
        must(test('one', 'two')).be(false);
        must(test(true, false)).be(false);
        must(test(false, true)).be(false);

    });

    it('must match builtins', function() {

        must(test(1, Number)).be(true);
        must(test('one', String)).be(true);
        must(test(true, Boolean)).be(true);
        must(test(false, Boolean)).be(true);

    });

    it('must match constructors', function() {

        must(test(new Point(), Point)).be(true);
        must(test(Point, Point)).be(false);

    });

    it('must match shapes', function() {

        must(test(new Point(), { x: Number, y: 12 })).be(true);
        must(test({ y: 12 }, { x: Number, y: 12 })).be(false);

    });

    it('should match regular expressions', function() {

        must(test('Do you know the movie jaws?', /^jaws/)).be(false);
        must(test('jaws? yeah I know it.', /^jaws/)).be(true);

    });

    it('should match Any', function() {

        must(test('A string', Any)).be(true);
        must(test(12, Any)).be(true);
        must(test(false, Any)).be(true);
        must(test({}, Any)).be(true);

    });

});



