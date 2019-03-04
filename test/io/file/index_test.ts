import { assert } from '@quenk/test/lib/assert';
import { isAbsolute } from 'path';
import { toPromise, pure, raise } from '../../../src/control/monad/future';
import { reduce } from '../../../src/data/record';
import {
    readTextFile,
    writeTextFile,
    statDir,
    statDirAbs,
    statDirRec,
    exists,
    list,
    listAbs,
    listRec,
    listDirs,
    listDirsAbs,
    listDirsRec,
    listFiles,
    listFilesAbs,
    listFilesRec,
    isFile,
    isDirectory,
    makeDir,
    unlink
} from '../../../src/io/file';

const ABOUT = 'This is a flag🇹.\n';
const FIXTURES = `${__dirname}/fixtures`;
const ABOUT_FILE = `${FIXTURES}/about`;
const RANDOM_FILE = '/sdkhr34038hkc';

describe('file', () => {

    describe('statDir', () => {

        it('should stat everything in the path', () =>
            toPromise(statDir(FIXTURES)
                .map(d => assert(Object.keys(d).sort())
                    .equate(['about', 'dira', 'dirb', 'dirc']))));

    });

    describe('statDirAbs', () => {

        it('should provide absolute paths', () =>
            toPromise(statDirAbs(FIXTURES)
                .map(m => assert(reduce(m, true, (p, _, k) => !p ?
                    p : isAbsolute(k))).true())));

    });

    describe('statDirRec', () => {

        it('should provide absolute paths', () =>
            toPromise(statDirRec(FIXTURES)
                .map(stats => assert(Object.keys(stats)
                    .map(p => p.split(process.cwd()).sort().join(''))).equate([
                        '/test/io/file/fixtures/about',
                        '/test/io/file/fixtures/dira',
                        '/test/io/file/fixtures/dirb',
                        '/test/io/file/fixtures/dirc',
                        '/test/io/file/fixtures/dira/dirab',
                        '/test/io/file/fixtures/dira/dirab/dirabc',
                        '/test/io/file/fixtures/dira/dirab/dirabc/filea',
                        '/test/io/file/fixtures/dirb/fileb',
                        '/test/io/file/fixtures/dirc/filea'
                    ]))));

    });

    describe('readTextFile', () => {

        it('should read a file\'s contents as utf8', () =>
            toPromise(readTextFile(ABOUT_FILE)
                .map(contents => assert(contents).equal(ABOUT))));

    });

    describe('writeTextFile', () => {

        it('should write a file\'s contents as utf8', () =>
            toPromise(writeTextFile(ABOUT_FILE, ABOUT)
                .chain(() => readTextFile(ABOUT_FILE))
                .map(contents => assert(contents).equal(ABOUT))));

    });

    describe('list', () => {

        it('should stat all the directories in a directory', () =>
            toPromise(list(FIXTURES)
                .map(d => assert(d)
                    .equate(['about', 'dira', 'dirb', 'dirc']))));

    });

    describe('listAbs', () => {

        it('should list absolute paths', () =>
            toPromise(listAbs(FIXTURES)
                .map(m => assert(m.reduce((p, c) =>
                    (!p) ? p : isAbsolute(c), true)).true())));

    });

    describe('listRec', () => {

        it('should provide paths recursively', () =>
            toPromise(listRec(FIXTURES)
                .map(list => assert(list.map(p =>
                    p.split(process.cwd()).join('')).sort()).equate([
                        '/test/io/file/fixtures/about',
                        '/test/io/file/fixtures/dira',
                        '/test/io/file/fixtures/dira/dirab',
                        '/test/io/file/fixtures/dira/dirab/dirabc',
                        '/test/io/file/fixtures/dira/dirab/dirabc/filea',
                        '/test/io/file/fixtures/dirb',
                        '/test/io/file/fixtures/dirb/fileb',
                        '/test/io/file/fixtures/dirc',
                        '/test/io/file/fixtures/dirc/filea'
                    ]))));

    });

    describe('listDirs', () => {

        it('should list all the directories in a directory', () =>
            toPromise(listDirs(FIXTURES)
                .map(l => assert(l.sort()).equate(['dira', 'dirb', 'dirc']))));

    });

    describe('listDirsAbs', () => {

        it('should list all the directories in a directory absolutely', () =>
            toPromise(listDirsAbs(FIXTURES)
                .map(l => assert(l.reduce((p, c) => !p ? p : isAbsolute(c), true))
                    .true())))

    });

    describe('listDirsRec', () => {

        it('should provide paths recursively', () =>
            toPromise(listDirsRec(FIXTURES)
                .map(list => assert(list.map(p =>
                    p.split(process.cwd()).join('')).sort()).equate([
                        '/test/io/file/fixtures/dira',
                        '/test/io/file/fixtures/dira/dirab',
                        '/test/io/file/fixtures/dira/dirab/dirabc',
                        '/test/io/file/fixtures/dirb',
                        '/test/io/file/fixtures/dirc'
                    ]))));

    });

    describe('listFiles', () => {

        it('should list all files in a directory', () =>
            toPromise(listFiles(FIXTURES)
                .map(l => assert(l.sort()).equate(['about']))));

    });

    describe('listFilesAbs', () => {

        it('should list all files in a directory absolutely', () =>
            toPromise(listFilesAbs(FIXTURES)
                .map(l => assert(l.reduce((p, c) => !p ? p : isAbsolute(c), true))
                    .true())))

    });

    describe('listFilesRec', () => {

        it('should provide paths recursively', () =>
            toPromise(listFilesRec(FIXTURES)
                .map(list => assert(list.map(p =>
                    p.split(process.cwd()).join('')).sort()).equate([
                        '/test/io/file/fixtures/about',
                        '/test/io/file/fixtures/dira/dirab/dirabc/filea',
                        '/test/io/file/fixtures/dirb/fileb',
                        '/test/io/file/fixtures/dirc/filea'
                    ]))));

    });

    describe('isFile', () => {

        it('should not fail if the file does not exist', () =>
            toPromise(isFile(RANDOM_FILE)
                .map(yes => assert(yes).be.false())));

    });

    describe('isDirectory', () => {

        it('should not fail if the directory does not exist', () =>
            toPromise(isDirectory(RANDOM_FILE)
                .map(yes => assert(yes).be.false())));

    });

    describe('makeDir', () => {

        it('should create new directories', () => {

            let dest = `${FIXTURES}/bun`;

            return toPromise(makeDir(dest)
                .chain(() => isDirectory(dest))
                .map(v => assert(v).be.true())
                .chain(() => unlink(dest)))

        });

    });

    describe('unlink', () => {

        it('should remove files', () => {

            let dest = `${FIXTURES}/../unlinkable`;

            return toPromise(writeTextFile(dest, 'will delete')
                .chain(() => readTextFile(dest))
                .map(txt => assert(txt).equal('will delete'))
                .catch(() => pure(assert(true).be.false()))
                .chain(() => unlink(dest))
                .chain(() => exists(dest))
                .map(yes => assert(yes).be.false()));
        });

        it('should remove dirs', () => {

            let dest = `${FIXTURES}/../unlinkable`;

            return toPromise(makeDir(dest)
                .chain(() => isDirectory(dest))
                .chain(yes => !yes ? raise(new Error('failed!')) : pure({}))
                .chain(() => unlink(dest))
                .chain(() => exists(dest))
                .map(yes => assert(yes).be.false()));
        });

        it('should remove non empty dirs', () => {

            let dest = `${FIXTURES}/../unlinkable`;
            let file = `${dest}/file`;

            return toPromise(makeDir(dest)
                .chain(() => isDirectory(dest))
                .chain(yes => !yes ? raise(new Error('failed!')) : pure({}))
                .chain(() => writeTextFile(file, 'will delete'))
                .chain(() => readTextFile(file))
                .map(txt => assert(txt).equal('will delete'))
                .chain(() => unlink(dest))
                .chain(() => exists(dest))
                .map(yes => assert(yes).be.false()));
        });

    });

});
