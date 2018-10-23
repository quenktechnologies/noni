"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The match module provides a best effort pattern runtime pattern matching
 * framework for ECMAScript.
 *
 * Example:
 * ```ts
 *
 *    let r:string = match(window.global)
 *                   .caseOf(1, (_:number) => 'one')
 *                   .caseOf('one', (n:string) => n)
 *                   .orElse(()=> 'N/A')
 *                   .end();
 *
 * ```
 * This framework uses the data/type#test function to do the actual
 * pattern matching and attention must be paid to the rules of that
 * function to avoid unexpected errors.
 *
 * Great effort was made to try and make the `caseOf` methods as
 * type safe as possible however it is still possible to evade the compiler
 * especially when the first argument is a shape (object with keys describing
 * allowed types).
 *
 */
var type_1 = require("../data/type");
/**
 * UnMatched represents a value yet to have a successful match.
 */
var UnMatched = /** @class */ (function () {
    function UnMatched(value) {
        this.value = value;
    }
    UnMatched.prototype.caseOf = function (pattern, f) {
        return type_1.test(this.value, pattern) ?
            new Matched(f(this.value)) : this;
    };
    /**
     * orElse produces the alternative value since no cases have been matched yet.
     */
    UnMatched.prototype.orElse = function (f) {
        return new Matched(f(this.value));
    };
    /**
     * end
     *
     * Calling end on an UnMatched is an error.
     */
    UnMatched.prototype.end = function () {
        throw new Error("The pattern '" + type_1.show(this.value) + "' was not matched!");
    };
    return UnMatched;
}());
exports.UnMatched = UnMatched;
/**
 * Matched represents a succefully matched case.
 */
var Matched = /** @class */ (function () {
    function Matched(value) {
        this.value = value;
    }
    Matched.prototype.caseOf = function (_, __) {
        return this;
    };
    /**
     * orElse does nothing.
     */
    Matched.prototype.orElse = function (_) {
        return this;
    };
    /**
     * end produces the value the Matched was created with.
     */
    Matched.prototype.end = function () {
        return this.value;
    };
    return Matched;
}());
exports.Matched = Matched;
/**
 * match wraps a value in an UnMatched so that case tests can be applied.
 */
exports.match = function (value) { return new UnMatched(value); };
//# sourceMappingURL=match.js.map