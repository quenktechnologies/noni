import { assert } from "@quenk/test/lib/assert";
import { attempt } from "../../src/control/error";

describe("error", () => {
  describe("attempt", () => {
    it("should work", () => {
      let _throw = () => {
        throw new Error("foo");
      };
      let _noes = () => 12;

      assert(attempt(_throw).takeLeft().message).equal("foo");
      assert(attempt(_noes).takeRight()).equal(12);
    });
  });
});
