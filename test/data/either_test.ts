import { assert } from '@quenk/test/lib/assert';
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

const eq =
    <A, B>(a: Either<A, B>) =>
    (b: Either<A, B>) =>
        a.eq(b);
const map = (n: number) => n + 1;
const value = 12;

describe('either', () => {
    describe('Left', () => {
        describe(
            'Monad',
            tests.isMonad<number>({
                pure: right,
                eq,
                bind: (n: number) => left(n + 1),
                map,
                value
            })
        );

        describe('isLeft', () => {
            it('must return true', () => {
                assert(left(1).isLeft()).be.true();
            });
        });

        describe('isRight', () => {
            it('must return false', () => {
                assert(left(1).isRight()).be.false();
            });
        });
    });

    describe('Right', () => {
        describe(
            'Monad',
            tests.isMonad({
                pure: right,
                eq,
                bind: (n: number) => right(n + 1),
                map,
                value
            })
        );

        describe('isRight', () => {
            it('must return true', () => {
                assert(right(1).isRight()).be.true();
            });
        });

        describe('isLeft', () => {
            it('must return false', () => {
                assert(right(1).isLeft()).be.false();
            });
        });
    });

    describe('fromBoolean', function () {
        it('should be nothing with false', function () {
            assert(fromBoolean(false) instanceof Left).equal(true);

            assert(fromBoolean(true) instanceof Right).equal(true);
        });
    });

    describe('either', () => {
        it('should apply to the right side', () => {
            let l: Either<boolean, boolean> = left(false);
            let r: Either<boolean, boolean> = right(true);
            let f = (l: boolean) => '' + l;
            let g = (_: boolean) => '12';
            let test = either<boolean, boolean, string>(f)(g);

            assert(test(l)).equal('false');
            assert(test(r)).equal('12');
        });
    });
});
