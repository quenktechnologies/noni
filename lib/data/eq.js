"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueEq = void 0;
/**
 * valueEq preforms the equality test on two objects
 * that have a property called 'value'.
 */
var valueEq = function (l) { return function (r) { return l.value === r.value; }; };
exports.valueEq = valueEq;
//# sourceMappingURL=eq.js.map