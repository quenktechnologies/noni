import { assert } from "@quenk/test/lib/assert";

import { match } from "../../../src/control/match";

class ClassA {
  constructor(public a: string) {}
}
class ClassB {
  constructor(public b: string) {}
}
class ClassC {
  constructor(public c: string) {}
}
class ClassD {
  constructor(public d: number) {}
}

describe("match", function () {
  it("it should work", function () {
    let result = match(12)
      .caseOf(ClassA, (a: ClassA) => a)
      .caseOf(ClassB, (b: ClassB) => b)
      .caseOf(ClassC, (c: ClassC) => c)
      .caseOf(12, (n: number) => new ClassD(n))
      .caseOf("12", (n: string) => [new ClassD(Number(n))])
      .caseOf({ n: 1 }, (o: { n: number }) => "" + new ClassD(o.n))
      .orElse(() => new Date())
      .end();

    assert((<ClassD>result).d).equal(12);
  });

  it("should return orElse if no match and specified", function () {
    let result = match({})
      .caseOf(ClassA, (a: ClassA) => a)
      .caseOf("12", (n: string) => n)
      .orElse(() => Date)
      .end();

    assert(result).equal(Date);
  });

  it("should throw if no match found", function () {
    let f = () =>
      match({})
        .caseOf(ClassA, () => 12)
        .end();

    assert(f).throw();
  });
});
