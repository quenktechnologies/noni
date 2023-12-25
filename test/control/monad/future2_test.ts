import { Run } from '../../../src/control/monad/future';

import { assert } from '@quenk/test/lib/assert';

describe('future', () => {
    describe('Future', () => {
        it('should not hang on an uncaught error', async () => {
            let caught = false;

            try {
                await new Run(() => {
                    (<{ call: Function }>{}).call();

                    return Promise.resolve();
                });
            } catch (e) {
                caught = true;

                assert((<Error>e).message.includes('is not a function')).true();
            }

            assert(caught).true();
        });
    });
});
