import { assert } from "@quenk/test/lib/assert";
import { isMultipleOf, round } from "../src/math";

describe("math", () => {
  describe("isMultipleOf", () => {
    it("should work", () => {
      assert(isMultipleOf(3, 9)).be.true();
      assert(isMultipleOf(2, 5)).be.false();
      assert(isMultipleOf(0, 1)).be.false();
    });
  });

  describe("round", () => {
    it("work with integers", () => {
      //positive
      assert(round(1)).equal(1);
      assert(round(5)).equal(5);
      assert(round(10)).equal(10);
      assert(round(100)).equal(100);

      //negative
      assert(round(-1)).equal(-1);
      assert(round(-5)).equal(-5);
      assert(round(-10)).equal(-10);
      assert(round(-100)).equal(-100);

      //postive 1 place
      assert(round(1, 1)).equal(1);
      assert(round(5, 1)).equal(5);
      assert(round(10, 1)).equal(10);
      assert(round(100, 1)).equal(100);

      //negative 1 place
      assert(round(-1, 1)).equal(-1);
      assert(round(-5, 1)).equal(-5);
      assert(round(-10, 1)).equal(-10);
      assert(round(-100, 1)).equal(-100);

      //positive 2 places
      assert(round(1, 2)).equal(1);
      assert(round(5, 2)).equal(5);
      assert(round(10, 2)).equal(10);
      assert(round(100, 2)).equal(100);

      //negative 2 places
      assert(round(-1, 2)).equal(-1);
      assert(round(-5, 2)).equal(-5);
      assert(round(-10, 2)).equal(-10);
      assert(round(-100, 2)).equal(-100);

      //positive 3 places
      assert(round(1, 3)).equal(1);
      assert(round(5, 3)).equal(5);
      assert(round(10, 3)).equal(10);
      assert(round(100, 3)).equal(100);

      //negative 3 places
      assert(round(-1, 3)).equal(-1);
      assert(round(-5, 3)).equal(-5);
      assert(round(-10, 3)).equal(-10);
      assert(round(-100, 3)).equal(-100);

      //positive 10 places
      assert(round(1, 10)).equal(1);
      assert(round(5, 10)).equal(5);
      assert(round(10, 10)).equal(10);
      assert(round(100, 10)).equal(100);

      //negative 10 places
      assert(round(-1, 10)).equal(-1);
      assert(round(-5, 10)).equal(-5);
      assert(round(-10, 10)).equal(-10);
      assert(round(-100, 10)).equal(-100);
    });

    it("should work with + real numbers (with one decimal place)", () => {
      assert(round(1.1)).equal(1);
      assert(round(1.4)).equal(1);
      assert(round(1.5)).equal(2);
      assert(round(1.6)).equal(2);
      assert(round(1.9)).equal(2);

      assert(round(1.1, 1)).equal(1.1);
      assert(round(1.4, 1)).equal(1.4);
      assert(round(1.5, 1)).equal(1.5);
      assert(round(1.6, 1)).equal(1.6);
      assert(round(1.9, 1)).equal(1.9);

      assert(round(1.1, 2)).equal(1.1);
      assert(round(1.4, 2)).equal(1.4);
      assert(round(1.5, 2)).equal(1.5);
      assert(round(1.6, 2)).equal(1.6);
      assert(round(1.9, 2)).equal(1.9);

      assert(round(1.1, 3)).equal(1.1);
      assert(round(1.4, 3)).equal(1.4);
      assert(round(1.5, 3)).equal(1.5);
      assert(round(1.6, 3)).equal(1.6);
      assert(round(1.9, 3)).equal(1.9);
    });

    it("should work with - real numbers (with one decimal place)", () => {
      assert(round(-1.1)).equal(-1);
      assert(round(-1.4)).equal(-1);
      assert(round(-1.5)).equal(-2);
      assert(round(-1.6)).equal(-2);
      assert(round(-1.9)).equal(-2);

      assert(round(-1.1, 1)).equal(-1.1);
      assert(round(-1.4, 1)).equal(-1.4);
      assert(round(-1.5, 1)).equal(-1.5);
      assert(round(-1.6, 1)).equal(-1.6);
      assert(round(-1.9, 1)).equal(-1.9);

      assert(round(-1.1, 2)).equal(-1.1);
      assert(round(-1.4, 2)).equal(-1.4);
      assert(round(-1.5, 2)).equal(-1.5);
      assert(round(-1.6, 2)).equal(-1.6);
      assert(round(-1.9, 2)).equal(-1.9);

      assert(round(-1.1, 3)).equal(-1.1);
      assert(round(-1.4, 3)).equal(-1.4);
      assert(round(-1.5, 3)).equal(-1.5);
      assert(round(-1.6, 3)).equal(-1.6);
      assert(round(-1.9, 3)).equal(-1.9);
    });

    it("should work with +real numbers (with two decimal places)", () => {
      assert(round(1.11)).equal(1);
      assert(round(1.44)).equal(1);
      assert(round(1.55)).equal(2);
      assert(round(1.66)).equal(2);
      assert(round(1.99)).equal(2);

      assert(round(1.11, 1)).equal(1.1);
      assert(round(1.44, 1)).equal(1.4);
      assert(round(1.55, 1)).equal(1.6);
      assert(round(1.66, 1)).equal(1.7);
      assert(round(1.99, 1)).equal(2);

      assert(round(1.11, 2)).equal(1.11);
      assert(round(1.44, 2)).equal(1.44);
      assert(round(1.55, 2)).equal(1.55);
      assert(round(1.66, 2)).equal(1.66);
      assert(round(1.99, 2)).equal(1.99);

      assert(round(1.11, 3)).equal(1.11);
      assert(round(1.44, 3)).equal(1.44);
      assert(round(1.55, 3)).equal(1.55);
      assert(round(1.66, 3)).equal(1.66);
      assert(round(1.99, 3)).equal(1.99);
    });

    it("should work with - real numbers (with two decimal places)", () => {
      assert(round(-1.11)).equal(-1);
      assert(round(-1.44)).equal(-1);
      assert(round(-1.55)).equal(-2);
      assert(round(-1.66)).equal(-2);
      assert(round(-1.99)).equal(-2);

      assert(round(-1.11, 1)).equal(-1.1);
      assert(round(-1.44, 1)).equal(-1.4);
      assert(round(-1.55, 1)).equal(-1.6);
      assert(round(-1.66, 1)).equal(-1.7);
      assert(round(-1.99, 1)).equal(-2);

      assert(round(-1.11, 2)).equal(-1.11);
      assert(round(-1.44, 2)).equal(-1.44);
      assert(round(-1.55, 2)).equal(-1.55);
      assert(round(-1.66, 2)).equal(-1.66);
      assert(round(-1.99, 2)).equal(-1.99);

      assert(round(-1.11, 3)).equal(-1.11);
      assert(round(-1.44, 3)).equal(-1.44);
      assert(round(-1.55, 3)).equal(-1.55);
      assert(round(-1.66, 3)).equal(-1.66);
      assert(round(-1.99, 3)).equal(-1.99);
    });

    it("should work with +real numbers (with three decimal places)", () => {
      assert(round(1.111)).equal(1);
      assert(round(1.444)).equal(1);
      assert(round(1.555)).equal(2);
      assert(round(1.666)).equal(2);
      assert(round(1.999)).equal(2);

      assert(round(1.111, 1)).equal(1.1);
      assert(round(1.444, 1)).equal(1.4);
      assert(round(1.555, 1)).equal(1.6);
      assert(round(1.666, 1)).equal(1.7);
      assert(round(1.999, 1)).equal(2);

      assert(round(1.111, 2)).equal(1.11);
      assert(round(1.444, 2)).equal(1.44);
      assert(round(1.555, 2)).equal(1.56);
      assert(round(1.666, 2)).equal(1.67);
      assert(round(1.999, 2)).equal(2);

      assert(round(1.111, 3)).equal(1.111);
      assert(round(1.444, 3)).equal(1.444);
      assert(round(1.555, 3)).equal(1.555);
      assert(round(1.666, 3)).equal(1.666);
      assert(round(1.999, 3)).equal(1.999);
    });

    it("should work with -real numbers (with three decimal places)", () => {
      assert(round(-1.111)).equal(-1);
      assert(round(-1.444)).equal(-1);
      assert(round(-1.555)).equal(-2);
      assert(round(-1.666)).equal(-2);
      assert(round(-1.999)).equal(-2);

      assert(round(-1.111, 1)).equal(-1.1);
      assert(round(-1.444, 1)).equal(-1.4);
      assert(round(-1.555, 1)).equal(-1.6);
      assert(round(-1.666, 1)).equal(-1.7);
      assert(round(-1.999, 1)).equal(-2);

      assert(round(-1.111, 2)).equal(-1.11);
      assert(round(-1.444, 2)).equal(-1.44);
      assert(round(-1.555, 2)).equal(-1.56);
      assert(round(-1.666, 2)).equal(-1.67);
      assert(round(-1.999, 2)).equal(-2);

      assert(round(-1.111, 3)).equal(-1.111);
      assert(round(-1.444, 3)).equal(-1.444);
      assert(round(-1.555, 3)).equal(-1.555);
      assert(round(-1.666, 3)).equal(-1.666);
      assert(round(-1.999, 3)).equal(-1.999);
    });

    it("should work with + fractions (with one decimal place)", () => {
      assert(round(0.1)).equal(0);
      assert(round(0.4)).equal(0);
      assert(round(0.5)).equal(1);
      assert(round(0.6)).equal(1);
      assert(round(0.9)).equal(1);

      assert(round(0.1, 1)).equal(0.1);
      assert(round(0.4, 1)).equal(0.4);
      assert(round(0.5, 1)).equal(0.5);
      assert(round(0.6, 1)).equal(0.6);
      assert(round(0.9, 1)).equal(0.9);

      assert(round(0.1, 2)).equal(0.1);
      assert(round(0.4, 2)).equal(0.4);
      assert(round(0.5, 2)).equal(0.5);
      assert(round(0.6, 2)).equal(0.6);
      assert(round(0.9, 2)).equal(0.9);

      assert(round(0.1, 3)).equal(0.1);
      assert(round(0.4, 3)).equal(0.4);
      assert(round(0.5, 3)).equal(0.5);
      assert(round(0.6, 3)).equal(0.6);
      assert(round(0.9, 3)).equal(0.9);
    });

    it("should work with -fractions (with one decimal place)", () => {
      assert(round(-0.1)).equal(0);
      assert(round(-0.4)).equal(0);
      assert(round(-0.5)).equal(-1);
      assert(round(-0.6)).equal(-1);
      assert(round(-0.9)).equal(-1);

      assert(round(-0.1, 1)).equal(-0.1);
      assert(round(-0.4, 1)).equal(-0.4);
      assert(round(-0.5, 1)).equal(-0.5);
      assert(round(-0.6, 1)).equal(-0.6);
      assert(round(-0.9, 1)).equal(-0.9);

      assert(round(-0.1, 2)).equal(-0.1);
      assert(round(-0.4, 2)).equal(-0.4);
      assert(round(-0.5, 2)).equal(-0.5);
      assert(round(-0.6, 2)).equal(-0.6);
      assert(round(-0.9, 2)).equal(-0.9);

      assert(round(-0.1, 3)).equal(-0.1);
      assert(round(-0.4, 3)).equal(-0.4);
      assert(round(-0.5, 3)).equal(-0.5);
      assert(round(-0.6, 3)).equal(-0.6);
      assert(round(-0.9, 3)).equal(-0.9);
    });

    it("should work with +fractions (with two decimal places)", () => {
      assert(round(0.11)).equal(0);
      assert(round(0.44)).equal(0);
      assert(round(0.55)).equal(1);
      assert(round(0.66)).equal(1);
      assert(round(0.99)).equal(1);

      assert(round(0.11, 1)).equal(0.1);
      assert(round(0.44, 1)).equal(0.4);
      assert(round(0.55, 1)).equal(0.6);
      assert(round(0.66, 1)).equal(0.7);
      assert(round(0.99, 1)).equal(1);

      assert(round(0.11, 2)).equal(0.11);
      assert(round(0.44, 2)).equal(0.44);
      assert(round(0.55, 2)).equal(0.55);
      assert(round(0.66, 2)).equal(0.66);
      assert(round(0.99, 2)).equal(0.99);

      assert(round(0.11, 3)).equal(0.11);
      assert(round(0.44, 3)).equal(0.44);
      assert(round(0.55, 3)).equal(0.55);
      assert(round(0.66, 3)).equal(0.66);
      assert(round(0.99, 3)).equal(0.99);
    });

    it("should work with -real numbers (with two decimal places)", () => {
      assert(round(-0.11)).equal(0);
      assert(round(-0.44)).equal(0);
      assert(round(-0.55)).equal(-1);
      assert(round(-0.66)).equal(-1);
      assert(round(-0.99)).equal(-1);

      assert(round(-0.11, 1)).equal(-0.1);
      assert(round(-0.44, 1)).equal(-0.4);
      assert(round(-0.55, 1)).equal(-0.6);
      assert(round(-0.66, 1)).equal(-0.7);
      assert(round(-0.99, 1)).equal(-1);

      assert(round(-0.11, 2)).equal(-0.11);
      assert(round(-0.44, 2)).equal(-0.44);
      assert(round(-0.55, 2)).equal(-0.55);
      assert(round(-0.66, 2)).equal(-0.66);
      assert(round(-0.99, 2)).equal(-0.99);

      assert(round(-0.11, 3)).equal(-0.11);
      assert(round(-0.44, 3)).equal(-0.44);
      assert(round(-0.55, 3)).equal(-0.55);
      assert(round(-0.66, 3)).equal(-0.66);
      assert(round(-0.99, 3)).equal(-0.99);
    });

    it("should work with +fractions (with three decimal places)", () => {
      assert(round(0.111)).equal(0);
      assert(round(0.444)).equal(0);
      assert(round(0.555)).equal(1);
      assert(round(0.666)).equal(1);
      assert(round(0.999)).equal(1);

      assert(round(0.111, 1)).equal(0.1);
      assert(round(0.444, 1)).equal(0.4);
      assert(round(0.555, 1)).equal(0.6);
      assert(round(0.666, 1)).equal(0.7);
      assert(round(0.999, 1)).equal(1);

      assert(round(0.111, 2)).equal(0.11);
      assert(round(0.444, 2)).equal(0.44);
      assert(round(0.555, 2)).equal(0.56);
      assert(round(0.666, 2)).equal(0.67);
      assert(round(0.999, 2)).equal(1);

      assert(round(0.111, 3)).equal(0.111);
      assert(round(0.444, 3)).equal(0.444);
      assert(round(0.555, 3)).equal(0.555);
      assert(round(0.666, 3)).equal(0.666);
      assert(round(0.999, 3)).equal(0.999);
    });

    it("should work with -real numbers (with three decimal places)", () => {
      assert(round(-0.111)).equal(0);
      assert(round(-0.444)).equal(0);
      assert(round(-0.555)).equal(-1);
      assert(round(-0.666)).equal(-1);
      assert(round(-0.999)).equal(-1);

      assert(round(-0.111, 1)).equal(-0.1);
      assert(round(-0.444, 1)).equal(-0.4);
      assert(round(-0.555, 1)).equal(-0.6);
      assert(round(-0.666, 1)).equal(-0.7);
      assert(round(-0.999, 1)).equal(-1);

      assert(round(-0.111, 2)).equal(-0.11);
      assert(round(-0.444, 2)).equal(-0.44);
      assert(round(-0.555, 2)).equal(-0.56);
      assert(round(-0.666, 2)).equal(-0.67);
      assert(round(-0.999, 2)).equal(-1);

      assert(round(-0.111, 3)).equal(-0.111);
      assert(round(-0.444, 3)).equal(-0.444);
      assert(round(-0.555, 3)).equal(-0.555);
      assert(round(-0.666, 3)).equal(-0.666);
      assert(round(-0.999, 3)).equal(-0.999);
    });

    it("should handle peculiar cases", () => {
      assert(round(1.005, 2)).equal(1.01);
      assert(round(-1.005, 2)).equal(-1.01);

      assert(round(0.005, 2)).equal(0.01);
      assert(round(-0.005, 2)).equal(-0.01);

      assert(round(1.345, 2)).equal(1.35);
      assert(round(-1.345, 2)).equal(-1.35);

      assert(round(4.485, 2)).equal(4.49);
      assert(round(-4.485, 2)).equal(-4.49);

      assert(round(1.1234567891534568, 10)).equal(1.1234567892);
      assert(round(-1.1234567891534568, 10)).equal(-1.1234567892);
    });
  });
});
