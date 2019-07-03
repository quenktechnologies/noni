/**
 * Useful functions for sorting data in an array.
 *
 * The functions are expected to be passed to Array#sort.
 * Defaults to ascending order unless specified otherwise.
 */

/**
 * Rank type.
 */
export type Rank
    = 1
    | 0
    | -1
    ;

/**
 * Sorter function type.
 */
export type Sorter<A> = (a: A, b: A) => Rank;

/**
 * date sorts two strings representing dates.
 *
 * The dates are passed to the date constructor.
 */
export const date = (a: string, b: string): Rank => {

    let na = new Date(a).getTime();
    let nb = new Date(b).getTime();
    return na > nb ? -1 : na < nb ? 1 : 0;

}

/**
 * string sorts two strings by first lower casing them.
 */
export const string = (a: string, b: string): Rank => {

    let la = String(a).replace(/\s+/, '').toLowerCase();
    let lb = String(b).replace(/\s+/, '').toLowerCase();

    return (la > lb) ? -1 : (la < lb) ? 1 : 0;

};

/**
 * number sort
 */
export const number = (a: any, b: any): Rank => {

    let na = parseFloat(a);
    let nb = parseFloat(b);

    na = (isNaN(a)) ? -Infinity : a;
    nb = (isNaN(b)) ? -Infinity : b;

    return (na > nb) ? -1 : (na < nb) ? 1 : 0;

};

/**
 * natural sort impelmentation.
 */
export const natural = (a: any = '', b: any = ''): Rank => {

    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;
    var aInt = parseInt(a, 10);
    var bInt = parseInt(b, 10);

    if (isNaN(aInt) && isNaN(bInt)) {
        var aA = String(a).replace(reA, '');
        var bA = String(b).replace(reA, '');
        if (aA === bA) {
            var aN = parseInt(String(a).replace(reN, ''), 10);
            var bN = parseInt(String(b).replace(reN, ''), 10);
            return aN === bN ? 0 : aN > bN ? -1 : 1;
        } else {
            return aA > bA ? -1 : 1;
        }
    } else if (isNaN(aInt)) { //A is not an Int
        return -1; //to make alphanumeric sort first return -1 here
    } else if (isNaN(bInt)) { //B is not an Int
        return 1; //to make alphanumeric sort first return 1 here
    } else {
        return aInt > bInt ? -1 : 1;
    }

};


