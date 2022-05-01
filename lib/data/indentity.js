"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pure = exports.Identity = void 0;
/**
 * Identity monad.
 *
 * This class is here mostly for future iterations of this libary.
 * The Identity class typically returns the value supplied for most of its
 * operations.
 */
class Identity {
    constructor(value) {
        this.value = value;
    }
    /**
     * of
     */
    of(a) {
        return new Identity(a);
    }
    /**
     * map
     */
    map(f) {
        return new Identity(f(this.value));
    }
    /**
     * chain
     */
    chain(f) {
        return f(this.value);
    }
    /**
     * ap
     */
    ap(i) {
        return new Identity(i.value(this.value));
    }
    /**
     * alt will prefer whatever Maybe instance provided.
     */
    alt(a) {
        return a;
    }
    /**
     * eq
     */
    eq(i) {
        return i.value === this.value;
    }
}
exports.Identity = Identity;
/**
 * pure wraps a value in an Identity.
 */
const pure = (value) => new Identity(value);
exports.pure = pure;
//# sourceMappingURL=indentity.js.map