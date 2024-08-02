import * as regex from '../../../src/data/string/regex';

import { assert } from '@quenk/test/lib/assert';

describe('regex', () => {
    describe('escape', () => {
        it('should work', () => {
            let raw = '^My $special \\ po\\wer is some-thing special?';

            let expected =
                '\\^My \\$special \\\\ po\\\\wer is some\\u002dthing special\\?';

            let escaped = regex.escape(raw);
            assert(escaped).equal(expected);

            let r = new RegExp('^' + escaped);

            assert(r.test(raw)).true();
        });
    });
});
