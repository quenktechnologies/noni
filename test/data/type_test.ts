import * as must from 'must/register';
import { typeOf } from '../../src/data/type';

class Point {

    x = 12
    y = 12

}

describe('typeOf', function() {

    it('must match literals', function() {

        must(typeOf(1, 1)).be(true);
        must(typeOf('one', 'one')).be(true);
        must(typeOf(true, true)).be(true);
        must(typeOf(false, false)).be(true);

        must(typeOf(1, 12)).be(false);
        must(typeOf('one', 'two')).be(false);
        must(typeOf(true, false)).be(false);
        must(typeOf(false, true)).be(false);

    });

    it('must match builtins', function() {

        must(typeOf(1, Number)).be(true);
        must(typeOf('one', String)).be(true);
        must(typeOf(true, Boolean)).be(true);
        must(typeOf(false, Boolean)).be(true);

    });

    it('must match constructors', function() {

        must(typeOf(new Point(), Point)).be(true);
        must(typeOf(Point, Point)).be(false);

    });

    it('must match shapes', function() {

        must(typeOf(new Point(), { x: Number, y: 12 })).be(true);
        must(typeOf({ y: 12 }, { x: Number, y: 12 })).be(false);

    });

    it('should match regular expressions', function() {

        must(typeOf('Do you know the movie jaws?', /^jaws/ )).be(false);
        must(typeOf( 'jaws? yeah I know it.', /^jaws/ )).be(true);

    });

});



