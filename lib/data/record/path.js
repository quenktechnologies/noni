"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.project = exports.unflatten = exports.flatten = exports.unescapeRecord = exports.escapeRecord = exports.unescape = exports.escape = exports.set = exports.getString = exports.getDefault = exports.get = exports.unsafeGet = exports.tokenize = void 0;
/**
 * This module provides a syntax and associated functions for
 * getting and setting values on ES objects easily.
 *
 * Given a path, a value can either be retrieved or set on an object.
 *
 * The path syntax follows typical ES dot notation, bracket notation or a mixture
 * of both.
 *
 * Note that quotes are not used when describing a path via bracket notation.
 *
 * If you need to use a dot or square brackets in your paths, prefix them with
 * the "\" (backslash) character.
 */
/** imports **/
var maybe_1 = require("../maybe");
var _1 = require("./");
var TOKEN_DOT = '.';
var TOKEN_BRACKET_LEFT = '[';
var TOKEN_BRACKET_RIGHT = ']';
var TOKEN_ESCAPE = '\\';
/**
 * tokenize a path into a list of sequential property names.
 */
var tokenize = function (str) {
    var i = 0;
    var buf = '';
    var curr = '';
    var next = '';
    var tokens = [];
    while (i < str.length) {
        curr = str[i];
        next = str[i + 1];
        if (curr === TOKEN_ESCAPE) {
            //escape sequence
            buf = "".concat(buf).concat(next);
            i++;
        }
        else if (curr === TOKEN_DOT) {
            if (buf !== '')
                tokens.push(buf); //recognize a path and push a new token
            buf = '';
        }
        else if ((curr === TOKEN_BRACKET_LEFT) &&
            next === TOKEN_BRACKET_RIGHT) {
            //intercept empty bracket paths
            i++;
        }
        else if (curr === TOKEN_BRACKET_LEFT) {
            var bracketBuf = '';
            var firstDot = -1;
            var firstDotBuf = '';
            i++;
            while (true) {
                //everything between brackets is treated as a path
                //if no closing bracket is found, we back track to the first dot
                //if there is no dot the whole buffer is treated as a path
                curr = str[i];
                next = str[i + 1];
                if ((curr === TOKEN_BRACKET_RIGHT) &&
                    (next === TOKEN_BRACKET_RIGHT)) {
                    //escaped right bracket
                    bracketBuf = "".concat(bracketBuf).concat(TOKEN_BRACKET_RIGHT);
                    i++;
                }
                else if (curr === TOKEN_BRACKET_RIGHT) {
                    //successfully tokenized the path
                    if (buf !== '')
                        tokens.push(buf); //save the previous path
                    tokens.push(bracketBuf); //save the current path
                    buf = '';
                    break;
                }
                else if (curr == null) {
                    //no closing bracket found and we ran out of string to search
                    if (firstDot !== -1) {
                        //backtrack to the first dot encountered
                        i = firstDot;
                        //save the paths so far
                        tokens.push("".concat(buf).concat(TOKEN_BRACKET_LEFT).concat(firstDotBuf));
                        buf = '';
                        break;
                    }
                    else {
                        //else if no dots were found treat the current buffer
                        // and rest of the string as part of one path.
                        buf = "".concat(buf).concat(TOKEN_BRACKET_LEFT).concat(bracketBuf);
                        break;
                    }
                }
                if ((curr === TOKEN_DOT) && (firstDot === -1)) {
                    //take note of the location and tokens between 
                    //the opening bracket and first dot.
                    //If there is no closing bracket, we use this info to
                    //lex properly.
                    firstDot = i;
                    firstDotBuf = bracketBuf;
                }
                bracketBuf = "".concat(bracketBuf).concat(curr);
                i++;
            }
        }
        else {
            buf = "".concat(buf).concat(curr);
        }
        i++;
    }
    if ((buf.length > 0))
        tokens.push(buf);
    return tokens;
};
exports.tokenize = tokenize;
/**
 * unsafeGet retrieves a value at the specified path
 * on any ES object.
 *
 * This function does not check if getting the value succeeded or not.
 */
var unsafeGet = function (path, src) {
    if (src == null)
        return undefined;
    var toks = (0, exports.tokenize)(path);
    var head = src[toks.shift()];
    return toks.reduce(function (p, c) { return (p == null) ? p : p[c]; }, head);
};
exports.unsafeGet = unsafeGet;
/**
 * get a value from a Record given its path safely.
 */
var get = function (path, src) {
    return (0, maybe_1.fromNullable)((0, exports.unsafeGet)(path, src));
};
exports.get = get;
/**
 * getDefault is like get but takes a default value to return if
 * the path is not found.
 */
var getDefault = function (path, src, def) {
    return (0, exports.get)(path, src).orJust(function () { return def; }).get();
};
exports.getDefault = getDefault;
/**
 * getString casts the resulting value to a string.
 *
 * An empty string is provided if the path is not found.
 */
var getString = function (path, src) {
    return (0, exports.get)(path, src).map(function (v) { return String(v); }).orJust(function () { return ''; }).get();
};
exports.getString = getString;
/**
 * set sets a value on an object given a path.
 */
var set = function (p, v, r) {
    var toks = (0, exports.tokenize)(p);
    return _set(r, v, toks);
};
exports.set = set;
var _set = function (r, value, toks) {
    var o;
    if (toks.length === 0)
        return value;
    o = (0, _1.isRecord)(r) ? (0, _1.clone)(r) : {};
    o = (0, _1.set)(o, toks[0], _set(o[toks[0]], value, toks.slice(1)));
    return o;
};
/**
 * escape a path so that occurences of dots are not interpreted as paths.
 *
 * This function escapes dots and dots only.
 */
var escape = function (p) {
    var i = 0;
    var buf = '';
    var curr = '';
    while (i < p.length) {
        curr = p[i];
        if ((curr === TOKEN_ESCAPE) || (curr === TOKEN_DOT))
            buf = "".concat(buf).concat(TOKEN_ESCAPE).concat(curr);
        else
            buf = "".concat(buf).concat(curr);
        i++;
    }
    return buf;
};
exports.escape = escape;
/**
 * unescape a path that has been previously escaped.
 */
var unescape = function (p) {
    var i = 0;
    var curr = '';
    var next = '';
    var buf = '';
    while (i < p.length) {
        curr = p[i];
        next = p[i + 1];
        if (curr === TOKEN_ESCAPE) {
            buf = "".concat(buf).concat(next);
            i++;
        }
        else {
            buf = "".concat(buf).concat(curr);
        }
        i++;
    }
    return buf;
};
exports.unescape = unescape;
/**
 * escapeRecord escapes each property of a record recursively.
 */
var escapeRecord = function (r) {
    return (0, _1.reduce)(r, {}, function (p, c, k) {
        if (typeof c === 'object')
            p = (0, _1.set)(p, (0, exports.escape)(k), (0, exports.escapeRecord)(c));
        else
            p = (0, _1.set)(p, (0, exports.escape)(k), c);
        return p;
    });
};
exports.escapeRecord = escapeRecord;
/**
 * unescapeRecord unescapes each property of a record recursively.
 */
var unescapeRecord = function (r) {
    return (0, _1.reduce)(r, {}, function (p, c, k) {
        if ((0, _1.isRecord)(c))
            p = (0, _1.set)(p, (0, exports.unescape)(k), (0, exports.unescapeRecord)(c));
        else
            p = (0, _1.set)(p, (0, exports.unescape)(k), c);
        return p;
    });
};
exports.unescapeRecord = unescapeRecord;
/**
 * flatten an object into a Record where each key is a path to a non-complex
 * value or array.
 *
 * If any of the paths contain dots, they will be escaped.
 */
var flatten = function (r) {
    return (flatImpl('')({})(r));
};
exports.flatten = flatten;
var flatImpl = function (pfix) { return function (prev) {
    return function (r) {
        return (0, _1.reduce)(r, prev, function (p, c, k) { return (0, _1.isRecord)(c) ?
            (flatImpl(prefix(pfix, k))(p)(c)) :
            (0, _1.merge)(p, (0, _1.set)({}, prefix(pfix, k), c)); });
    };
}; };
var prefix = function (pfix, key) { return (pfix === '') ?
    (0, exports.escape)(key) : "".concat(pfix, ".").concat((0, exports.escape)(key)); };
/**
 * unflatten a flattened Record so that any nested paths are expanded
 * to their full representation.
 */
var unflatten = function (r) {
    return (0, _1.reduce)(r, {}, function (p, c, k) { return (0, exports.set)(k, c, p); });
};
exports.unflatten = unflatten;
/**
 * project a Record according to the field specification given.
 *
 * Only properties that appear in the spec and set to true will be retained.
 * This function may violate type safety and may leave undefined holes in the
 * result.
 */
var project = function (spec, rec) {
    return (0, _1.reduce)(spec, {}, function (p, c, k) {
        return (c === true) ? (0, exports.set)(k, (0, exports.unsafeGet)(k, rec), p) : p;
    });
};
exports.project = project;
//# sourceMappingURL=path.js.map