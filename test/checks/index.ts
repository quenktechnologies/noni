import * as functor from "./functor";
import * as apply from "./apply";
import * as applicative from "./applicative";
import * as chain from "./chain";
import * as monad from "./monad";
import { assert } from "@quenk/test/lib/assert";
import { Monad } from "../../src/control/monad";

export interface TestOpts<A> {
  pure: <X>(x: X) => Monad<X>;

  eq: (m: any) => (m: any) => any;

  map: (a: A) => A;

  bind: (a: A) => Monad<A>;

  value: A;
}

/**
 * isMonad tests all the main laws in the Monad type hierarchy.
 */
export const isMonad =
  <A>({ pure, eq, map, bind, value }: TestOpts<A>) =>
  () => {
    describe("Functor", () => {
      it("should obey the identity law", () =>
        assert(functor.identity(pure)(eq)(value)).equal(true));

      it("should obey the composition law", () =>
        assert(functor.composition<A>(pure)(eq)(map)(map)(value)).equal(true));
    });

    describe("Apply", () => {
      it("should obey the composition law", () =>
        assert(apply.composition<A>(pure)(eq)(map)(map)(value)).equal(true));
    });

    describe("Applicative", () => {
      it("should obey the identity law", () =>
        assert(applicative.identity(pure)(eq)(value)).equal(true));

      it("should obey the homomorphism law", () =>
        assert(applicative.identity(pure)(eq)(value)).equal(true));
    });

    describe("Chain", () => {
      it("should obey the associativity law", () =>
        assert(chain.associativity(pure)(eq)(value)).equal(true));
    });

    describe("Monad", () => {
      it("should obey the left identity law", () =>
        assert(monad.leftIdentity<A>(pure)(eq)(bind)(value)).equal(true));
    });
  };
