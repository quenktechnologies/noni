"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * tick runs a function in the "next tick" using process.nextTick in node
 * or setTimeout(f, 0) elsewhere.
 */
exports.tick = function (f) { return (typeof window == 'undefined') ?
    setTimeout(f, 0) :
    process.nextTick(f); };
//# sourceMappingURL=timer.js.map