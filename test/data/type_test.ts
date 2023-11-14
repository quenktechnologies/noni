import { assert } from "@quenk/test/lib/assert";

import { Any, test, toString, isNull } from "../../src/data/type";

class Point {
  x = 12;
  y = 12;
}

describe("type", () => {
  describe("test", () => {
    it("must match literals", () => {
      assert(test(1, 1)).equal(true);
      assert(test("one", "one")).equal(true);
      assert(test(true, true)).equal(true);
      assert(test(false, false)).equal(true);

      assert(test(1, 12)).equal(false);
      assert(test("one", "two")).equal(false);
      assert(test(true, false)).equal(false);
      assert(test(false, true)).equal(false);
    });

    it("must match builtins", () => {
      assert(test(1, Number)).equal(true);
      assert(test("one", String)).equal(true);
      assert(test(true, Boolean)).equal(true);
      assert(test(false, Boolean)).equal(true);
    });

    it("must match constructors", () => {
      assert(test(new Point(), Point)).equal(true);
      assert(test(Point, Point)).equal(false);
    });

    it("must match shapes", () => {
      assert(test(new Point(), { x: Number, y: 12 })).equal(true);
      assert(test({ y: 12 }, { x: Number, y: 12 })).equal(false);
    });

    it("should match regular expressions", () => {
      assert(test("Do you know the movie jaws?", /^jaws/)).equal(false);
      assert(test("jaws? yeah I know it.", /^jaws/)).equal(true);
    });

    it("should match Any", () => {
      assert(test("A string", Any)).equal(true);
      assert(test(12, Any)).equal(true);
      assert(test(false, Any)).equal(true);
      assert(test({}, Any)).equal(true);
    });
  });

  describe("toString", () => {
    it("should work", () => {
      assert(toString(undefined)).equal("");
      assert(toString(null)).equal("");
      assert(toString({})).equal("[object Object]");
      assert(toString([])).equal("");
    });
  });

  describe("isNull", () => {
    it("should work", () => {
      assert(isNull(undefined)).true();
      assert(isNull(null)).true();
      assert(isNull("undefined")).false();
      assert(isNull("null")).false();
      assert(isNull("")).false();
      assert(isNull(0)).false();
      assert(isNull([])).false();
      assert(isNull({})).false();
    });
  });
});
