import * as tests from '../checks';
import { assert } from '@quenk/test/lib/assert';
import {
    Maybe,
    Nothing,
    Just,
    nothing,
    just,
    fromObject,
    fromArray,
    fromString,
    fromNumber,
    fromNaN,
    fromBoolean,
    fromNullable
} from '../../src/data/maybe';

const eq =
    <A>(a: Maybe<A>) =>
    (b: Maybe<A>) =>
        a.eq(b);
const map = (n: number) => n + 1;
const value = 12;

describe('maybe', () => {
    describe('Just', () => {
        describe(
            'Monad',
            tests.isMonad({
                pure: just,
                eq,
                bind: (n: number) => just(n + 1),
                map,
                value
            })
        );

        describe('isNothing', () => {
            it('should return false', () => {
                assert(just(1).isNothing()).equal(false);
            });
        });

        describe('isJust', () => {
            it('should return true', () => {
                assert(just(1).isJust()).equal(true);
            });
        });
    });

    describe('Nothing', () => {
        describe(
            'Monad',
            tests.isMonad<number>({
                pure: nothing,
                eq,
                bind: (_: number) => nothing(),
                map,
                value
            })
        );

        describe('isNothing', () => {
            it('should return true', () => {
                assert(nothing().isNothing()).equal(true);
            });
        });

        describe('isJust', () => {
            it('should return false', () => {
                assert(nothing().isJust()).equal(false);
            });
        });
    });

    describe('fromObject', () => {
        it('should be nothing with an empty object', function () {
            assert(fromObject({}) instanceof Nothing).equal(true);
        });

        it('should be Just<A> with a populated object', function () {
            assert(fromObject({ a: 1 }) instanceof Just).equal(true);
        });
    });

    describe('fromBoolean', function () {
        it('should be nothing with false', function () {
            assert(fromBoolean(false) instanceof Nothing).equal(true);
        });

        it('should be Just<A> with true', function () {
            assert(fromBoolean(true) instanceof Just).equal(true);
        });

        it('should avoid JS downcasting', function () {
            assert(fromNullable(0) instanceof Just).equal(true);

            assert(fromNullable('') instanceof Just).equal(true);
        });
    });

    describe('fromString', function () {
        it('should return nothing for an empty string', function () {
            assert(fromString('') instanceof Nothing).equal(true);
        });

        it('should return Just<A> for a string', function () {
            assert(fromString('abc') instanceof Just).equal(true);
        });
    });

    describe('fromArray', function () {
        it('should return nothing for an empty array  ', function () {
            assert(fromArray([]) instanceof Nothing).equal(true);
        });

        it('should return Just<A> for a populated array', function () {
            assert(fromArray([true, false, true]) instanceof Just).equal(true);
        });
    });

    describe('fromNumber', function () {
        it('should return Nothing for 0', function () {
            assert(fromNumber(0) instanceof Nothing).equal(true);

            assert(fromNumber(12) instanceof Just).equal(true);
        });
    });

    describe('fromNaN', function () {
        it('should return Nothing for NaN', function () {
            assert(fromNaN(NaN) instanceof Nothing).equal(true);

            assert(fromNaN(12) instanceof Just).equal(true);
        });
    });

    describe('fromNullable', function () {
        it('should return Nothing for null values', function () {
            assert(fromNullable(undefined) instanceof Nothing).equal(true);

            assert(fromNullable(null) instanceof Nothing).equal(true);

            assert(fromNullable('') instanceof Just).equal(true);
        });
    });

    describe('Maybe', () => {
        describe('orElse', () => {
            it('should not cause #3', () => {
                fromBoolean(true)
                    .orElse(() => just('foo'))
                    .map(() => 'bar');

                assert(true).equal(true);
            });
        });
    });
});
