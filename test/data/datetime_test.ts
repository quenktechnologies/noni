import { assert } from '@quenk/test/lib/assert';

import { parseDate } from '../../lib/data/datetime';

describe('datetime', () => {

    describe('parseDate', () => {

        it('should work', () => {

            let tests = [
                ['2022-10-22', '2022-10-22'],
                ['2022-10-2', '2022-10-02'],
                ['2022-1-02', '2022-01-02'],
                ['2022-1-1', '2022-01-01'],
                ['22-01-1', '2022-01-01'],
                ['22-02-1', '2022-02-01'],
                ['22-1-20', '2022-01-20'],
                ['22-7-7', '2022-07-07'],
                ['20220707', '2022-07-07'],
                ['2022077', '2022-07-07'],
                ['220707', '2022-07-07'],
                ['2277', '2022-07-07']
            ];

            for (let test of tests)
                assert(parseDate(test[0])).equal(test[1]);

        });

    });

});
