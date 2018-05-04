import * as must from 'must/register';
import {
    Nothing,
    Just,
    fromObject,
    fromArray,
    fromString,
    fromNumber,
    fromNaN,
    fromBoolean,
    fromNullable
} from '../../src/data/maybe';

describe('maybe', () => {

    describe('fromObject', () => {

        it('should be nothing with an empty object', function() {

            must(fromObject({}) instanceof Nothing).be(true);

        });

        it('should be Just<A> with a populated object', function() {

            must(fromObject({ a: 1 }) instanceof Just).be(true);

        });

    });

    describe('fromBoolean', function() {

        it('should be nothing with false', function() {

            must(fromBoolean(false) instanceof Nothing).be(true);

        });

        it('should be Just<A> with true', function() {

            must(fromBoolean(true) instanceof Just).be(true);

        });

        it('should avoid JS downcasting', function() {

            must(fromNullable(0) instanceof Just).be(true);

            must(fromNullable('') instanceof Just).be(true);

        });

    });

    describe('fromString', function() {

        it('should return nothing for an empty string', function() {

            must(fromString('') instanceof Nothing).be(true);

        });

        it('should return Just<A> for a string', function() {

            must(fromString('abc') instanceof Just).be(true);

        });

    });

    describe('fromArray', function() {

        it('should return nothing for an empty array  ', function() {

            must(fromArray([]) instanceof Nothing).be(true);

        });

        it('should return Just<A> for a populated array', function() {

            must(fromArray([true, false, true]) instanceof Just).be(true);

        });

    });

    describe('fromNumber', function() {

        it('should return Nothing for 0', function() {

            must(fromNumber(0) instanceof Nothing).be(true);

            must(fromNumber(12) instanceof Just).be(true);

        });

    });

    describe('fromNaN', function() {

        it('should return Nothing for NaN', function() {

            must(fromNaN(NaN) instanceof Nothing).be(true);

            must(fromNaN(12) instanceof Just).be(true);

        });

    });

    describe('fromNullable', function() {

        it('should return Nothing for null values', function() {

            must(fromNullable(undefined) instanceof Nothing).be(true);

            must(fromNullable(null) instanceof Nothing).be(true);

            must(fromNullable('') instanceof Just).be(true);

        });

    });

});
