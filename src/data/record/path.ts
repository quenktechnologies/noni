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
import { Maybe, fromNullable } from '../maybe';
import { Record, clone, reduce, merge, isRecord } from './';

const TOKEN_DOT = '.';
const TOKEN_BRACKET_LEFT = '[';
const TOKEN_BRACKET_RIGHT = ']';
const TOKEN_ESCAPE = '\\';

/**
 * badKeys is a list of keys we don't want to copy around between objects.
 *
 * Mostly due to prototype pollution but who knows what other keys may become
 * a problem as the language matures.
 */
export const badKeys = ['__proto__'];

/**
 * Path representing a path to a value in an object.
 */
export type Path = string;

/**
 * FlatRecord represents a flat Record where the keys are actually
 * paths to a more complex one.
 */
export interface FlatRecord<A> {

    [key: string]: A

}

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

        if (curr === TOKEN_ESCAPE) {

            //escape sequence
            buf = `${buf}${next}`;
            i++;

        } else if (curr === TOKEN_DOT) {

            if (buf !== '')
                tokens.push(buf); //recognize a path and push a new token

            buf = '';

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

    if (src == null)
        return <any>undefined;

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
 * getDefault is like get but takes a default value to return if
 * the path is not found.
 */
export const getDefault = <A>(path: Path, src: Record<A>, def: A): A =>
    get(path, src).orJust(() => def).get();

/**
 * getString casts the resulting value to a string.
 *
 * An empty string is provided if the path is not found.
 */
export const getString = <A>(path: Path, src: Record<A>): string =>
    get(path, src).map(v => String(v)).orJust(() => '').get();

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

    o = isRecord(r) ? clone(r) : {};
    o[toks[0]] = _set(o[toks[0]], value, toks.slice(1));

    return o;

}

/**
 * escape a path so that occurences of dots are not interpreted as paths.
 *
 * This function escapes dots and dots only.
 */
export const escape = (p: Path): Path => {

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

}

/**
 * unescape a path that has been previously escaped.
 */
export const unescape = (p: Path): Path => {

    let i = 0;
    let curr = '';
    let next = '';
    let buf = '';

    while (i < p.length) {

        curr = p[i];
        next = p[i + 1];

        if (curr === TOKEN_ESCAPE) {

            buf = `${buf}${next}`
            i++;

        } else {

            buf = `${buf}${curr}`;

        }

        i++;

    }

    return buf;

}

/**
 * escapeRecord escapes each property of a record recursively.
 */
export const escapeRecord = <A>(r: Record<A>): Record<A> =>

    reduce(r, <Record<A>>{}, (p, c, k) => {

        if (typeof c === 'object')
            p[escape(k)] = <A><any>escapeRecord(<Record<A>><any>c);
        else
            p[escape(k)] = c;

        return p

    })

/**
 * unescapeRecord unescapes each property of a record recursively.
 */
export const unescapeRecord = <A>(r: Record<A>): Record<A> =>
    reduce(r, <Record<any>>{}, (p, c, k) => {

        if (isRecord(c))
            p[unescape(k)] = unescapeRecord(<any>c);
        else
            p[unescape(k)] = c;

        return p

    })


/**
 * flatten an object into a Record where each key is a path to a non-complex
 * value or array.
 *
 * If any of the paths contain dots, they will be escaped.
 */
export const flatten = <A>(r: Record<A>): FlatRecord<A> =>
    (flatImpl<A>('')({})(r));

const flatImpl = <A>(pfix: string) => (prev: FlatRecord<any>) =>
    (r: Record<A>): FlatRecord<A> =>
        reduce(r, prev, (p, c, k) => isRecord(c) ?
            (flatImpl(prefix(pfix, k))(p)(<Record<any>>c)) :
            merge(p, { [prefix(pfix, k)]: c }));

const prefix = (pfix: string, key: string) => (pfix === '') ?
    escape(key) : `${pfix}.${escape(key)}`;

/**
 * unflatten a flattened Record so that any nested paths are expanded
 * to their full representation.
 */
export const unflatten = <A>(r: FlatRecord<A>): Record<A> =>
    reduce(r, {}, (p: Record<A>, c, k: string) => set(k, c, p));

/**
 * intersect set operation between the keys of two records.
 *
 * All the properties of the left record that have matching property
 * names in the right are retained.
 */
export const intersect = <A, B>(a: Record<A>, b: Record<B>): Record<A> =>
    reduce(a, <Record<A>>{}, (p, c, k) => {

        if (b.hasOwnProperty(k))
            p[k] = c;

        return p;

    });

/**
 * difference set operation between the keys of two records.
 *
 * All the properties on the left record that do not have matching
 * property names in the right are retained.
 */
export const difference = <A, B>(a: Record<A>, b: Record<B>): Record<A> =>
    reduce(a, <Record<A>>{}, (p, c, k) => {

        if (!b.hasOwnProperty(k))
            p[k] = c;

        return p;

    });

/**
 * map over the property names of a record.
 */
export const map = <A>(a: Record<A>, f: (s: string) => string): Record<A> =>
    reduce(a, <Record<A>>{}, (p, c, k) => {

        p[f(k)] = c;
        return p;

    });

/**
 * project a Record according to the field specification given.
 *
 * Only properties that appear in the spec and set to true will be retained.
 * This function is not safe. It may leave undefined values in the resulting
 * record.
 */
export const project =
    <A>(spec: FlatRecord<boolean>, rec: Record<A>): Record<A> =>
        reduce(spec, <Record<A>>{}, (p, c, k) =>
            (c === true) ? set(k, unsafeGet(k, rec), p) : p);

/**
 * isBadKey tests whether a key is problematic (Like __proto__).
 */
export const isBadKey = (key: string): boolean =>
    badKeys.indexOf(key) !== -1;

/**
 * sanitize is used internally to remove nefarious keys from an object.
 *
 * Notably the __proto__ key.
 */
export const sanitize = <R extends object>(r: R): R =>
    reduce(<any>r, <any>{}, (p, c, k) => {
        isBadKey(k) ?
            p :
            merge(p, {
                [k]: isRecord(c) ? sanitize(c) : c
            })
    });
