"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execFile = exports.exec = void 0;
const cp = require("child_process");
const future_1 = require("../../control/monad/future");
/**
 * exec wrapper.
 *
 * Returns stdout and stderr output as a tuple.
 */
const exec = (cmd, opts) => (0, future_1.fromCallback)(cb => {
    cp.exec(cmd, opts, (err, stdout, stderr) => err ?
        cb(err) : cb(null, [stdout, stderr]));
});
exports.exec = exec;
/**
 * execFile wrapper, use this over exec() where possible.
 *
 * Returns stdout and stderr output as a tuple.
 */
const execFile = (file, args, opts) => (0, future_1.fromCallback)(cb => {
    cp.execFile(file, args, opts, (err, stdout, stderr) => err ? cb(err) : cb(null, [stdout, stderr]));
});
exports.execFile = execFile;
//# sourceMappingURL=cli.js.map