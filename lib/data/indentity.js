"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Identity monad.
 *
 * This class is here mostly for future iterations of this libary.
 * The Identity class typically returns the value supplied for most of its
 * operations.
 */
var Identity = /** @class */ (function () {
    function Identity(value) {
        this.value = value;
    }
    /**
     * of
     */
    Identity.prototype.of = function (a) {
        return new Identity(a);
    };
    /**
     * map
     */
    Identity.prototype.map = function (f) {
        return new Identity(f(this.value));
    };
    /**
     * chain
     */
    Identity.prototype.chain = function (f) {
        return f(this.value);
    };
    /**
     * ap
     */
    Identity.prototype.ap = function (i) {
        return new Identity(i.value(this.value));
    };
    /**
     * alt will prefer whatever Maybe instance provided.
     */
    Identity.prototype.alt = function (a) {
        return a;
    };
    /**
     * eq
     */
    Identity.prototype.eq = function (i) {
        return i.value === this.value;
    };
    return Identity;
}());
exports.Identity = Identity;
/**
 * pure wraps a value in an Identity.
 */
exports.pure = function (value) {
    return new Identity(value);
};
//# sourceMappingURL=indentity.js.map