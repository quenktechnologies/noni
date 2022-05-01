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
const maybe_1 = require("../maybe");
const _1 = require("./");
const TOKEN_DOT = '.';
const TOKEN_BRACKET_LEFT = '[';
const TOKEN_BRACKET_RIGHT = ']';
const TOKEN_ESCAPE = '\\';
/**
 * tokenize a path into a list of sequential property names.
 */
const tokenize = (str) => {
    let i = 0;
    let buf = '';
    let curr = '';
    let next = '';
    let tokens = [];
    while (i < str.length) {
        curr = str[i];
        next = str[i + 1];
        if (curr === TOKEN_ESCAPE) {
            //escape sequence
            buf = `${buf}${next}`;
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
            let bracketBuf = '';
            let firstDot = -1;
            let firstDotBuf = '';
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
                    bracketBuf = `${bracketBuf}${TOKEN_BRACKET_RIGHT}`;
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
                        tokens.push(`${buf}${TOKEN_BRACKET_LEFT}${firstDotBuf}`);
                        buf = '';
                        break;
                    }
                    else {
                        //else if no dots were found treat the current buffer
                        // and rest of the string as part of one path.
                        buf = `${buf}${TOKEN_BRACKET_LEFT}${bracketBuf}`;
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
                bracketBuf = `${bracketBuf}${curr}`;
                i++;
            }
        }
        else {
            buf = `${buf}${curr}`;
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
const unsafeGet = (path, src) => {
    if (src == null)
        return undefined;
    let toks = (0, exports.tokenize)(path);
    let head = src[toks.shift()];
    return toks.reduce((p, c) => (p == null) ? p : p[c], head);
};
exports.unsafeGet = unsafeGet;
/**
 * get a value from a Record given its path safely.
 */
const get = (path, src) => (0, maybe_1.fromNullable)((0, exports.unsafeGet)(path, src));
exports.get = get;
/**
 * getDefault is like get but takes a default value to return if
 * the path is not found.
 */
const getDefault = (path, src, def) => (0, exports.get)(path, src).orJust(() => def).get();
exports.getDefault = getDefault;
/**
 * getString casts the resulting value to a string.
 *
 * An empty string is provided if the path is not found.
 */
const getString = (path, src) => (0, exports.get)(path, src).map(v => String(v)).orJust(() => '').get();
exports.getString = getString;
/**
 * set sets a value on an object given a path.
 */
const set = (p, v, r) => {
    let toks = (0, exports.tokenize)(p);
    return _set(r, v, toks);
};
exports.set = set;
const _set = (r, value, toks) => {
    let o;
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
const escape = (p) => {
    let i = 0;
    let buf = '';
    let curr = '';
    while (i < p.length) {
        curr = p[i];
        if ((curr === TOKEN_ESCAPE) || (curr === TOKEN_DOT))
            buf = `${buf}${TOKEN_ESCAPE}${curr}`;
        else
            buf = `${buf}${curr}`;
        i++;
    }
    return buf;
};
exports.escape = escape;
/**
 * unescape a path that has been previously escaped.
 */
const unescape = (p) => {
    let i = 0;
    let curr = '';
    let next = '';
    let buf = '';
    while (i < p.length) {
        curr = p[i];
        next = p[i + 1];
        if (curr === TOKEN_ESCAPE) {
            buf = `${buf}${next}`;
            i++;
        }
        else {
            buf = `${buf}${curr}`;
        }
        i++;
    }
    return buf;
};
exports.unescape = unescape;
/**
 * escapeRecord escapes each property of a record recursively.
 */
const escapeRecord = (r) => (0, _1.reduce)(r, {}, (p, c, k) => {
    if (typeof c === 'object')
        p = (0, _1.set)(p, (0, exports.escape)(k), (0, exports.escapeRecord)(c));
    else
        p = (0, _1.set)(p, (0, exports.escape)(k), c);
    return p;
});
exports.escapeRecord = escapeRecord;
/**
 * unescapeRecord unescapes each property of a record recursively.
 */
const unescapeRecord = (r) => (0, _1.reduce)(r, {}, (p, c, k) => {
    if ((0, _1.isRecord)(c))
        p = (0, _1.set)(p, (0, exports.unescape)(k), (0, exports.unescapeRecord)(c));
    else
        p = (0, _1.set)(p, (0, exports.unescape)(k), c);
    return p;
});
exports.unescapeRecord = unescapeRecord;
/**
 * flatten an object into a Record where each key is a path to a non-complex
 * value or array.
 *
 * If any of the paths contain dots, they will be escaped.
 */
const flatten = (r) => (flatImpl('')({})(r));
exports.flatten = flatten;
const flatImpl = (pfix) => (prev) => (r) => (0, _1.reduce)(r, prev, (p, c, k) => (0, _1.isRecord)(c) ?
    (flatImpl(prefix(pfix, k))(p)(c)) :
    (0, _1.merge)(p, (0, _1.set)({}, prefix(pfix, k), c)));
const prefix = (pfix, key) => (pfix === '') ?
    (0, exports.escape)(key) : `${pfix}.${(0, exports.escape)(key)}`;
/**
 * unflatten a flattened Record so that any nested paths are expanded
 * to their full representation.
 */
const unflatten = (r) => (0, _1.reduce)(r, {}, (p, c, k) => (0, exports.set)(k, c, p));
exports.unflatten = unflatten;
/**
 * project a Record according to the field specification given.
 *
 * Only properties that appear in the spec and set to true will be retained.
 * This function may violate type safety and may leave undefined holes in the
 * result.
 */
const project = (spec, rec) => (0, _1.reduce)(spec, {}, (p, c, k) => (c === true) ? (0, exports.set)(k, (0, exports.unsafeGet)(k, rec), p) : p);
exports.project = project;
//# sourceMappingURL=path.js.map