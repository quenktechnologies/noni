import {Chain} from '../../src/control/chain';

export type Eq<A> = (f: Chain<A>) => (g: Chain<A>) => boolean;

/**
 * associativtiy law
 *
 * Chain m => m.chain(f).chain(g) = m.chain(x=>f(x).chain(g))
 */
export const associativity = 
  <A>(pure: <X>(x:X)=>Chain<X>) => (eq:Eq<A>) =>  (x:A) => {

    let a = pure(x).chain(pure).chain(pure);
    let b = pure(x).chain(x => pure(x).chain(pure));

    return eq(a)(b);

  }

