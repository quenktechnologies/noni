import * as must from 'must/register';
import * as functor from './functor';
import * as apply from './apply';
import * as applicative from './applicative';
import * as chain from './chain';
import * as monad from './monad';
import { Monad } from '../../src/control/monad';

export interface TestOpts<A> {

    pure: <X>(x: X) => Monad<X>

    eq: (m: any) => (m: any) => any

    map: (a: A) => A

    bind: (a: A) => Monad<A>

    value: A

}

/**
 * isMonad tests all the main laws in the Monad type hierarchy.
 */
export const isMonad =
    <A>({ pure, eq, map, bind, value }: TestOpts<A>) => () => {

        describe('Functor', () => {

            it('should obey the identity law', () =>
                must((functor.identity(pure)(eq)(value))).be(true))

            it('should obey the composition law', () =>
                must((functor.composition(pure)(eq)(map)(map)(value))).be(true))

        })

        describe('Apply', () => {

            it('should obey the composition law', () =>
                must((apply.composition(pure)(eq)(map)(map)(value))).be(true))

        })

        describe('Applicative', () => {

            it('should obey the identity law', () =>
                must((applicative.identity(pure)(eq)(value))).be(true))

            it('should obey the homomorphism law', () =>
                must((applicative.identity(pure)(eq)(value))).be(true))

        })

        describe('Chain', () => {

            it('should obey the associativity law', () =>
                must((chain.associativity(pure)(eq)(value))).be(true))

        })

        describe('Monad', () => {

            it('should obey the left identity law', () =>
                must((monad.leftIdentity(pure)(eq)(bind)(value))).be(true))

        })

    }

