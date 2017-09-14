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

});


