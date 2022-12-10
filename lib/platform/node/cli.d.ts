/// <reference types="node" />
/// <reference types="node" />
import * as cp from 'child_process';
import { Future } from '../../control/monad/future';
import { Path } from '../../io/file';
/**
 * Command to execute.
 */
export declare type Command = string;
/**
 * Options to pass to exec().
 */
export declare type Options = cp.ExecOptions;
/**
 * Stdout output.
 */
export declare type Stdout = string | Buffer;
/**
 * Stderr output.
 */
export declare type Stderr = string | Buffer;
/**
 * exec wrapper.
 *
 * Returns stdout and stderr output as a tuple.
 */
export declare const exec: (cmd: Command, opts?: Options) => Future<[Stdout, Stderr]>;
/**
 * execFile wrapper, use this over exec() where possible.
 *
 * Returns stdout and stderr output as a tuple.
 */
export declare const execFile: (file: Path, args?: string[], opts?: Options) => Future<[Stdout, Stderr]>;
