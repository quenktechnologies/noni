import { must } from '@quenk/must';
import { toPromise } from '../../../src/control/monad/future';
import { readText } from '../../../src/io/file';

const ABOUT = 'This is a flag🇹.\n';


describe('file', () => {

    describe('readText', () => {

        it('must read a file\'s contents as utf8', () =>
            toPromise(readText(`${__dirname}/fixtures/about`)
                .map(contents => must(contents).equal(ABOUT))));

    });

});

