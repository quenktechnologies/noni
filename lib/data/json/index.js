"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("../../control/error");
/**
 * parse a string as JSON safely.
 */
exports.parse = function (s) {
    return error_1.attempt(function () { return JSON.parse(s); });
};
//# sourceMappingURL=index.js.map