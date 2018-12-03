import { must } from '@quenk/must';
import { isAbsolute } from 'path';
import { toPromise } from '../../../src/control/monad/future';
import {
    readTextFile,
    writeTextFile,
    list,
    listD,
    listDA,
    listF,
    listFA,
    isFile,
    isDirectory
} from '../../../src/io/file';

const ABOUT = 'This is a flag🇹.\n';
const FIXTURES = `${__dirname}/fixtures`;
const ABOUT_FILE = `${FIXTURES}/about`;
const RANDOM_FILE = '/sdkhr34038hkc';

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

    describe('list', () => {

        it('should stat all the directories in a directory', () =>
            toPromise(list(FIXTURES)
                .map(d => must(Object.keys(d).sort())
                    .equate(['about', 'dira', 'dirb', 'dirc']))));

    });

    describe('listD', () => {

        it('should list all the directories in a directory', () =>
            toPromise(listD(FIXTURES)
                .map(l => must(l.sort()).equate(['dira', 'dirb', 'dirc']))));

    });

    describe('listDA', () => {

        it('should list all the directories in a directory absolutely', () =>
            toPromise(listDA(FIXTURES)
                .map(l => must(l.reduce((p, c) => !p ? p : isAbsolute(c), true))
                    .true())))

    });

    describe('listF', () => {

        it('should list all files in a directory', () =>
            toPromise(listF(FIXTURES)
                .map(l => must(l.sort()).equate(['about']))));

    });

    describe('listFA', () => {

        it('should list all files in a directory absolutely', () =>
            toPromise(listFA(FIXTURES)
                .map(l => must(l.reduce((p, c) => !p ? p : isAbsolute(c), true))
                    .true())))

    });

    describe('isFile', () => {

        it('should not fail if the file does not exist', () =>
            toPromise(isFile(RANDOM_FILE)
                .map(yes => must(yes).be.false())));

    });

    describe('isDirectory', () => {

        it('should not fail if the directory does not exist', () =>
            toPromise(isDirectory(RANDOM_FILE)
                .map(yes => must(yes).be.false())));

    });

});
