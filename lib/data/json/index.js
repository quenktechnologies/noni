"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides typescript definitions for JSON strings unserialzed into JavaScript objects.
 */
var either_1 = require("../either");
/**
 * parse a string as JSON safely.
 */
exports.parse = function (s) {
    try {
        return either_1.right(JSON.parse(s));
    }
    catch (e) {
        return either_1.left(e);
    }
};
//# sourceMappingURL=index.js.map