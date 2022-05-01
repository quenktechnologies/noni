"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromNaN = exports.fromNumber = exports.fromBoolean = exports.fromString = exports.fromObject = exports.fromArray = exports.fromNullable = exports.just = exports.nothing = exports.of = exports.Just = exports.Nothing = void 0;
/**
 * Nothing represents the absence of a usable value.
 */
class Nothing {
    /**
     * map simply returns a Nothing<A>
     */
    map(_) {
        return new Nothing();
    }
    /**
     * ap allows for a function wrapped in a Just to apply
     * to value present in this Just.
     */
    ap(_) {
        return new Nothing();
    }
    /**
     * of wraps a value in a Just.
     */
    of(a) {
        return new Just(a);
    }
    /**
     * chain simply returns a Nothing<A>.
     */
    chain(_) {
        return new Nothing();
    }
    /**
     * alt will prefer whatever Maybe instance provided.
     */
    alt(a) {
        return a;
    }
    /**
     * empty provides a default Maybe.
     * Maybe.empty() = new Nothing()
     */
    empty() {
        return new Nothing();
    }
    /**
     * extend returns a Nothing<A>.
     */
    extend(_) {
        return new Nothing();
    }
    /**
     * eq returns true if compared to another Nothing instance.
     */
    eq(m) {
        return m instanceof Nothing;
    }
    /**
     * orJust converts a Nothing<A> to a Just
     * using the value from the provided function.
     */
    orJust(f) {
        return new Just(f());
    }
    /**
     * orElse allows an alternative Maybe value
     * to be provided since this one is Nothing<A>.
     */
    orElse(f) {
        return f();
    }
    isNothing() {
        return true;
    }
    isJust() {
        return false;
    }
    /**
     * get throws an error because there
     * is nothing here to get.
     */
    get() {
        throw new TypeError('Cannot get a value from Nothing!');
    }
}
exports.Nothing = Nothing;
/**
 * Just represents the presence of a usable value.
 */
class Just {
    constructor(value) {
        this.value = value;
    }
    /**
     * map over the value present in the Just.
     */
    map(f) {
        return new Just(f(this.value));
    }
    /**
     * ap allows for a function wrapped in a Just to apply
     * to value present in this Just.
     */
    ap(mb) {
        return mb.map(f => f(this.value));
    }
    /**
     * of wraps a value in a Just.
     */
    of(a) {
        return new Just(a);
    }
    /**
     * chain allows the sequencing of functions that return a Maybe.
     */
    chain(f) {
        return f(this.value);
    }
    /**
     * alt will prefer the first Just encountered (this).
     */
    alt(_) {
        return this;
    }
    /**
     * empty provides a default Maybe.
     * Maybe.empty() = new Nothing()
     */
    empty() {
        return new Nothing();
    }
    /**
     * extend allows sequencing of Maybes with
     * functions that unwrap into non Maybe types.
     */
    extend(f) {
        return new Just(f(this));
    }
    /**
     * eq tests the value of two Justs.
     */
    eq(m) {
        return ((m instanceof Just) && (m.value === this.value));
    }
    /**
     * orJust returns this Just.
     */
    orJust(_) {
        return this;
    }
    /**
     * orElse returns this Just
     */
    orElse(_) {
        return this;
    }
    isNothing() {
        return false;
    }
    isJust() {
        return true;
    }
    /**
     * get the value of this Just.
     */
    get() {
        return this.value;
    }
}
exports.Just = Just;
/**
 * of
 */
const of = (a) => new Just(a);
exports.of = of;
/**
 * nothing convenience constructor
 */
const nothing = () => new Nothing();
exports.nothing = nothing;
/**
 * just convenience constructor
 */
const just = (a) => new Just(a);
exports.just = just;
/**
 * fromNullable constructs a Maybe from a value that may be null.
 */
const fromNullable = (a) => a == null ?
    new Nothing() : new Just(a);
exports.fromNullable = fromNullable;
/**
 * fromArray checks an array to see if it's empty
 *
 * Returns [[Nothing]] if it is, [[Just]] otherwise.
 */
const fromArray = (a) => (a.length === 0) ? new Nothing() : new Just(a);
exports.fromArray = fromArray;
/**
 * fromObject uses Object.keys to turn see if an object
 * has any own properties.
 */
const fromObject = (o) => Object.keys(o).length === 0 ? new Nothing() : new Just(o);
exports.fromObject = fromObject;
/**
 * fromString constructs Nothing<A> if the string is empty or Just<A> otherwise.
 */
const fromString = (s) => (s === '') ? new Nothing() : new Just(s);
exports.fromString = fromString;
/**
 * fromBoolean constructs Nothing if b is false, Just<A> otherwise
 */
const fromBoolean = (b) => (b === false) ? new Nothing() : new Just(b);
exports.fromBoolean = fromBoolean;
/**
 * fromNumber constructs Nothing if n is 0 Just<A> otherwise.
 */
const fromNumber = (n) => (n === 0) ? new Nothing() : new Just(n);
exports.fromNumber = fromNumber;
/**
 * fromNaN constructs Nothing if a value is not a number or
 * Just<A> otherwise.
 */
const fromNaN = (n) => isNaN(n) ? new Nothing() : new Just(n);
exports.fromNaN = fromNaN;
//# sourceMappingURL=maybe.js.map