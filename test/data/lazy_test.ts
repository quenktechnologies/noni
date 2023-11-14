import { assert } from "@quenk/test/lib/assert";

import { Lazy, evaluate } from "../../lib/data/lazy";

const inc = (num: Lazy<number>) => evaluate(num) + 1;

describe("evaluate", () => {
  it("should work with raw values", () => {
    assert(inc(1)).equal(2);
  });

  it("should work with functions", () => {
    assert(inc(() => 1)).equal(2);
  });
});
