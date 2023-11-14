import { assert } from "@quenk/test/lib/assert";
import { debounce, throttle } from "../../src/control/timer";

describe("timer", () => {
  describe("debounce", () => {
    it("should only execute the function once", (done) => {
      let sum = 0;
      let f = debounce((n: number) => (sum = sum + n), 500);

      f(1);
      f(1);
      f(1);

      setTimeout(() => f(1), 1500);

      setTimeout(() => {
        try {
          assert(sum).equal(2);
          done(null);
        } catch (e) {
          done(e);
        }
      }, 2500);
    });
  });

  describe("throttle", () => {
    it("should limit application", (done) => {
      let sum = 0;

      let f = throttle((n: number) => (sum = sum + n), 500);

      f(1);
      f(1);
      f(1);
      setTimeout(() => f(1), 100);
      setTimeout(() => f(1), 200);
      setTimeout(() => f(1), 300);
      setTimeout(() => f(1), 600);

      setTimeout(() => {
        try {
          assert(sum).equal(2);
          done(null);
        } catch (e) {
          done(e);
        }
      }, 1000);
    });
  });
});
