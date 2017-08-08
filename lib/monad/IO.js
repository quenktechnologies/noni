"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * wrapIO a value in the IO monad
 */
exports.wrapIO = function (a) { return new IO(function () { return a; }); };
/**
 * safeIO accepts a function that has side effects and wrapIOs it in an IO Monad.
 */
exports.safeIO = function (f) { return new IO(f); };
exports.pure = exports.wrapIO;
exports.suspend = exports.safeIO;
/**
 * IO monadic type for containing interactions with the 'real world'.
 */
var IO = (function () {
    function IO(effect) {
        this.effect = effect;
    }
    IO.prototype.of = function (v) {
        return new IO(function () { return v; });
    };
    IO.prototype.map = function (f) {
        var _this = this;
        return new IO(function () { return f(_this.effect()); });
    };
    IO.prototype.mapIn = function (b) {
        return this.map(function () { return b; });
    };
    /**
     * chain
     */
    IO.prototype.chain = function (f) {
        var _this = this;
        return new IO(function () { return f(_this.effect()).run(); });
    };
    IO.prototype.chainIn = function (b) {
        return this.chain(function () { return exports.wrapIO(b); });
    };
    /**
     * run
     */
    IO.prototype.run = function () {
        return this.effect();
    };
    IO.safeIO = exports.safeIO;
    IO.pure = exports.pure;
    IO.suspend = exports.suspend;
    IO.chain = function (f) { return function (m) { return m.chain(f); }; };
    return IO;
}());
exports.IO = IO;
//# sourceMappingURL=IO.js.map