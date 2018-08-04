import * as must from 'must/register';
import * as checks from '../../checks';
import { Functor } from '../../../src/data/functor';
import { Free, liftF } from '../../../src/control/monad/free';

export class F1<A> {

    constructor(public next: A) { }

    map<B>(f: (a: A) => B): F1<B> {

        return new F1(f(this.next));

    }

}

export class F2<A> {

    constructor(public next: A) { }

    map<B>(f: (a: A) => B): F2<B> {

        return new F2(f(this.next));

    }

}

const eq = <F extends Functor<any>, A>(a: Free<F, A>) => (b: Free<F, A>) => a.eq(b);
const map = (n: number) => n + 1;
const value = new F1(12);


//const mkF1 = <A>(a:A)=> new F1(a);

//const mkF2 = <A>(a:A)=> new F2(a);

describe('Free', () => {

    it('should be a Monad', checks.isMonad({
        pure: <A>(a: A) => liftF(new F1(a)),
        eq,
        bind: (n: number) => liftF(new F1(n + 1)),
        map,
        value
    }));


    describe('resume', () => {

        it('should unwrap the first layer', () => {

            let f = new F1(12);
            let x = liftF(f);

            must(x.resume().takeLeft()).be.instanceof(F1);

        });

    });

});
