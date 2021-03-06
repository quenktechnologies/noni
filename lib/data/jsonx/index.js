"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
/**
 * jsonx provides TypeScript definitions for an extended JSON to include Dates
 * and Buffers. This module's purpose is primarily for use with database APIs
 * that accept some non-primitive types.
 */
var error_1 = require("../../control/error");
/**
 * parse a string as JSONX safely.
 */
var parse = function (s) {
    return error_1.attempt(function () { return JSON.parse(s); });
};
exports.parse = parse;
//# sourceMappingURL=index.js.map