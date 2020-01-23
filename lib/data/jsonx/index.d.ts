/**
 * jsonx provides TypeScript definitions for an extended JSON to include Dates
 * and Buffers. This module's purpose is primarily for use with database APIs
 * that accept some non-primitive types.
 */
import { Err } from '../../control/error';
/**
 * Provides typescript definitions for JSONX strings unserialzed into JavaScript objects.
 */
import { Either } from '../either';
import { JSONXValue, JSONXObject, JSONXArray, JSONXDate, JSONXBuffer, JSONXString, JSONXBoolean, JSONXNumber, JSONXNull } from './types';
export { JSONXValue as Value, JSONXObject as Object, JSONXArray as Array, JSONXDate as Date, JSONXBuffer as Buffer, JSONXString as String, JSONXBoolean as Boolean, JSONXNumber as Number, JSONXNull as Null };
/**
 * parse a string as JSONX safely.
 */
export declare const parse: (s: string) => Either<Err, JSONXValue>;
