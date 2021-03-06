"use strict";
/**
 * Useful functions for sorting data in an array.
 *
 * The functions are expected to be passed to Array#sort.
 * Defaults to ascending order unless specified otherwise.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.natural = exports.number = exports.string = exports.date = void 0;
/**
 * date sorts two strings representing dates.
 *
 * The dates are passed to the date constructor.
 */
var date = function (a, b) {
    var na = new Date(a).getTime();
    var nb = new Date(b).getTime();
    return na > nb ? -1 : na < nb ? 1 : 0;
};
exports.date = date;
/**
 * string sorts two strings by first lower casing them.
 */
var string = function (a, b) {
    var la = String(a).replace(/\s+/, '').toLowerCase();
    var lb = String(b).replace(/\s+/, '').toLowerCase();
    return (la > lb) ? -1 : (la < lb) ? 1 : 0;
};
exports.string = string;
/**
 * number sort
 */
var number = function (a, b) {
    var na = parseFloat(a);
    var nb = parseFloat(b);
    na = (isNaN(a)) ? -Infinity : a;
    nb = (isNaN(b)) ? -Infinity : b;
    return (na > nb) ? -1 : (na < nb) ? 1 : 0;
};
exports.number = number;
/**
 * natural sort impelmentation.
 */
var natural = function (a, b) {
    if (a === void 0) { a = ''; }
    if (b === void 0) { b = ''; }
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
        }
        else {
            return aA > bA ? -1 : 1;
        }
    }
    else if (isNaN(aInt)) { //A is not an Int
        return -1; //to make alphanumeric sort first return -1 here
    }
    else if (isNaN(bInt)) { //B is not an Int
        return 1; //to make alphanumeric sort first return 1 here
    }
    else {
        return aInt > bInt ? -1 : 1;
    }
};
exports.natural = natural;
//# sourceMappingURL=sort.js.map