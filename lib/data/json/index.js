"use strict";
/**
 * json provides type definitions for working with parsed JSON.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var error_1 = require("../../control/error");
/**
 * parse a string as JSON safely.
 */
var parse = function (s) {
    return (0, error_1.attempt)(function () { return JSON.parse(s); });
};
exports.parse = parse;
//# sourceMappingURL=index.js.map