import { Future } from '../control/monad/future';
/**
 * readText reads the contents of a file as a utf8 encoded text file.
 */
export declare const readText: (path: string) => Future<string>;
