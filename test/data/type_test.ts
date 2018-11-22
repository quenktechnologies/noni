import { must } from '@quenk/must';
import { Any, test } from '../../src/data/type';

class Point {

    x = 12
    y = 12

}

describe('test', function() {

    it('must match literals', function() {

        must(test(1, 1)).equal(true);
        must(test('one', 'one')).equal(true);
        must(test(true, true)).equal(true);
        must(test(false, false)).equal(true);

        must(test(1, 12)).equal(false);
        must(test('one', 'two')).equal(false);
        must(test(true, false)).equal(false);
        must(test(false, true)).equal(false);

    });

    it('must match builtins', function() {

        must(test(1, Number)).equal(true);
        must(test('one', String)).equal(true);
        must(test(true, Boolean)).equal(true);
        must(test(false, Boolean)).equal(true);

    });

    it('must match constructors', function() {

        must(test(new Point(), Point)).equal(true);
        must(test(Point, Point)).equal(false);

    });

    it('must match shapes', function() {

        must(test(new Point(), { x: Number, y: 12 })).equal(true);
        must(test({ y: 12 }, { x: Number, y: 12 })).equal(false);

    });

    it('should match regular expressions', function() {

        must(test('Do you know the movie jaws?', /^jaws/)).equal(false);
        must(test('jaws? yeah I know it.', /^jaws/)).equal(true);

    });

    it('should match Any', function() {

        must(test('A string', Any)).equal(true);
        must(test(12, Any)).equal(true);
        must(test(false, Any)).equal(true);
        must(test({}, Any)).equal(true);

    });

});



