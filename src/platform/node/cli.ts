import * as cp from 'child_process';

import { Future, fromCallback } from '../../control/monad/future';
import { Path } from '../../io/file';

/**
 * Command to execute.
 */
export type Command = string;

/**
 * Options to pass to exec().
 */
export type Options = cp.ExecOptions;

/**
 * Stdout output.
 */
export type Stdout = string | Buffer;

/**
 * Stderr output.
 */
export type Stderr = string | Buffer;

/**
 * exec wrapper.
 *
 * Returns stdout and stderr output as a tuple.
 */
export const exec = (cmd: Command, opts?: Options): Future<[Stdout, Stderr]> =>
    fromCallback(cb => {
        cp.exec(cmd, opts, (err, stdout, stderr) =>
            err ? cb(err) : cb(null, [stdout, stderr])
        );
    });

/**
 * execFile wrapper, use this over exec() where possible.
 *
 * Returns stdout and stderr output as a tuple.
 */
export const execFile = (
    file: Path,
    args?: string[],
    opts?: Options
): Future<[Stdout, Stderr]> =>
    fromCallback(cb => {
        cp.execFile(file, args, opts, (err, stdout, stderr) =>
            err ? cb(err) : cb(null, [stdout, stderr])
        );
    });
