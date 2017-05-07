import * as must from 'must/register';
import * as Maybe from 'afpl/monad/Maybe';

const one = () => 1;
const sqr = x => x * x;

describe('Maybe', function() {

    it('Maybe#cata :: (() → B, A →  B) →  B', function() {

        must(Maybe.nothing().cata(one, sqr)).be(1);
        must(Maybe.just(2).cata(one, sqr)).be(4);

    });

});


