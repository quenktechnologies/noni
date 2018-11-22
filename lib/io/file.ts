import * as fs from 'fs';
import {Future, fromCallback} from '../control/monad/future';

/**
 * readText reads the contents of a file as a utf8 encoded text file.
 */
export const readText = (path:string) : Future<string> => 
  fromCallback(cb => fs.readFile(path, {encoding:'utf8'}, cb));
