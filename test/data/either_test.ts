import * as must from 'must/register';
import * as tests from '../checks';
import {
    Either,
    Left,
    Right,
    left,
    right,
    fromBoolean,
    either
} from '../../src/data/either';

const eq = <A, B>(a: Either<A, B>) => (b: Either<A, B>) => a.eq(b);
const map = (n: number) => n + 1;
const value = 12;

describe('either', () => {

    describe('Left', tests.isMonad({
        pure: right,
        eq,
        bind: (n: number) => left(n + 1),
        map,
        value
    }));

    describe('Right', tests.isMonad({
        pure: right,
        eq,
        bind: (n: number) => right(n + 1),
        map,
        value
    }));

    describe('fromBoolean', function() {

        it('should be nothing with false', function() {

            must(fromBoolean(false) instanceof Left).be(true);

            must(fromBoolean(true) instanceof Right).be(true);

        });

    });

    describe('either', () => {

        it('should apply to the right side', () => {

            let l: Either<boolean, boolean> = left(false);
            let r: Either<boolean, boolean> = right(true);
            let f = (l: boolean) => '' + l;
            let g = (_: boolean) => '12';
            let test = either<boolean, boolean, string>(f)(g);

            must(test(l)).be('false');
            must(test(r)).be('12');


        });

    });

});
