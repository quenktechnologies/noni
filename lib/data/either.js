"use strict";
/**
 * Either represents a value that may be one of two types.
 *
 * An Either is either a Left or Right. Mapping and related functions over the
 * Left side returns the value unchanged. When the value is Right
 * functions are applied as normal.
 *
 * The Either concept is often used to accomodate error handling but there
 * are other places it may come in handy.
 *
 * An important point to note when using this type is that the left side
 * remains the same while chaining. That means, the types Either<number, string>
 * and Either<boolean, string> are two different types that can not be sequenced
 * together via map,chain etc.
 *
 * This turns up compiler errors in unexpected places and is sometimes rectified
 * by extracting the values out of the Either type completley and constructing
 * a fresh one.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.either = exports.fromBoolean = exports.right = exports.left = exports.Right = exports.Left = exports.Either = void 0;
const maybe_1 = require("./maybe");
/**
 * The abstract Either class.
 *
 * This is the type that will be used in signatures.
 */
class Either {
    of(value) {
        return new Right(value);
    }
}
exports.Either = Either;
/**
 * Left side of the Either implementation.
 */
class Left extends Either {
    constructor(value) {
        super();
        this.value = value;
    }
    map(_) {
        return new Left(this.value);
    }
    lmap(f) {
        return new Left(f(this.value));
    }
    bimap(f, _) {
        return new Left(f(this.value));
    }
    alt(a) {
        return a;
    }
    chain(_) {
        return new Left(this.value);
    }
    ap(_) {
        return new Left(this.value);
    }
    extend(_) {
        return new Left(this.value);
    }
    fold(f, _) {
        return f(this.value);
    }
    eq(m) {
        return ((m instanceof Left) && (m.value === this.value));
    }
    orElse(f) {
        return f(this.value);
    }
    orRight(f) {
        return new Right(f(this.value));
    }
    isLeft() {
        return true;
    }
    isRight() {
        return false;
    }
    takeLeft() {
        return this.value;
    }
    takeRight() {
        throw new TypeError(`Not right!`);
    }
    toMaybe() {
        return (0, maybe_1.nothing)();
    }
}
exports.Left = Left;
/**
 * Right side implementation.
 */
class Right extends Either {
    constructor(value) {
        super();
        this.value = value;
    }
    map(f) {
        return new Right(f(this.value));
    }
    lmap(_) {
        return new Right(this.value);
    }
    bimap(_, g) {
        return new Right(g(this.value));
    }
    alt(_) {
        return this;
    }
    chain(f) {
        return f(this.value);
    }
    ap(e) {
        return e.map(f => f(this.value));
    }
    extend(f) {
        return new Right(f(this));
    }
    eq(m) {
        return ((m instanceof Right) && (m.value === this.value));
    }
    fold(_, g) {
        return g(this.value);
    }
    orElse(_) {
        return this;
    }
    orRight(_) {
        return this;
    }
    isLeft() {
        return false;
    }
    isRight() {
        return true;
    }
    takeLeft() {
        throw new TypeError(`Not left!`);
    }
    takeRight() {
        return this.value;
    }
    toMaybe() {
        return (0, maybe_1.just)(this.value);
    }
}
exports.Right = Right;
/**
 * left constructor helper.
 */
const left = (a) => new Left(a);
exports.left = left;
/**
 * right constructor helper.
 */
const right = (b) => new Right(b);
exports.right = right;
/**
 * fromBoolean constructs an Either using a boolean value.
 */
const fromBoolean = (b) => b ? (0, exports.right)(true) : (0, exports.left)(false);
exports.fromBoolean = fromBoolean;
/**
 * either given two functions, first for Left, second for Right, will return
 * the result of applying the appropriate function to an Either's internal value.
 */
const either = (f) => (g) => (e) => (e instanceof Right) ? g(e.takeRight()) : f(e.takeLeft());
exports.either = either;
//# sourceMappingURL=either.js.map