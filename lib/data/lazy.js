"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
/**
 * evaluate a potentially lazy value provided its actual value.
 */
const evaluate = (value) => (typeof value === 'function') ? value() : value;
exports.evaluate = evaluate;
//# sourceMappingURL=lazy.js.map