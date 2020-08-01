"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escape = exports.REGEX_SPECIAL_CHARS = void 0;
exports.REGEX_SPECIAL_CHARS = /[\\^$*+?.()|[\]{}]/g;
/**
 * escape a string to be included in a regular expression.
 *
 * Characters that match REGEX_SPECIAL_CHARS will be prefixed with a backslash
 * preventing their special meaning.
 * NOTE: When using this function, the context of the regex being formed is
 * important. For example, a regex formed as:
 * ```
 * new RegExp("\\" + escape("w"))
 * ```
 * ends up creating the expression, `/\w/`.
 *
 * To avoid unforseen, subtle bugs, keep regular expressions generated from user
 * input simple.
 */
exports.escape = function (str) {
    return String(str)
        .replace(exports.REGEX_SPECIAL_CHARS, '\\$&')
        .replace(/-/g, '\\u002d')
        .replace(/-/g, '\\x2d');
};
//# sourceMappingURL=regex.js.map