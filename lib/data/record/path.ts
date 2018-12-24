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
 * If you need to use the dots or square brackets in your paths, escape them
 * as follows:
 *
 * "." -> ".."
 * "[" -> "[["
 * "]" -> "]]"
 */
/** imports **/
import { Maybe, fromNullable } from '../maybe';
import { Record, clone, reduce } from './';

const TOKEN_DOT = '.';
const TOKEN_BRACKET_LEFT = '[';
const TOKEN_BRACKET_RIGHT = ']';

/**
 * Path representing a path to a value in an object.
 */
export type Path = string;

/**
 * Token represents the name of a single property (not a path to one!).
 */
export type Token = string;

/**
 * tokenize a path into a list of sequential property names.
 */
export const tokenize = (str: Path): Token[] => {

    let i = 0;
    let buf = '';
    let curr = ''
    let next = '';
    let tokens: string[] = [];

    while (i < str.length) {

        curr = str[i];
        next = str[i + 1];

        if ((curr === TOKEN_DOT) && (next === TOKEN_DOT)) {

            //escaped dot
            buf = `${buf}${curr}`;
            i++;

        } else if (curr === TOKEN_DOT) {

            if (buf !== '')
                tokens.push(buf); //recognize a path and push a new token

            buf = '';

        } else if ((curr === TOKEN_BRACKET_LEFT) &&
            (next === TOKEN_BRACKET_LEFT)) {

            //escaped left bracket
            buf = `${buf}${TOKEN_BRACKET_LEFT}`;
            i++;

        } else if ((curr === TOKEN_BRACKET_LEFT) &&
            next === TOKEN_BRACKET_RIGHT) {

            //intercept empty bracket paths
            i++;

        } else if (curr === TOKEN_BRACKET_LEFT) {

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

                } else if (curr === TOKEN_BRACKET_RIGHT) {

                    //successfully tokenized the path

                    if (buf !== '')
                        tokens.push(buf); //save the previous path

                    tokens.push(bracketBuf); //save the current path
                    buf = '';
                    break;

                } else if (curr == null) {

                    //no closing bracket found and we ran out of string to search

                    if (firstDot !== -1) {

                        //backtrack to the first dot encountered
                        i = firstDot;

                        //save the paths so far
                        tokens.push(`${buf}${TOKEN_BRACKET_LEFT}${firstDotBuf}`);
                        buf = '';
                        break;

                    } else {

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

        } else {

            buf = `${buf}${curr}`;

        }

        i++;

    }

    if ((buf.length > 0))
        tokens.push(buf);

    return tokens;

}

/**
 * unsafeGet retrieves a value at the specified path
 * on any ES object.
 * 
 * This function does not check if getting the value succeeded or not.
 */
export const unsafeGet = <A>(path: Path, src: Record<A>): A => {

    let toks = tokenize(path);
    let head: any = (<any>src)[<Token>toks.shift()];
    return toks.reduce((p, c) => (p == null) ? p : p[c], head);

}

/**
 * get a value from a Record given its path safely.
 */
export const get = <A>(path: Path, src: Record<A>): Maybe<A> =>
    fromNullable(unsafeGet(path, src));

/**
 * set sets a value on an object given a path.
 */
export const set = <A, R extends Record<A>>(p: Path, v: A, r: R): R => {

    let toks = tokenize(p);
    return _set(r, v, toks);

}

const _set = (r: any, value: any, toks: string[]): any => {

    let o: any;

    if (toks.length === 0) return value;

    o = ((typeof r !== 'object') || (r === null)) ? {} : clone(r);
    o[toks[0]] = _set((o)[toks[0]], value, toks.slice(1));

    return o;

}

/**
 * escape a path so that occurences of dots and brackets are not interpreted
 * as paths.
 */
export const escape = (p: Path): Path =>
    p
        .split(TOKEN_DOT)
        .join(TOKEN_DOT + TOKEN_DOT)
        .split(TOKEN_BRACKET_LEFT)
        .join(TOKEN_BRACKET_LEFT + TOKEN_BRACKET_LEFT)
        .split(TOKEN_BRACKET_RIGHT)
        .join(TOKEN_BRACKET_RIGHT + TOKEN_BRACKET_RIGHT);

/**
 * unescape a path that has been previously escaped.
 */
export const unescape = (p: Path): Path =>
    p
        .split(TOKEN_DOT + TOKEN_DOT)
        .join(TOKEN_DOT)
        .split(TOKEN_BRACKET_LEFT + TOKEN_BRACKET_LEFT)
        .join(TOKEN_BRACKET_LEFT)
        .split(TOKEN_BRACKET_RIGHT + TOKEN_BRACKET_RIGHT)
        .join(TOKEN_BRACKET_RIGHT);

/**
 * escapeRecord escapes each property of a record recursively.
 */
export const escapeRecord = <A>(r: Record<A>): Record<A> =>
    _escapeRecord(r);

const _escapeRecord = <A>(r: Record<A>): Record<A> =>
    reduce(r, <Record<any>>{}, (p, c, k) => {

        if (Array.isArray(c))
            p[escape(k)] = c.map(_escapeRecord);
        else if (typeof c === 'object')
            p[escape(k)] = escapeRecord(<any>c);
        else
            p[escape(k)] = c;

        return p

    })

/**
 * unescapeRecord unescapes each property of a record recursively.
 */
export const unescapeRecord = <A>(r: Record<A>): Record<A> =>
    _unescapeRecord(r);

const _unescapeRecord = <A>(r: Record<A>): Record<A> =>
    reduce(r, <Record<any>>{}, (p, c, k) => {

        if (Array.isArray(c))
            p[unescape(k)] = c.map(_unescapeRecord);
        else if (typeof c === 'object')
            p[unescape(k)] = unescapeRecord(<any>c);
        else
            p[unescape(k)] = c;

        return p

    })


