import * as must from 'must/register';
import { IO } from '../../src';

const x = 12;

const mul2 = x => x * 2;

const sqr = x => x * x;

describe('IO', function() {

    it('should obey the monad laws for return', function() {

        let r = IO.pure(x).chain(x => IO.pure(mul2(x))).run();

        must(r).be(mul2(x));

    });

    it('should obey the monad laws for bind', function() {

        let r = IO.pure(x).chain(x => IO.pure(mul2(x))).chain(y => IO.pure(sqr(y))).run();

        must(r).be(IO.pure(x).chain(x => IO.pure(mul2(x)).chain(y => IO.pure(sqr(y)))).run());

    });

});

