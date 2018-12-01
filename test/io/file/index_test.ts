import { must } from '@quenk/must';
import { toPromise } from '../../../src/control/monad/future';
import { readTextFile, writeTextFile } from '../../../src/io/file';

const ABOUT = 'This is a flag🇹.\n';
const ABOUT_FILE = `${__dirname}/fixtures/about`;

describe('file', () => {

    describe('readTextFile', () => {

        it('must read a file\'s contents as utf8', () =>
            toPromise(readTextFile(ABOUT_FILE)
                .map(contents => must(contents).equal(ABOUT))));

    });

    describe('writeTextFile', () => {

        it('must write a file\'s contents as utf8', () =>
            toPromise(writeTextFile(ABOUT_FILE, ABOUT)
                .chain(() => readTextFile(ABOUT_FILE))
                .map(contents => must(contents).equal(ABOUT))));

    });

});

