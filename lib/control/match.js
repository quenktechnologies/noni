"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.match = exports.Matched = exports.UnMatched = void 0;
const type_1 = require("../data/type");
/**
 * UnMatched represents a value yet to have a successful match.
 */
class UnMatched {
    constructor(value) {
        this.value = value;
    }
    caseOf(pattern, f) {
        return (0, type_1.test)(this.value, pattern) ?
            new Matched(f(this.value)) : this;
    }
    /**
     * orElse produces the alternative value since no cases have been matched yet.
     */
    orElse(f) {
        return new Matched(f(this.value));
    }
    /**
     * end
     *
     * Calling end on an UnMatched is an error.
     */
    end() {
        throw new Error(`The pattern '${(0, type_1.show)(this.value)}' was not matched!`);
    }
}
exports.UnMatched = UnMatched;
/**
 * Matched represents a succefully matched case.
 */
class Matched {
    constructor(value) {
        this.value = value;
    }
    caseOf(_, __) {
        return this;
    }
    /**
     * orElse does nothing.
     */
    orElse(_) {
        return this;
    }
    /**
     * end produces the value the Matched was created with.
     */
    end() {
        return this.value;
    }
}
exports.Matched = Matched;
/**
 * match wraps a value in an UnMatched so that case tests can be applied.
 */
const match = (value) => new UnMatched(value);
exports.match = match;
//# sourceMappingURL=match.js.map