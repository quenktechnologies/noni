"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webGenerateV4 = exports.generateV4 = void 0;
const platform_1 = require("../platform");
const rnds8 = new Uint8Array(16);
const byteToHex = [];
/**
 * generateV4 generates a string based on the 4th version of the RFC.
 */
const generateV4 = (noDash = false) => {
    // Assumes NodeJS
    if (!platform_1.isBrowser) {
        let result = require('crypto').randomUUID();
        return noDash ? result.split('-').join('') : result;
    }
    return (0, exports.webGenerateV4)(noDash);
};
exports.generateV4 = generateV4;
/**
 * @private
 */
const webGenerateV4 = (noDash = false) => {
    let rnds = crypto.getRandomValues(rnds8);
    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    if (byteToHex.length === 0)
        for (let i = 0; i < 256; ++i)
            byteToHex.push((i + 0x100).toString(16).slice(1));
    let offset = 0;
    let dash = noDash ? '' : '-';
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect.
    // See https://github.com/uuidjs/uuid/pull/434
    return (byteToHex[rnds[offset + 0]] +
        byteToHex[rnds[offset + 1]] +
        byteToHex[rnds[offset + 2]] +
        byteToHex[rnds[offset + 3]] +
        dash +
        byteToHex[rnds[offset + 4]] +
        byteToHex[rnds[offset + 5]] +
        dash +
        byteToHex[rnds[offset + 6]] +
        byteToHex[rnds[offset + 7]] +
        dash +
        byteToHex[rnds[offset + 8]] +
        byteToHex[rnds[offset + 9]] +
        dash +
        byteToHex[rnds[offset + 10]] +
        byteToHex[rnds[offset + 11]] +
        byteToHex[rnds[offset + 12]] +
        byteToHex[rnds[offset + 13]] +
        byteToHex[rnds[offset + 14]] +
        byteToHex[rnds[offset + 15]]);
};
exports.webGenerateV4 = webGenerateV4;
//# sourceMappingURL=uuid.js.map