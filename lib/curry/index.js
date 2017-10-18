"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.f1 = function (f) { return f; };
exports.f2 = function (f) { return function (a) { return function (b) { return f(a, b); }; }; };
exports.f3 = function (f) {
    return function (a) { return function (b) { return function (c) { return f(a, b, c); }; }; };
};
exports.f4 = function (f) {
    return function (a) { return function (b) { return function (c) { return function (d) { return f(a, b, c, d); }; }; }; };
};
exports.f5 = function (f) {
    return function (a) { return function (b) { return function (c) { return function (d) { return function (e) { return f(a, b, c, d, e); }; }; }; }; };
};
exports.f6 = function (f) {
    return function (a) { return function (b) { return function (c) { return function (d) { return function (e) { return function (_f) { return f(a, b, c, d, e, _f); }; }; }; }; }; };
};
//# sourceMappingURL=index.js.map