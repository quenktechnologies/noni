"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("../data/type");
/**
 * UnMatchedResult represents a yet to be matched pattern.
 */
var UnMatchedResult = /** @class */ (function () {
    function UnMatchedResult(value) {
        this.value = value;
    }
    UnMatchedResult.prototype.caseOf = function (p, f) {
        return type_1.typeOf(this.value, p) ?
            new MatchedResult(f(this.value)) : this;
    };
    UnMatchedResult.prototype.orElse = function (f) {
        return new MatchedResult(f(this.value));
    };
    UnMatchedResult.prototype.end = function () {
        throw new Error("The pattern '" + this.value + "' was not matched!");
    };
    return UnMatchedResult;
}());
exports.UnMatchedResult = UnMatchedResult;
/**
 * MatchedResult indicates a successful pattern match.
 */
var MatchedResult = /** @class */ (function () {
    function MatchedResult(value) {
        this.value = value;
    }
    MatchedResult.prototype.caseOf = function (_p, _f) {
        return this;
    };
    MatchedResult.prototype.orElse = function (_f) {
        return this;
    };
    MatchedResult.prototype.end = function () {
        return this.value;
    };
    return MatchedResult;
}());
exports.MatchedResult = MatchedResult;
/**
 * match expression.
 */
exports.match = function (value) { return new UnMatchedResult(value); };
//# sourceMappingURL=match.js.map