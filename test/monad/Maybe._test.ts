import * as must from 'must/register';
import { Maybe } from '../../src';

const one = () => 1;
const sqr = x => x * x;

describe('Maybe', function() {

    it('Maybe#cata :: (() → B, A →  B) →  B', function() {

        must(Maybe.nothing().cata(one, sqr)).be(1);
        must(Maybe.just(2).cata(one, sqr)).be(4);

    });

});

describe('fromObject', () => {

    it('should be nothing with an empty object', function() {

        must(Maybe.fromObject({}).cata(() => false, () => true)).be(false);

    });

    it('should be just with a populated object', function() {

        must(Maybe.fromObject({ a: 1 }).cata<boolean | object>(() => false, x => x)).eql({ a: 1 });

    });

    describe('fromBoolean', function() {

        it('should be nothing with false', function() {

            must(Maybe.fromBoolean(false).cata(() => true, () => false)).be(true);

        });

        it('should be just with true', function() {

            must(Maybe.fromBoolean(true).cata(() => false, x => x)).be(true);

        });

    });

    describe('fromString', function() {

        it('should return nothing for an empty string', function() {

            must(Maybe.fromString('').cata(() => true, () => false)).be(true);

        });

        it('should return just for a string', function() {

            must(Maybe.fromString('abc').cata(() => 'no', x => x)).be('abc');

        });

    });

    describe('fromArray', function() {

        it('should return nothing for an empty array  ', function() {

            must(Maybe.fromArray([]).cata(() => true, () => false)).be(true);

        });

        it('should return just for a populated arrays', function() {

            must(Maybe.fromArray([true, false, true]).cata(() => false, x => x[2])).be(true);

        });
    });

    describe('fromNumber', function() {

        it('should return nothing for 0', function() {

            must(Maybe.fromNumber(0).cata(() => true, () => false)).be(true);

        });

        it('should return the number for >0 or <0', function() {

            must(Maybe.fromNumber(12).cata<number | boolean>(() => false, x => x)).be(12);

        });

    });

});



