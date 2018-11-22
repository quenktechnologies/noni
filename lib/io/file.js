"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var future_1 = require("../control/monad/future");
/**
 * readText reads the contents of a file as a utf8 encoded text file.
 */
exports.readText = function (path) {
    return future_1.fromCallback(function (cb) { return fs.readFile(path, { encoding: 'utf8' }, cb); });
};
//# sourceMappingURL=file.js.map