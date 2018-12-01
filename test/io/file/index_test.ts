import { must } from '@quenk/must';
import { toPromise } from '../../../src/control/monad/future';
import {
    readTextFile,
    writeTextFile,
    statDir,
    listDirs,
    listFiles
} from '../../../src/io/file';

const ABOUT = 'This is a flag🇹.\n';
const FIXTURES = `${__dirname}/fixtures`;
const ABOUT_FILE = `${FIXTURES}/about`;

describe('file', () => {

    describe('readTextFile', () => {

        it('should read a file\'s contents as utf8', () =>
            toPromise(readTextFile(ABOUT_FILE)
                .map(contents => must(contents).equal(ABOUT))));

    });

    describe('writeTextFile', () => {

        it('should write a file\'s contents as utf8', () =>
            toPromise(writeTextFile(ABOUT_FILE, ABOUT)
                .chain(() => readTextFile(ABOUT_FILE))
                .map(contents => must(contents).equal(ABOUT))));

    });

    describe('statDir', () => {

        it('should stat all the directories in a directory', () =>
            toPromise(statDir(FIXTURES)
                .map(d => must(Object.keys(d).sort())
                    .equate(['about', 'dira', 'dirb', 'dirc']))));

    });

    describe('listDirs', () => {

        it('should list all the directories in a directory', () =>
            toPromise(listDirs(FIXTURES)
                .map(l => must(l.sort()).equate(['dira', 'dirb', 'dirc']))));

    });

    describe('listFiles', () => {

        it('should list all files in a directory', () =>
            toPromise(listFiles(FIXTURES)
                .map(l => must(l.sort()).equate(['about']))));

    });

});
