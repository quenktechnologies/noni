import { assert } from "@quenk/test/lib/assert";
import * as checks from "../../checks";
import { Functor } from "../../../src/data/functor";
import { Identity } from "../../../src/data/indentity";
import {
  Free,
  Step,
  liftF,
  flatten,
  reduce,
} from "../../../src/control/monad/free";

const _ = undefined;

type API<N> = Put<N> | Get<N> | Remove<N>;

class F<N> {
  constructor(public next: N) {}

  map<B>(f: (a: N) => B): F<B> {
    return new F(f(this.next));
  }
}

class Put<N> {
  constructor(public key: string, public value: string, public next: N) {}

  map<B>(f: (a: N) => B): Put<B> {
    return new Put(this.key, this.value, f(this.next));
  }
}

class Get<N> {
  constructor(public key: string, public next: (s: string) => N) {}

  map<B>(f: (a: N) => B): Get<B> {
    return new Get(this.key, (a: string) => f(this.next(a)));
  }
}

class Remove<N> {
  constructor(public key: string, public next: N) {}

  map<B>(f: (a: N) => B): Remove<B> {
    return new Remove(this.key, f(this.next));
  }
}

const eq =
  <F extends Functor<any>, A>(a: Free<F, A>) =>
  (b: Free<F, A>) =>
    a.eq(b);

const map = (n: number) => n + 1;

const value = new Put("n", "12", _);

const put = (key: string, value: string) =>
  liftF<API<any>, undefined>(new Put(key, value, _));

const get = (key: string) =>
  liftF<API<string>, string>(new Get(key, (s: string) => s));

const remove = (key: string) => liftF<API<any>, undefined>(new Remove(key, _));

describe("free", () => {
  describe("Free", () => {
    it(
      "should be a Monad",
      checks.isMonad<any>({
        pure: <A>(a: A) => liftF(new F(a)),
        eq,
        bind: (n: number) => liftF(new F(n + 1)),
        map,
        value,
      })
    );

    describe("resume", () => {
      it("should unwrap one layer of Free", () => {
        let x = put("n", "12")
          .chain(() => get("n"))
          .chain((n: string) => remove(n));

        assert(x.resume().takeLeft()).be.instance.of(Put);

        assert(x.resume().takeLeft().next.resume().takeLeft()).be.instance.of(
          Get
        );

        assert(
          x
            .resume()
            .takeLeft()
            .next.resume()
            .takeLeft()
            .next()
            .resume()
            .takeLeft()
        ).be.instance.of(Remove);
      });
    });

    describe("run", () => {
      it("should unroll all the computations", () => {
        let l: string[] = [];

        let x: Free<API<any>, undefined> = put("num", "12")
          .chain(() => get("num"))
          .chain((n: string) => remove(n));

        x.run((n: API<any>) => {
          if (n instanceof Put) {
            l.push(`PUT '${n.key}' '${n.value}'`);
            return n.next;
          } else if (n instanceof Get) {
            l.push(`GET '${n.key}'`);
            return n.next(n.key);
          } else if (n instanceof Remove) {
            l.push(`REMOVE '${n.key}'`);
            return n.next;
          }
        });

        assert(l).equate(["PUT 'num' '12'", "GET 'num'", "REMOVE 'num'"]);
      });
    });

    describe("fold", () => {
      it("should fold a Free into a single value", () => {
        let store: { [key: string]: string } = { n: "12" };

        let chain = put("a", "11")
          .chain(() => get("n"))
          .chain((n) => put("b", n))
          .chain(() => remove("n"));

        let r = chain.fold(
          () => store,
          (a: API<any>) => {
            if (a instanceof Get) {
              a.next(store[a.key]);
            } else if (a instanceof Put) {
              store[a.key] = a.value;
            } else if (a instanceof Remove) {
              delete store[a.key];
            }

            return store;
          }
        );

        assert(r).equate({ a: "11", b: "12" });
      });
    });

    describe("foldM", () => {
      it("should fold a free into a monad", () => {
        let store: { [key: string]: string } = { n: "12" };

        let chain = put("a", "11")
          .chain(() => get("n"))
          .chain((n) => put("b", n))
          .chain(() => remove("n"));

        let r = chain.foldM(
          () => new Identity<any>(store),
          (a: API<any>) => {
            if (a instanceof Get) {
              return new Identity(a.next(store[a.key]));
            } else if (a instanceof Put) {
              store[a.key] = a.value;
              return new Identity(a.next);
            } else if (a instanceof Remove) {
              delete store[a.key];
              return new Identity(a.next);
            }

            throw new Error("era");
          }
        );

        assert(r.value).equate({ a: "11", b: "12" });
      });
    });
  });

  describe("flatten", () => {
    it("should flatten a Free chain", () => {
      let chain = put("num", "12")
        .chain(() => get("num"))
        .chain((n: string) => remove(n))
        .chain(() => put("num", "12"));

      let aray = flatten(chain)((a: API<any>) =>
        typeof a.next === "function" ? a.next() : a.next
      );

      assert(aray[0]).be.instance.of(Put);
      assert(aray[1]).be.instance.of(Get);
      assert(aray[2]).be.instance.of(Remove);
      assert(aray[3]).be.instance.of(Put);
    });
  });

  describe("reduce", () => {
    it("should reduce a Free chain", () => {
      let chain = put("num", "12")
        .chain(() => get("num"))
        .chain((n: string) => remove(n))
        .chain(() => put("num", "12"));

      let r = reduce<any, any>(chain)([])(
        (p: string[], curr: API<any>) =>
          new Step(
            p.concat((<any>curr.constructor).name),
            typeof curr.next === "function" ? curr.next() : curr.next
          )
      );

      assert(r).equate(["Put", "Get", "Remove", "Put"]);
    });
  });
});
