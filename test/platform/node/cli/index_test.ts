import { assert } from '@quenk/test/lib/assert';

import {
    doFuture,
    voidPure,
    raise
} from '../../../../lib/control/monad/future';
import { exec, execFile } from '../../../../lib/platform/node/cli';

describe('cli', () => {
    describe('exec', () => {
        it('should return stdout', () =>
            doFuture(function* () {
                let [stdout, stderr] = yield exec(`${__dirname}/stdout.sh`);

                assert(stderr).equal('');

                assert(stdout).equal('test\n');

                return voidPure;
            }));

        it('should return stderr', () =>
            doFuture(function* () {
                let [stdout, stderr] = yield exec(`${__dirname}/stderr.sh`);

                assert(stdout).equal('');

                assert(stderr).equal('test\n');

                return voidPure;
            }));

        it('should raise when the script encounters an error', () =>
            doFuture(function* () {
                let called = false;

                yield exec(`${__dirname}/err.sh`).trap(e => {
                    called = true;

                    return e.message.includes('syntax error')
                        ? voidPure
                        : raise(e);
                });

                assert(called).true();

                return voidPure;
            }));

        it('should raise when the script does not exist', () =>
            doFuture(function* () {
                let called = false;

                yield exec(`${__dirname}/nobody.sh`).trap(e => {
                    called = true;

                    return e.message.includes('not found')
                        ? voidPure
                        : raise(e);
                });

                assert(called).true();

                return voidPure;
            }));
    });

    describe('execFile', () => {
        it('should return stdout', () =>
            doFuture(function* () {
                let [stdout, stderr] = yield execFile(`${__dirname}/stdout.sh`);

                assert(stderr).equal('');

                assert(stdout).equal('test\n');

                return voidPure;
            }));

        it('should return stderr', () =>
            doFuture(function* () {
                let [stdout, stderr] = yield execFile(`${__dirname}/stderr.sh`);

                assert(stdout).equal('');

                assert(stderr).equal('test\n');

                return voidPure;
            }));

        it('should raise when the script encounters an error', () =>
            doFuture(function* () {
                let called = false;

                yield execFile(`${__dirname}/err.sh`).trap(e => {
                    called = true;

                    return e.message.includes('syntax error')
                        ? voidPure
                        : raise(e);
                });

                assert(called).true();

                return voidPure;
            }));

        it('should raise when the script does not exist', () =>
            doFuture(function* () {
                let called = false;

                yield execFile(`${__dirname}/nobody.sh`).trap(e => {
                    called = true;

                    return e.message.includes('ENOENT') ? voidPure : raise(e);
                });

                assert(called).true();

                return voidPure;
            }));
    });
});
