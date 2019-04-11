"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.tokenize = function (str) {
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
            buf = "" + buf + next;
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
                    bracketBuf = "" + bracketBuf + TOKEN_BRACKET_RIGHT;
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
                        tokens.push("" + buf + TOKEN_BRACKET_LEFT + firstDotBuf);
                        buf = '';
                        break;
                    }
                    else {
                        //else if no dots were found treat the current buffer
                        // and rest of the string as part of one path.
                        buf = "" + buf + TOKEN_BRACKET_LEFT + bracketBuf;
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
                bracketBuf = "" + bracketBuf + curr;
                i++;
            }
        }
        else {
            buf = "" + buf + curr;
        }
        i++;
    }
    if ((buf.length > 0))
        tokens.push(buf);
    return tokens;
};
/**
 * unsafeGet retrieves a value at the specified path
 * on any ES object.
 *
 * This function does not check if getting the value succeeded or not.
 */
exports.unsafeGet = function (path, src) {
    var toks = exports.tokenize(path);
    var head = src[toks.shift()];
    return toks.reduce(function (p, c) { return (p == null) ? p : p[c]; }, head);
};
/**
 * get a value from a Record given its path safely.
 */
exports.get = function (path, src) {
    return maybe_1.fromNullable(exports.unsafeGet(path, src));
};
/**
 * set sets a value on an object given a path.
 */
exports.set = function (p, v, r) {
    var toks = exports.tokenize(p);
    return _set(r, v, toks);
};
var _set = function (r, value, toks) {
    var o;
    if (toks.length === 0)
        return value;
    o = _1.isRecord(r) ? _1.clone(r) : {};
    o[toks[0]] = _set(o[toks[0]], value, toks.slice(1));
    return o;
};
/**
 * escape a path so that occurences of dots are not interpreted as paths.
 *
 * This function escapes dots and dots only.
 */
exports.escape = function (p) {
    var i = 0;
    var buf = '';
    var curr = '';
    while (i < p.length) {
        curr = p[i];
        if ((curr === TOKEN_ESCAPE) || (curr === TOKEN_DOT))
            buf = "" + buf + TOKEN_ESCAPE + curr;
        else
            buf = "" + buf + curr;
        i++;
    }
    return buf;
};
/**
 * unescape a path that has been previously escaped.
 */
exports.unescape = function (p) {
    var i = 0;
    var curr = '';
    var next = '';
    var buf = '';
    while (i < p.length) {
        curr = p[i];
        next = p[i + 1];
        if (curr === TOKEN_ESCAPE) {
            buf = "" + buf + next;
            i++;
        }
        else {
            buf = "" + buf + curr;
        }
        i++;
    }
    return buf;
};
/**
 * escapeRecord escapes each property of a record recursively.
 */
exports.escapeRecord = function (r) {
    return _1.reduce(r, {}, function (p, c, k) {
        if (typeof c === 'object')
            p[exports.escape(k)] = exports.escapeRecord(c);
        else
            p[exports.escape(k)] = c;
        return p;
    });
};
/**
 * unescapeRecord unescapes each property of a record recursively.
 */
exports.unescapeRecord = function (r) {
    return _1.reduce(r, {}, function (p, c, k) {
        if (_1.isRecord(c))
            p[exports.unescape(k)] = exports.unescapeRecord(c);
        else
            p[exports.unescape(k)] = c;
        return p;
    });
};
/**
 * flatten an object into a Record where each key is a path to a non-complex
 * value or array.
 *
 * If any of the paths contain dots, they will be escaped.
 */
exports.flatten = function (r) {
    return (flatImpl('')({})(r));
};
var flatImpl = function (pfix) { return function (prev) {
    return function (r) {
        return _1.reduce(r, prev, function (p, c, k) {
            var _a;
            return _1.isRecord(c) ?
                (flatImpl(prefix(pfix, k))(p)(c)) :
                _1.merge(p, (_a = {}, _a[prefix(pfix, k)] = c, _a));
        });
    };
}; };
var prefix = function (pfix, key) { return (pfix === '') ?
    exports.escape(key) : pfix + "." + exports.escape(key); };
/**
 * unflatten a flattened Record so that any nested paths are expanded
 * to their full representation.
 */
exports.unflatten = function (r) {
    return _1.reduce(r, {}, function (p, c, k) { return exports.set(k, c, p); });
};
/**
 * intersect set operation between the keys of two records.
 *
 * All the properties of the left record that have matching property
 * names in the right are retained.
 */
exports.intersect = function (a, b) {
    return _1.reduce(a, {}, function (p, c, k) {
        if (b.hasOwnProperty(k))
            p[k] = c;
        return p;
    });
};
/**
 * difference set operation between the keys of two records.
 *
 * All the properties on the left record that do not have matching
 * property names in the right are retained.
 */
exports.difference = function (a, b) {
    return _1.reduce(a, {}, function (p, c, k) {
        if (!b.hasOwnProperty(k))
            p[k] = c;
        return p;
    });
};
/**
 * map over the property names of a record.
 */
exports.map = function (a, f) {
    return _1.reduce(a, {}, function (p, c, k) {
        p[f(k)] = c;
        return p;
    });
};
//# sourceMappingURL=path.js.map