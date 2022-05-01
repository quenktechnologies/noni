"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
/**
 * jsonx provides TypeScript definitions for an extended JSON to include Dates
 * and Buffers. This module's purpose is primarily for use with database APIs
 * that accept some non-primitive types.
 */
const error_1 = require("../../control/error");
/**
 * parse a string as JSONX safely.
 */
const parse = (s) => (0, error_1.attempt)(() => JSON.parse(s));
exports.parse = parse;
//# sourceMappingURL=index.js.map