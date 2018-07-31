/**
 * Pattern is the value used to match expressions.
 */
export type Pattern
    = string
    | number
    | boolean
    | object
    | Record
    | { new(...args: any[]): object }
    ;

/**
 * Record 
 */
export type Record = { [key: string]: any }

const prims = ['string', 'number', 'boolean'];

/**
 * isTypeOf determines if some value loosely conforms to a specified type.
 *
 * It can be used to implement a sort of pattern matching and works as follows:
 * string   -> Matches on the value of the string.
 * number   -> Matches on the value of the number.
 * boolean  -> Matches on the value of the boolean.
 * object   -> Each key of the object is matched on the value, all must match.
 * function -> Treated as a constructor and results in an instanceof check or
 *             for String,Number and Boolean, this uses the typeof check.
 */
export const isTypeOf = <V>(value: V, t: Pattern): boolean =>
    ((prims.indexOf(typeof t) > -1) && (value === t)) ?
        true :
        ((typeof t === 'function') &&
            (((<Function>t === String) && (typeof value === 'string')) ||
                ((<Function>t === Number) && (typeof value === 'number')) ||
                ((<Function>t === Boolean) && (typeof value === 'boolean')) ||
                ((<Function>t === Array) && (Array.isArray(value))) ||
                (value instanceof <Function>t))) ?
            true :
            ((t instanceof RegExp) && ((typeof value === 'string') && t.test(value))) ?
                true :
                ((typeof t === 'object') && (typeof value === 'object')) ?
                    Object
                        .keys(t)
                        .every(k => value.hasOwnProperty(k) ?
                            isTypeOf((<Record>value)[k], (<Record>t)[k]) : false) :
                    false;
