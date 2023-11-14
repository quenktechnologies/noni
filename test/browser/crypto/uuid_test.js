const { assert } = require("@quenk/test/lib/assert");

const { webGenerateV4 } = require("../../../lib/crypto/uuid");

describe("uuid", () => {
    describe("webGenerateV4", () => {
        it("should generate a v4 string", () => {
            let strs = webGenerateV4().split("-");
            assert(strs.length).equal(5);
            assert(strs[0].length).equal(8);
            assert(strs[1].length).equal(4);
            assert(strs[2].length).equal(4);
            assert(strs[3].length).equal(4);
            assert(strs[4].length).equal(12);
        });

        it("should generate without dashses", () => {
            let str = webGenerateV4(true);
            assert(str.indexOf("-")).equal(-1);
            assert(str.length).equal(32);
        });

        it("should be unique for 10K rounds", () => {
            let output = [];

            for (let i = 0; i <= 10000; i++) {
                let str = webGenerateV4();
                let idx = output.indexOf(str);
                output.push(str);

                if (idx !== -1)
                    throw new Error(
                        `Found collision for "${str}" ` + `prev=${i} curr=${i}.`
                    );
            }
        });
    });
});
